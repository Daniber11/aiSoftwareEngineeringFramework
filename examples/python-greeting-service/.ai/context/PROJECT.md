# Identidad del proyecto

## Propósito
Servicio de saludo con FastAPI: adopción de referencia de la [extensión python](../../../../extensions/python/README.md), con dominio puro y Python real instalado localmente (distribución embebida, sin instalador del sistema).

## Alcance
Incluido: dominio puro con validación de negocio, API con `/health` y `/greet` sobre FastAPI, pruebas unitarias y de integración con pytest (`TestClient`, sin servidor real). Excluido: persistencia, autenticación, empaquetado con `uv`, contenedor Docker.

## Usuarios y actores
- Equipos que adoptan la extensión python: lo usan como referencia de estructura dominio/adaptador en Python.
- CI del framework: ejecuta `pytest` como gate.

## Restricciones
- Python ≥ 3.12.
- `pythonpath` en `pyproject.toml` resuelve `src/`; no depende de instalación editable (ver ADR-0001).
- Debe pasar los validadores del framework con `--root`.

## Criterios de éxito
- `python -m pytest -v` pasa en local y CI (17 pruebas: 12 de dominio, 5 de integración HTTP).
- `quality-gates.mjs --root . --skip-commands` sin errores.
- El contrato HTTP es idéntico en forma al de `minimal-service`, `java-spring-service` y `dotnet-greeting-service`.

## Estado
Mantenimiento.
