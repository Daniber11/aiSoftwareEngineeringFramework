# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Fase 2.0 (Runtime) iniciada: perfiles de configuración por ambiente implementados y verificados. Siguiente foco dentro de 2.0: resolución automática de contexto (sin diseñar aún).

## Estado
`profiles` en FRAMEWORK.yaml + `resolve-profile.mjs` + `quality-gates.mjs --profile` implementados, probados (7 pruebas nuevas) y dogfooded en este propio repo (`contributor`, `release`). Aún sin nueva versión etiquetada tras 1.3.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.
- ADR-0003: no se agrega extensión de datos/ML por ahora.
- ADR-0004: perfiles de configuración por ambiente (overrides parciales de quality_gates/ai/commands).

## Archivos o módulos en alcance
- `scripts/lib/core.mjs` (`resolveProfile`), `scripts/validate-manifest.mjs`, `scripts/resolve-profile.mjs`, `scripts/quality-gates.mjs` (`--profile`).
- `FRAMEWORK.yaml` (sección `profiles: contributor, release`).

## Riesgos y bloqueos
- `quality_gates`/`ai` dentro de un perfil siguen siendo declarativos (no auto-forzados) — documentado explícitamente en el ADR-0004, no es una limitación oculta.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
