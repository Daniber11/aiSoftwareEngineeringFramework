# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Terminar los tres pendientes que el usuario pidió explícitamente tras el reporte de estado: ejemplo Python (hecho), reintento de Flutter, motor de políticas de gobernanza de IA.

## Estado
Octavo ejemplo añadido: `examples/python-greeting-service` (FastAPI, Python 3.12 embebido sin instalador MSI, 17 pruebas, smoke test real). Siete de ocho extensiones tienen ahora ejemplo ejecutable. Aún sin nueva versión etiquetada tras 1.4.0.

## Decisiones vigentes relevantes
- ADR-0001 a ADR-0005 del framework (tooling, bootstrap, sin ML, perfiles, resolución de contexto).
- ADR-0001 local de `python-greeting-service`: distribución embebida de Python, el instalador MSI falló dos veces por restricción del entorno.

## Archivos o módulos en alcance
- `examples/python-greeting-service/` (octavo ejemplo).
- `extensions/python/README.md`, `examples/README.md` (enlazados al nuevo ejemplo).

## Riesgos y bloqueos
- Quedan dos pendientes del pedido explícito del usuario: reintentar Flutter (la red mejoró notablemente en esta sesión, de ~120 KB/s a ~870 KB/s+, vale la pena reintentar) y diseñar el motor de políticas de gobernanza de IA (requiere ADR que justifique revisar la decisión del ADR-0004).

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
