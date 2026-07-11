# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |
|---|---|---|---|---|---|
| domain | Reglas de saludo y validación de negocio | `src/main/java/com/framework/example/domain/` | `Greeting.build(name, locale)`; lanza `GreetingException` | `src/test/java/.../domain/GreetingTest.java` | Equipo del ejemplo |
| web | Controlador REST, health check, logging | `src/main/java/com/framework/example/web/` | `GET /health`, `GET /greet` según `README.md` | `src/test/java/.../web/GreetingControllerTest.java` | Equipo del ejemplo |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
