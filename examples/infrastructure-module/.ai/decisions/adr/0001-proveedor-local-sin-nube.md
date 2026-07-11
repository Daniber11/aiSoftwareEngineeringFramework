# ADR-0001: Proveedor local en vez de un proveedor de nube real

- Estado: Aceptado
- Fecha: 2026-07-10
- Responsables: Equipo del ejemplo
- Alcance: `modules/greeting-artifact/`, `envs/dev/`

## Contexto

El ejemplo mínimo documentado en `extensions/infrastructure/README.md` usa `aws_s3_bucket` para ilustrar la estructura de un módulo. Ese ejemplo es correcto como referencia de sintaxis, pero no es ejecutable como prueba real: requeriría credenciales de AWS, crearía un recurso de nube facturable, y el `plan`/`apply` no podría correr en CI sin secretos. El resto de ejemplos ejecutables del framework (`minimal-service`, `java-spring-service`, `dotnet-greeting-service`, etc.) se verifican de punta a punta sin depender de servicios externos — el ejemplo de infraestructura necesitaba el mismo estándar.

## Opciones consideradas

1. **Proveedor real de nube (AWS/GCP/Azure) con credenciales del usuario**: fiel a un caso de uso real, pero irreproducible sin cuenta de nube y sin secretos configurados; no verificable en este entorno ni en el CI del framework sin exponer credenciales.
2. **Mocks o `terraform plan` sin `init` real**: no ejercita el ciclo de vida real de Terraform (no hay un verdadero proveedor resolviéndose, ni un verdadero `apply`).
3. **Proveedor `hashicorp/local`**: gestiona recursos del sistema de archivos local (`local_file`, `local_sensitive_file`) a través del protocolo real de proveedores de Terraform — mismo `init`/`plan`/`apply`/`destroy` que cualquier proveedor de nube, pero sin necesidad de credenciales ni de una cuenta externa.

## Decisión

Opción 3. El módulo `greeting-artifact` usa `hashicorp/local` para escribir un archivo de texto con el saludo generado. Esto permite ejercitar el ciclo de vida completo de Terraform (`init` descarga el proveedor real desde el registro público, `validate` verifica la configuración, `plan` calcula el cambio, `apply` lo ejecuta de verdad, `destroy` lo revierte) sin ninguna credencial, en cualquier máquina con el binario de Terraform.

La validación de variables (`name`, `locale`) se probó explícitamente pasando un valor inválido (`<script>`) y confirmando que Terraform lo rechaza antes de intentar ningún cambio — la misma garantía de "falla rápido en el borde" que los demás ejemplos del framework aplican en su dominio.

## Consecuencias

- Positivas: el ejemplo es 100% verificable sin secretos, apto para correr en CI público; demuestra el patrón real de módulos con variables validadas sin el riesgo de crear infraestructura de nube real por accidente.
- Negativas: no demuestra integración con un proveedor de nube real (autenticación, IAM, etiquetado de recursos, etc.) — eso queda documentado como snippet no ejecutable en `extensions/infrastructure/README.md`, con esta limitación explícita.
- Deuda aceptada: ninguna nueva.

## Migración y rollback

Migrar a un proveedor de nube real sería aditivo: se añadiría un módulo nuevo (p. ej. `modules/s3-bucket/`) siguiendo el mismo patrón de variables validadas, sin tocar `greeting-artifact`.

## Validación

Verificado de punta a punta con Terraform 1.9.8 real: `fmt -check`, `validate`, `plan` (mostrando `content = "Hola, Ada."` antes de aplicar), `apply` (creando `greeting.txt` con el contenido exacto), y `destroy` (revirtiéndolo). Un `plan` con `-var 'name=<script>'` fue rechazado por la regla de `validation` de la variable antes de tocar ningún recurso.
