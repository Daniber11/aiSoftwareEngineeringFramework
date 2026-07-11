# Arquitectura

## Estilo seleccionado
Dominio puro (`domain/`) + controlador de estado (`state/`, `ChangeNotifier`) + widget delgado (`widgets/`). Sin capa de aplicación separada: la app es demasiado pequeña para justificarla.

## Límites
- `lib/domain/greeting.dart` — `buildGreeting`, `GreetingError`, sin ningún import de `package:flutter`.
- `lib/state/greeting_controller.dart` — deriva `GreetingState` (`GreetingIdle`/`GreetingContent`/`GreetingErrorState`, jerarquía sellada) del nombre/idioma actuales; nunca guarda el saludo por separado.
- `lib/widgets/greeting_form.dart` — un `TextField` y el resultado, escuchando al controlador vía `ListenableBuilder`.
- `test/` — pruebas de dominio (`package:test`, sin Flutter) y de widget (`flutter_test`, render real vía `testWidgets`).

## Flujo de dependencias
`widgets/greeting_form.dart → state/greeting_controller.dart → domain/greeting.dart`. El dominio no conoce Flutter; el controlador no conoce widgets.

## Contratos
Mensaje de saludo idéntico en forma a `angular-greeting-app` y `react-greeting-app`: `Hola, {nombre}.` / `Hello, {name}.`. Estado de UI como tipo sellado (`idle`/`content`/`error`), nunca booleanos sueltos — misma convención que exige `extensions/mobile/README.md` sección 3.

## Datos
Sin persistencia ni red. No se registra el nombre recibido en logs (no hay logs).

## Atributos de calidad
- Seguridad: validación de negocio centralizada en el dominio; el widget no interpreta la entrada, solo la pasa al controlador.
- Reproducibilidad: `pubspec.yaml` fija versiones mínimas de Flutter/`test`/`flutter_lints`; SDK real documentado en ADR-0001.
- Observabilidad: fuera de alcance a este tamaño (sin backend, sin logs estructurados que propagar).

## Diagramas
Innecesarios a este tamaño; el flujo de dependencias de arriba es el diagrama.

## Decisiones relacionadas
- [ADR-0001: SDK de Flutter vía descarga directa, no vía el bootstrap interno de `flutter.bat`](../decisions/adr/0001-sdk-de-flutter-via-descarga-directa.md)
