# Reglas para asistentes de IA — python-greeting-service

Aplican las reglas generales del framework. Específicas de este servicio:

1. Lee `FRAMEWORK.yaml` y `.ai/context/CURRENT_CONTEXT.md` antes de cualquier cambio.
2. `src/greeting_service/domain/` no importa nada de `fastapi`; mantenlo puro.
3. Toda entrada externa se valida en `adapters/http.py` (forma, vía `Query`) antes de tocar el dominio (reglas de negocio).
4. `pytest.ini_options.pythonpath` en `pyproject.toml` resuelve `src/`; no instales el paquete en modo editable — este entorno no tiene `setuptools` (ver ADR-0001).
5. Cada cambio de comportamiento actualiza o añade pruebas en `tests/`.
