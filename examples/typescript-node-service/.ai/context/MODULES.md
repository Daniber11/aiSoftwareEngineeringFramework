# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo       | Responsabilidad                                                    | Rutas                         | Contratos                                                     | Pruebas                 | Propietario        |
| ------------ | ------------------------------------------------------------------ | ----------------------------- | ------------------------------------------------------------- | ----------------------- | ------------------ |
| domain       | Reglas de saludo y validación de negocio                           | `src/domain/greeting.ts`      | Función `buildGreeting(name, locale?)`; lanza `GreetingError` | `test/greeting.test.ts` | Equipo del ejemplo |
| http-adapter | Servidor HTTP, validación de forma con zod, health check y logging | `src/adapters/http/server.ts` | `GET /health`, `GET /greet` según `README.md`                 | `test/server.test.ts`   | Equipo del ejemplo |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
