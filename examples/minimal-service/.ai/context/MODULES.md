# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |
|---|---|---|---|---|---|
| domain | Reglas de saludo y validación de entradas | `src/domain/greeting.mjs` | Función `buildGreeting(name, locale)`; lanza `GreetingError` ante entrada inválida | `test/greeting.test.mjs` | Equipo del ejemplo |
| http-adapter | Servidor HTTP, health check, logging estructurado y correlation ID | `src/server.mjs` | `GET /health`, `GET /greet` según `README.md` | `test/server.test.mjs` | Equipo del ejemplo |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
