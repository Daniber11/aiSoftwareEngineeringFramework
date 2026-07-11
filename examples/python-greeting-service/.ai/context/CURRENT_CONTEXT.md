# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Mantener el ejemplo como adopción de referencia de la extensión python, sincronizado con la especificación 1.4.0.

## Estado
Estable. Dominio, adaptador HTTP y pruebas completos y en verde (17 pruebas). Smoke test manual con `uvicorn` confirmó `/health` y `/greet` respondiendo.

## Decisiones vigentes relevantes
- ADR-0001: distribución embebida de Python (sin instalador MSI), `pythonpath` en vez de instalación editable.

## Archivos o módulos en alcance
- `src/greeting_service/domain/greeting.py`
- `src/greeting_service/adapters/http.py`
- `tests/`

## Riesgos y bloqueos
- Ninguno registrado.

## Próxima acción verificable
Ejecutar `python -m pytest -v` tras cualquier cambio; debe pasar completo.
