# Extensión Mobile

Adapta el Core a aplicaciones móviles. Cubre las decisiones comunes y sus variantes: nativo (Kotlin/Swift) y multiplataforma (Flutter / React Native / Kotlin Multiplatform).

## 1. Arquitectura recomendada

MVVM con capa de dominio independiente del framework de UI: ViewModels exponen estado observable; el dominio y los repositorios no conocen la UI. Elegir multiplataforma solo por ADR que pese equipo, rendimiento y acceso a APIs nativas; el default para un solo producto con equipo pequeño es multiplataforma (Flutter o React Native).

## 2. Estructura de carpetas

```text
app/ (o lib/, src/)
  features/
    saludo/
      presentation/    # pantallas, ViewModel/estado
      domain/          # casos de uso, entidades
      data/            # repositorios, DTO, fuentes remotas/locales
  core/
    network/           # cliente HTTP, interceptores, correlation ID
    storage/           # persistencia local segura
    design/            # tema y componentes de diseño
test/                  # espejo de features
```

## 3. Convenciones

- Estado de pantalla como tipo sellado/único (`Loading | Content | Error`), nunca booleanos sueltos.
- Navegación declarada en un solo lugar; deep links versionados.
- Estrategia offline explícita por feature: qué se cachea, qué requiere red, cómo se reconcilia.
- Textos localizados desde el inicio; sin strings embebidos en la UI.
- Compatibilidad hacia atrás con versiones de API del backend: la app vieja debe seguir funcionando (contratos versionados).

## 4. Herramientas de calidad

- Kotlin: ktlint + detekt. Swift: SwiftFormat + SwiftLint. Flutter: `dart format` + `flutter analyze`. React Native: Prettier + ESLint + `tsc`.
- Gates idénticos al Core: formato, lint y análisis estático obligatorios en CI.

## 5. Estrategia de pruebas

- Unitarias: dominio y ViewModels con reloj y concurrencia controlados (TestDispatcher / fakeAsync).
- Integración: repositorios contra API simulada en el límite de red (MockWebServer / MSW) y BD local real.
- UI: pocas pruebas de instrumentación (Espresso / XCUITest / integration_test) en flujos críticos: arranque, login, flujo principal de negocio.
- Capturas (golden tests) para regresiones visuales de componentes de diseño.

## 6. Seguridad

- Secretos de usuario en Keychain/Keystore; nunca en preferencias planas.
- TLS obligatorio; certificate pinning solo con plan de rotación documentado.
- Sin datos sensibles en logs, capturas de multitarea ni backups automáticos.
- Ofuscación/minificación (R8/ProGuard) en release; revisión de permisos al mínimo necesario.
- Dependencias auditadas en CI igual que en backend.

## 7. Build y dependencias

- Builds firmados y reproducibles por canal (debug/beta/release) con configuración separada del código.
- Versionado semántico + build number monotónico; changelog por release de tienda.
- Fastlane (o equivalente) para firma, subida y metadatos: nada manual en releases.

## 8. CI/CD

Los workflows reutilizables del framework cubren quality/test/security con los comandos del stack; el empaquetado firmado corre en runners macOS cuando aplica (iOS).

```yaml
jobs:
  framework:
    uses: ./.github/workflows/validate-framework.yml
  quality:
    uses: ./.github/workflows/quality.yml
    with:
      format-command: dart format --output=none --set-exit-if-changed .
      lint-command: flutter analyze
  test:
    uses: ./.github/workflows/test.yml
    with:
      unit-command: flutter test
  security:
    uses: ./.github/workflows/security.yml
```

Distribución: canal interno → beta cerrada → producción por etapas (staged rollout) con monitoreo de crash rate entre etapas y rollback = detener el rollout.

## 9. Observabilidad

- Crash reporting (Crashlytics/Sentry) con símbolos subidos por CI.
- Métricas de arranque en frío, ANR/hangs y tasa de crash por release como SLI.
- Logs estructurados locales con niveles; jamás PII; correlation ID propagado al backend.

## 10. Comandos de desarrollo

```bash
flutter run                      # ejecutar en dispositivo/emulador
flutter test                     # unitarias y de widget
flutter analyze                  # análisis estático
flutter build apk --release      # artefacto Android (aab en distribución real)
```

(Equivalentes: `./gradlew`, `xcodebuild`, `npx react-native` según variante.)

## 11. Ejemplo mínimo

```dart
// features/saludo/domain/build_greeting.dart — puro
String buildGreeting(String name) {
  final trimmed = name.trim();
  if (trimmed.isEmpty) throw ArgumentError('El nombre es obligatorio.');
  if (trimmed.length > 80) throw ArgumentError('Nombre demasiado largo.');
  return 'Hola, $trimmed.';
}

// features/saludo/presentation/saludo_screen.dart — UI delgada
class SaludoScreen extends StatelessWidget {
  final String name;
  const SaludoScreen({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: Text(buildGreeting(name))));
  }
}
```

El [ejemplo flutter-greeting-app](../../examples/flutter-greeting-app/README.md) implementa este mismo patrón de forma ejecutable y probada (dominio puro + controlador `ChangeNotifier` + widget delgado, 18 pruebas con render real vía `testWidgets`) — ver su ADR-0001 sobre cómo se instaló el SDK real de Flutter en este entorno.
