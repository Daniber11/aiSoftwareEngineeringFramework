# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |
|---|---|---|---|---|---|
| domain | Reglas de saludo y validación de negocio | `src/domain/greeting.ts` | Función `buildGreeting(name, locale?)`; lanza `GreetingError` | `test/greeting.test.ts` | Equipo del ejemplo |
| use-greeting | Hook con estado y estado derivado sobre el dominio | `src/app/useGreeting.ts` | `useGreeting(initialName?)` retorna `{ name, locale, state, setName, setLocale }` | `test/greeting-form.test.tsx` (indirectas) | Equipo del ejemplo |
| greeting-form | Componente de presentación | `src/app/GreetingForm.tsx` | Input controlado + estado idle/content/error con roles ARIA | `test/greeting-form.test.tsx` | Equipo del ejemplo |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
