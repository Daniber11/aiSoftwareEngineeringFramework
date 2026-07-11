# python-greeting-service

Servicio de saludo con FastAPI que adopta la [extensión python](../../extensions/python/README.md) del framework: dominio puro, adaptador HTTP delgado, Python real instalado localmente sin instalador del sistema.

## Qué incluye

- [FRAMEWORK.yaml](FRAMEWORK.yaml) lleno.
- Contexto de IA completo en `.ai/context/`.
- Una decisión registrada: [ADR-0001](.ai/decisions/adr/0001-python-embebido-sin-instalador.md) — por qué la distribución embebida de Python en vez del instalador MSI.
- Dominio puro en Python: [greeting.py](src/greeting_service/domain/greeting.py).
- Adaptador FastAPI con health check y logs JSON: [http.py](src/greeting_service/adapters/http.py).
- 17 pruebas: 12 unitarias de dominio (pytest, con datos parametrizados) y 5 de integración HTTP (`TestClient`).

## Comandos

```bash
python -m pip install "fastapi>=0.115.0" "uvicorn>=0.30.0" "pytest>=8.3.0" "httpx>=0.27.0"
python -m pytest -v                                   # todas las pruebas
python -m uvicorn greeting_service.adapters.http:app --reload   # ejecutar el servicio (desde src/)
```

## Endpoints

Mismo contrato que `minimal-service`, `java-spring-service` y `dotnet-greeting-service`:

| Método y ruta | Respuesta |
|---|---|
| `GET /health` | `200 {"status":"ok","version":"1.0.0"}` |
| `GET /greet?name=Ada&locale=en` | `200 {"greeting":"Hello, Ada."}` |
| `GET /greet` sin `name` válido | `400 {"error":"..."}` |
