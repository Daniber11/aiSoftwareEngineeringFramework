# Identidad del proyecto

## Propósito
Módulo de Terraform que genera un artefacto de saludo: adopción de referencia de la [extensión infrastructure](../../../../extensions/infrastructure/README.md), con variables tipadas y validadas, sin depender de ninguna cuenta de nube.

## Alcance
Incluido: un módulo (`modules/greeting-artifact/`) con variables validadas y outputs documentados, una composición de ambiente (`envs/dev/`) que lo instancia, y verificación completa (`fmt`, `validate`, `plan`, `apply`, `destroy`) contra el proveedor `local`. Excluido: cualquier proveedor de nube real (AWS/GCP/Azure), estado remoto, políticas OPA/Sentinel, CI/CD de infraestructura.

## Usuarios y actores
- Equipos que adoptan la extensión infrastructure: lo usan como referencia de estructura de módulos y variables validadas.
- CI del framework: puede ejecutar `terraform plan` sin secretos ni credenciales de nube, porque el proveedor `local` no las necesita.

## Restricciones
- Terraform ≥ 1.5 (por la sintaxis de `validation` usada).
- Proveedor `hashicorp/local` únicamente: es la única forma de que este ejemplo sea ejecutable en cualquier máquina, sin cuenta de nube (ver ADR-0001).
- Debe pasar los validadores del framework con `--root`.

## Criterios de éxito
- `terraform fmt -check -recursive`, `terraform validate` y `terraform plan` pasan en local y CI, sin credenciales.
- Un `terraform apply` real produce el archivo `greeting.txt` con el contenido esperado; `terraform destroy` lo revierte.
- Una variable inválida (`name` con caracteres no permitidos) es rechazada por Terraform antes de intentar ningún cambio.

## Estado
Mantenimiento.
