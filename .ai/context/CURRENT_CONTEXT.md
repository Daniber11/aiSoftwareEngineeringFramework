# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Fase 1.2 del roadmap: ampliar extensiones con ejemplos ejecutables reales y cubrir la adopción de proyectos existentes (no solo bootstrap desde cero).

## Estado
1.1.0 publicado y released en GitHub (tag v1.1.0). En curso: segundo ejemplo ejecutable (`typescript-node-service`, en verde) y guía de migración (`docs/MIGRATION_GUIDE.md`) recién añadidos, aún sin nueva versión etiquetada.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.

## Archivos o módulos en alcance
- `examples/typescript-node-service/` (segundo ejemplo, con dependencias reales de npm).
- `docs/MIGRATION_GUIDE.md` (adopción incremental para proyectos existentes).
- `extensions/typescript-node/README.md`, `examples/README.md` (enlazados al nuevo ejemplo).

## Riesgos y bloqueos
- Los workflows reutilizables (`quality`, `test`, `security`) aún no tienen ejecución real en GitHub fuera de este propio repo; `release.yml` sí se verificó con el tag v1.1.0.
- Falta decidir si se etiqueta 1.2.0 ahora o se acumulan más incrementos de la fase antes del siguiente release.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
