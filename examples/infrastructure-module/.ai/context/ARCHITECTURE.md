# Arquitectura

## Estilo seleccionado
Módulo pequeño y componible (`modules/greeting-artifact/`) consumido por una composición raíz por ambiente (`envs/dev/`), siguiendo exactamente la estructura recomendada por la extensión infrastructure. Un solo ambiente en este ejemplo: no hay más de un caso de uso que justifique `envs/prod/`.

## Límites
- `modules/greeting-artifact/` — variables tipadas y validadas, lógica declarativa (`locals`), un recurso (`local_file`), outputs documentados.
- `envs/dev/` — composición: solo instancia el módulo, no declara lógica propia.

## Flujo de dependencias
`envs/dev → modules/greeting-artifact`. El módulo no conoce el ambiente que lo consume.

## Contratos
Variables de entrada (`name`, `locale`, `output_dir`) y outputs (`greeting`, `file_path`) documentados en el README del módulo. Mismas reglas de validación de forma que el dominio de los demás ejemplos del framework (aunque expresadas en HCL, no en un lenguaje de programación).

## Datos
El único "dato" es el archivo `greeting.txt` generado localmente; no hay estado remoto ni credenciales.

## Atributos de calidad
- Seguridad: sin secretos, sin credenciales de nube; el proveedor `local` no tiene superficie de ataque relevante.
- Reproducibilidad: `.terraform.lock.hcl` fija la versión exacta del proveedor.
- Verificabilidad: `plan`/`apply`/`destroy` funcionan en cualquier máquina con el binario de Terraform, sin cuenta de nube (ver ADR-0001).

## Diagramas
Innecesarios a este tamaño; el flujo de dependencias de arriba es el diagrama.

## Decisiones relacionadas
- [ADR-0001: Proveedor local en vez de un proveedor de nube real](../decisions/adr/0001-proveedor-local-sin-nube.md)
