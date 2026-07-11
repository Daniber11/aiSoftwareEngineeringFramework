# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Fase 1.3 del roadmap, con permiso explícito del usuario para instalar toolchains: Java/Spring completado; siguen .NET, mobile e infraestructura.

## Estado
Quinto ejemplo añadido: `examples/java-spring-service` (Spring Boot 3, Gradle Wrapper autocontenido, 15 pruebas, smoke test real con `bootRun`). Aún sin nueva versión etiquetada tras 1.2.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.

## Archivos o módulos en alcance
- `examples/java-spring-service/` (quinto ejemplo; ver su propio ADR-0001 sobre el Gradle Wrapper).
- `extensions/java-spring/README.md`, `examples/README.md` (enlazados al nuevo ejemplo).

## Riesgos y bloqueos
- El usuario autorizó explícitamente (vía AskUserQuestion) las descargas de Java/Spring, .NET SDK y Flutter/Terraform. Java/Spring completado; .NET y mobile/infraestructura siguen pendientes de ejecutar en esta sesión.
- El bootstrap de Gradle usó un Gradle temporal en el scratchpad (no commiteado); solo el wrapper (~44 KB) quedó en el repositorio.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
