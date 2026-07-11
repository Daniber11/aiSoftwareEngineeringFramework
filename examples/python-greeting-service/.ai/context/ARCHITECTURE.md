# Arquitectura

## Estilo seleccionado
Dominio puro (`domain/`) + adaptador HTTP delgado (`adapters/http.py`) sobre FastAPI. Sin capa de aplicación separada: el servicio es demasiado pequeño para justificarla.

## Límites
- `src/greeting_service/domain/greeting.py` — `build_greeting`, `GreetingError`, sin dependencias de FastAPI.
- `src/greeting_service/adapters/http.py` — rutas FastAPI, validación de forma (`Query`), logging JSON.
- `tests/` — pruebas de dominio (pytest) y de integración (FastAPI `TestClient`, sin proceso HTTP real).

## Flujo de dependencias
`adapters/http.py → domain/greeting.py`. El dominio no conoce FastAPI.

## Contratos
API HTTP idéntica en forma a los demás ejemplos del framework: `GET /health` y `GET /greet?name&locale`.

## Datos
Sin persistencia. No se registra el nombre recibido en logs.

## Atributos de calidad
- Seguridad: validación de forma (FastAPI `Query`) y de negocio (dominio) en capas separadas, igual que `typescript-node-service`.
- Reproducibilidad: `pyproject.toml` fija versiones mínimas de FastAPI/Uvicorn/pytest/httpx.
- Observabilidad: logs JSON con correlation ID, igual que los demás ejemplos.

## Diagramas
Innecesarios a este tamaño; el flujo de dependencias de arriba es el diagrama.

## Decisiones relacionadas
- [ADR-0001: Python embebido sin instalador del sistema](../decisions/adr/0001-python-embebido-sin-instalador.md)
