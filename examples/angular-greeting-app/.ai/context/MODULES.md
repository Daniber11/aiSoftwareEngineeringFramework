# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo           | Responsabilidad                                 | Rutas                                | Contratos                                                                                       | Pruebas                                             | Propietario        |
| ---------------- | ----------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------ |
| domain           | Reglas de saludo y validación de negocio        | `src/domain/greeting.ts`             | Función `buildGreeting(name, locale?)`; lanza `GreetingError`                                   | `test/greeting.test.ts`                             | Equipo del ejemplo |
| greeting-service | Adaptador inyectable entre Angular y el dominio | `src/app/greeting.service.ts`        | `@Injectable` `providedIn: 'root'`; método `greet(name, locale)`                                | `test/greeting-form.component.test.ts` (indirectas) | Equipo del ejemplo |
| greeting-form    | Componente standalone, estado por signals       | `src/app/greeting-form.component.ts` | Signals públicos `state`, `contentMessage`, `errorMessage`; métodos `onNameChange`, `setLocale` | `test/greeting-form.component.test.ts`              | Equipo del ejemplo |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
