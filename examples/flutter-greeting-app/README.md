# flutter-greeting-app

App de saludo con Flutter que adopta la [extensión mobile](../../extensions/mobile/README.md) del framework: dominio puro, controlador de estado (`ChangeNotifier`) y un widget delgado, con el SDK real de Flutter instalado localmente.

## Qué incluye

- [FRAMEWORK.yaml](FRAMEWORK.yaml) lleno.
- Contexto de IA completo en `.ai/context/`.
- Una decisión registrada: [ADR-0001](.ai/decisions/adr/0001-sdk-de-flutter-via-descarga-directa.md) — por qué se descargó el SDK con `curl` directo en vez de dejar que el bootstrap interno de `flutter.bat` lo hiciera (y cómo ese cambio, no una red distinta, resolvió dos intentos previos fallidos por lentitud).
- Dominio puro en Dart: [greeting.dart](lib/domain/greeting.dart).
- Controlador de estado (`idle`/`content`/`error`, tipo sellado): [greeting_controller.dart](lib/state/greeting_controller.dart).
- Widget delgado: [greeting_form.dart](lib/widgets/greeting_form.dart).
- 18 pruebas: 14 unitarias de dominio (`package:test`, sin Flutter) y 4 de widget con render real (`flutter_test`, `testWidgets`).

## Comandos

```bash
flutter pub get                  # dependencias
flutter test                     # las 18 pruebas
flutter analyze                  # análisis estático (sin hallazgos)
dart format --set-exit-if-changed lib test   # formato (sin hallazgos)
flutter run -d chrome            # ejecutar en el navegador (única plataforma scaffoldeada, ver ADR-0001)
```

## Mensaje de saludo

Mismo contrato que `angular-greeting-app` y `react-greeting-app`:

| Entrada | Salida |
|---|---|
| `buildGreeting('Ada')` | `Hola, Ada.` |
| `buildGreeting('Ada', locale: 'en')` | `Hello, Ada.` |
| `buildGreeting('')` | lanza `GreetingError('El nombre es obligatorio.')` |
| `buildGreeting('Ana3')` | lanza `GreetingError('El nombre contiene caracteres no permitidos.')` |
