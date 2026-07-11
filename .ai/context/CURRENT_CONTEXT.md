# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Fase 2.0 (Runtime): dos de tres frentes entregados (perfiles, resolución de contexto). Queda sin fecha el motor de políticas de gobernanza de IA, descartado por ahora en el ADR-0004 por falta de necesidad demostrada.

## Estado
`resolve-context.mjs` implementado, probado (6 pruebas nuevas, 28/28 en el suite completo) y dogfooded contra este propio repositorio. Aún sin nueva versión etiquetada tras 1.3.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.
- ADR-0003: no se agrega extensión de datos/ML por ahora.
- ADR-0004: perfiles de configuración por ambiente.
- ADR-0005: resolución automática de contexto por ruta, cruzando `MODULES.md` y el "Alcance" de los ADR.

## Archivos o módulos en alcance
- `scripts/resolve-context.mjs`, `scripts/tests/resolve-context.test.mjs`.
- `.ai/AGENTS.md` (referencia la herramienta en su paso 5).

## Riesgos y bloqueos
- La calidad de `resolve-context.mjs` depende de que `MODULES.md` y el "Alcance" de los ADR estén al día; si no lo están, simplemente no encuentra nada (falla en silencio, documentado en el ADR-0005, no oculto).

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
