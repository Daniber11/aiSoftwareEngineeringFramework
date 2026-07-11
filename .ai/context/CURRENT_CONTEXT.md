# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Cerrar los tres pendientes del pedido explícito del usuario: ejemplo Python (hecho), reintento de Flutter (en curso, descarga en segundo plano), motor de políticas de gobernanza de IA (hecho).

## Estado
Los tres frentes de la fase 2.0 quedan entregados: perfiles (ADR-0004), resolución de contexto (ADR-0005) y motor de políticas (ADR-0006). Aún sin nueva versión etiquetada tras 1.4.0.

## Decisiones vigentes relevantes
- ADR-0001 a ADR-0006 del framework.
- ADR-0006 revisa explícitamente la postura de "no por ahora" del ADR-0004, justificada por el pedido explícito del usuario — no una contradicción, sino su propia condición de reapertura cumpliéndose.

## Archivos o módulos en alcance
- `scripts/classify-change.mjs`, `scripts/tests/classify-change.test.mjs`.
- `.ai/AGENTS.md` (referencia el motor de políticas antes de tocar rutas sensibles).

## Riesgos y bloqueos
- Descarga del SDK de Flutter en curso en segundo plano (la red mejoró de ~120 KB/s a ~870 KB/s en esta sesión); pendiente construir el ejemplo si termina a tiempo.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
