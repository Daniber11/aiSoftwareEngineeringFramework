# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |
|---|---|---|---|---|---|
| domain | Reglas de saludo y validación de negocio | `src/Domain/Greeting.cs` | `Greeting.Build(name, locale)`; lanza `GreetingException` | `test/GreetingTests.cs` | Equipo del ejemplo |
| program | Minimal API, health check, logging | `src/Program.cs` | `GET /health`, `GET /greet` según `README.md` | `test/ProgramTests.cs` | Equipo del ejemplo |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
