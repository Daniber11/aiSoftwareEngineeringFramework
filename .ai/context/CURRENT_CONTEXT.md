# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Fase 1.3 del roadmap, con permiso explícito del usuario para instalar toolchains: Java/Spring y .NET completados; siguen Python, mobile e infraestructura.

## Estado
Sexto ejemplo añadido: `examples/dotnet-greeting-service` (Minimal API, SDK de .NET 8 instalado localmente al usuario, 15 pruebas, smoke test real con `dotnet run`). Aún sin nueva versión etiquetada tras 1.2.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.

## Archivos o módulos en alcance
- `examples/dotnet-greeting-service/` (sexto ejemplo; ver su propio ADR-0001 sobre src/test hermanos y el SDK local).
- `extensions/dotnet/README.md`, `examples/README.md` (enlazados al nuevo ejemplo).
- `scripts/lib/core.mjs` (exclusiones de caché de toolchains en el conteo del inventario).

## Riesgos y bloqueos
- El usuario autorizó explícitamente (vía AskUserQuestion) las descargas de Java/Spring, .NET SDK y Flutter/Terraform. Java/Spring y .NET completados; mobile (Flutter) e infraestructura (Terraform) siguen pendientes en esta sesión. Python real no fue autorizado explícitamente en esa pregunta — no intentar sin confirmación adicional.
- El SDK de .NET quedó instalado en `~/.dotnet-fw-example` (fuera del repositorio, reversible borrando la carpeta).

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
