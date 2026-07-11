# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Fase 1.3 del roadmap, con permiso explícito del usuario para instalar toolchains: Java/Spring, .NET e infrastructure completados; Flutter en curso.

## Estado
Séptimo ejemplo añadido: `examples/infrastructure-module` (módulo Terraform con proveedor `local`, verificado con `fmt`/`validate`/`plan`/`apply`/`destroy` reales). Descarga del SDK de Flutter en curso en segundo plano. Aún sin nueva versión etiquetada tras 1.2.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.

## Archivos o módulos en alcance
- `examples/infrastructure-module/` (séptimo ejemplo; ver su propio ADR-0001 sobre el proveedor local).
- `extensions/infrastructure/README.md`, `examples/README.md` (enlazados al nuevo ejemplo).

## Riesgos y bloqueos
- El usuario autorizó explícitamente (vía AskUserQuestion) las descargas de Java/Spring, .NET SDK y Flutter/Terraform. Java/Spring, .NET e infrastructure completados; Flutter (mobile) en curso.
- Terraform 1.9.8 y el SDK de Flutter viven en el scratchpad de la sesión (no commiteados); el proveedor `local` de Terraform sí queda en un `.terraform.lock.hcl` commiteado.
- Python real sigue sin autorización explícita — no intentar sin confirmación adicional.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
