# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |
|---|---|---|---|---|---|
| domain | Reglas de saludo y validación de negocio | `lib/domain/greeting.dart` | `buildGreeting(name, {locale})`; lanza `GreetingError` | `test/greeting_test.dart` | Equipo del ejemplo |
| state | Deriva el estado de UI (idle/content/error) del dominio | `lib/state/greeting_controller.dart` | `GreetingController extends ChangeNotifier`; `state` deriva de `name`/`locale` | Cubierto indirectamente por `test/greeting_form_test.dart` | Equipo del ejemplo |
| widgets | Presentación: campo de nombre y resultado | `lib/widgets/greeting_form.dart`, `lib/main.dart` | Claves estables (`name-field`, `greeting-content`, `greeting-error`, `greeting-idle`) para pruebas | `test/greeting_form_test.dart` | Equipo del ejemplo |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
