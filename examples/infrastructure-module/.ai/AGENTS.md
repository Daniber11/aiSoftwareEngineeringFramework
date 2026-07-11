# Reglas para asistentes de IA — infrastructure-module

Aplican las reglas generales del framework. Específicas de este proyecto:

1. Lee `FRAMEWORK.yaml` y `.ai/context/CURRENT_CONTEXT.md` antes de cualquier cambio.
2. Nunca ejecutes `terraform apply` fuera de `envs/dev` (el único ambiente de este ejemplo) ni contra un backend remoto: no existe ninguno configurado.
3. El módulo usa el proveedor `local` a propósito (ver ADR-0001); no lo cambies por un proveedor de nube sin discutirlo primero — el ejemplo dejaría de ser verificable sin credenciales.
4. Toda variable nueva necesita `type`, `description` y, si tiene invariantes, `validation`.
5. `terraform fmt -check -recursive` y `terraform validate` deben pasar antes de dar por terminado un cambio.
