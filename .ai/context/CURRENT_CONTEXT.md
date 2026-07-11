# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Cerrados los tres pendientes del pedido explícito del usuario: ejemplo Python, motor de políticas de gobernanza, y un segundo intento diagnosticado de Flutter.

## Estado
Los tres frentes de la fase 2.0 quedan entregados (perfiles, resolución de contexto, motor de políticas). Flutter se reintentó con mejor conexión de sesión pero `storage.googleapis.com` específicamente siguió lento (~100 KB/s); abandonado con diagnóstico más preciso que la vez anterior. Aún sin nueva versión etiquetada tras 1.4.0.

## Decisiones vigentes relevantes
- ADR-0001 a ADR-0006 del framework.

## Archivos o módulos en alcance
- Ninguno en curso.

## Riesgos y bloqueos
- Flutter sigue bloqueado específicamente por la velocidad de `storage.googleapis.com`, no por la sesión en general — una "mejor conexión" genérica no basta para retomarlo.
- `examples/python-greeting-service` depende de un Python embebido instalado en `~/.python-fw-example`, fuera del repositorio (reversible borrando la carpeta).

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
