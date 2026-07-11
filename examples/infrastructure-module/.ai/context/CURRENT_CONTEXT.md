# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Mantener el ejemplo como adopción de referencia de la extensión infrastructure, sincronizado con la especificación 1.2.0.

## Estado
Estable. Módulo y composición completos; `fmt`, `validate`, `plan`, `apply` y `destroy` verificados de punta a punta con Terraform 1.9.8 real, incluida la validación de variable rechazando una entrada inválida.

## Decisiones vigentes relevantes
- ADR-0001: proveedor `local` en vez de un proveedor de nube real, para que el ejemplo sea verificable sin credenciales.

## Archivos o módulos en alcance
- `modules/greeting-artifact/`
- `envs/dev/`

## Riesgos y bloqueos
- Ninguno registrado.

## Próxima acción verificable
Ejecutar `terraform fmt -check -recursive && terraform -chdir=envs/dev validate && terraform -chdir=envs/dev plan` tras cualquier cambio.
