# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |
|---|---|---|---|---|---|
| domain | Reglas de saludo y validación de negocio | `src/greeting_service/domain/greeting.py` | `build_greeting(name, locale)`; lanza `GreetingError` | `tests/test_greeting.py` | Equipo del ejemplo |
| http-adapter | Rutas FastAPI, health check, logging | `src/greeting_service/adapters/http.py` | `GET /health`, `GET /greet` según `README.md` | `tests/test_http.py` | Equipo del ejemplo |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
