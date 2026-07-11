# Identidad del proyecto

## Propósito
App de saludo con Flutter: adopción de referencia de la [extensión mobile](../../../../extensions/mobile/README.md), con dominio puro y el SDK de Flutter real instalado localmente (distribución zip oficial, sin instalador).

## Alcance
Incluido: dominio puro con validación de negocio, controlador de estado (`ChangeNotifier`) que deriva `idle`/`content`/`error` del nombre actual, un widget delgado, pruebas de dominio (`package:test`) y de widget con render real (`flutter_test`). Solo se scaffoldeó la plataforma `web` (`flutter create --platforms=web`) — es la única compilable en este entorno sin Android SDK ni Xcode, y basta para demostrar el patrón; no se excluye Android/iOS por decisión de arquitectura, solo por disponibilidad de toolchain (ver ADR-0001). Excluido: navegación, persistencia, localización real (`intl`), CI de builds firmados.

## Usuarios y actores
- Equipos que adoptan la extensión mobile: lo usan como referencia de estructura dominio/estado/widget en Flutter.
- CI del framework: ejecuta `flutter test` como gate.

## Restricciones
- Flutter ≥ 3.44 (SDK real instalado en `~/.flutter-fw-example`, fuera del repositorio).
- Sin Android SDK ni Xcode disponibles en este entorno: solo la plataforma `web` es compilable de punta a punta aquí (ver ADR-0001).
- Debe pasar los validadores del framework con `--root`.

## Criterios de éxito
- `flutter test` pasa en local y CI (18 pruebas: 14 de dominio, 4 de widget).
- `flutter analyze` y `dart format --set-exit-if-changed` sin hallazgos.
- `quality-gates.mjs --root . --skip-commands` sin errores.
- El mensaje de saludo (`Hola, {nombre}.` / `Hello, {name}.`) es idéntico en forma al de `angular-greeting-app` y `react-greeting-app`.

## Estado
Mantenimiento.
