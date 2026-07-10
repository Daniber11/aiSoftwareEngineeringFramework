# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Mantener el release 1.1.0 del framework: Core documental, validadores ejecutables, workflows reutilizables, ejemplo de adopción y extensiones por stack.

## Estado
Implementación 1.1.0 completa. Validadores, quality gates y pruebas del tooling en verde localmente.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.

## Archivos o módulos en alcance
- `scripts/` (validadores y CLI).
- `.github/workflows/` (CI reutilizable).
- `examples/minimal-service/` (adopción de referencia).
- `extensions/` (guías por stack).

## Riesgos y bloqueos
- Los workflows reutilizables (`quality`, `test`, `security`, `release`) aún no tienen ejecución real en GitHub; solo `validate-framework.yml` corre en cada push.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0.
