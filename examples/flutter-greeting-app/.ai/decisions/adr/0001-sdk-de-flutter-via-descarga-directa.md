# ADR-0001: SDK de Flutter vía descarga directa con curl, no vía el bootstrap interno de flutter.bat

- Estado: Aceptado
- Fecha: 2026-07-11
- Responsables: Equipo del ejemplo
- Alcance: adquisición del SDK de Flutter/Dart, elección de plataformas scaffoldeadas (`--platforms=web`)

## Contexto

Los dos primeros intentos de construir este ejemplo descargaron el zip oficial del SDK (`storage.googleapis.com/flutter_infra_release/...`) con el downloader por defecto del entorno y midieron ~100-120 KB/s sostenido — a ese ritmo, más de dos horas para ~1.9 GB. Se descartó por lentitud, con el diagnóstico de que el host `storage.googleapis.com` estaba limitado en este entorno.

Un tercer intento evitó ese host clonando el árbol fuente del SDK con `git clone` (que sí fue rápido, ~22 s, tras `git config --global core.longpaths true` por rutas largas de Windows bajo `flutter/dev/`), pero el primer arranque de `flutter --version` — que descarga el binario del Dart SDK desde el mismo `storage.googleapis.com` — se estancó en 4 KB durante más de 12 minutos. Esto parecía confirmar el diagnóstico: el host, no la sesión en general, era el cuello de botella.

Antes de abandonar un cuarto intento, se verificó el diagnóstico directamente en vez de asumirlo: `curl` contra el mismo host, incluso contra el mismo objeto (`flutter_windows_3.44.6-stable.zip`, 1.9 GB), midió 12-56 MB/s sostenido — un archivo de prueba de 260 KB bajó en 0.36 s, un rango de 100 MB bajó en 2.3 s. El host nunca estuvo limitado.

## Opciones consideradas

1. **Seguir asumiendo que `storage.googleapis.com` está limitado y abandonar Flutter de nuevo.** Descartada: la medición directa con `curl` la contradice sin ambigüedad (40-56 MB/s sostenido, tres mediciones independientes).
2. **Investigar y arreglar el mecanismo interno de `flutter.bat`/`update_dart_sdk` para que use un downloader rápido.** Fuera de alcance: son scripts internos del SDK de Flutter, no de este repositorio; parchearlos no es una decisión que corresponda a un ejemplo de adopción.
3. **Descargar el zip oficial completo con `curl` y extraerlo con el `tar.exe` nativo de Windows (bsdtar, soporta zip), evitando por completo el downloader interno de `flutter.bat` para la adquisición inicial.** El SDK ya trae el Dart SDK empaquetado (`bin/cache/dart-sdk/`), así que una vez extraído no hace falta ninguna descarga adicional en el primer `flutter --version`.

## Decisión

Opción 3. La causa raíz más probable del cuello de botella no era la red hacia `storage.googleapis.com` sino el mecanismo de descarga que usaban tanto el intento 1/2 (downloader por defecto del entorno) como el bootstrap interno de `flutter.bat` en el intento 3 (que en Windows históricamente se apoya en PowerShell para bajar el Dart SDK): `Invoke-WebRequest` sin `$ProgressPreference = 'SilentlyContinue'` es conocido por ser órdenes de magnitud más lento de lo que el ancho de banda real permite, por el costo de renderizar la barra de progreso en cada fragmento. No se inspeccionó el script interno para confirmarlo con certeza — es la explicación más consistente con la evidencia (mismo host, mismo objeto, velocidad radicalmente distinta según el cliente HTTP usado), no un hecho verificado línea por línea.

Con esa hipótesis, la solución fue evitar el mecanismo lento en vez de seguir esperándolo: `curl` descargó `flutter_windows_3.44.6-stable.zip` completo (1.9 GB) en 33.7 s (56 MB/s), y `tar.exe` (el bsdtar nativo de Windows, que sí entiende zip — el `tar` de Git Bash no) lo extrajo en 53 s sin errores de ruta larga (el zip de release, a diferencia del repositorio git completo, no incluye el árbol `dev/` que causó el problema de rutas largas en el intento 3). El SDK resultante ya trae `bin/cache/dart-sdk/bin/dart.exe`, y `flutter --version` corrió limpio en 52 s sin ninguna descarga adicional.

El SDK se movió a `~/.flutter-fw-example` (mismo patrón que `~/.python-fw-example` en `python-greeting-service`), fuera del repositorio.

Se limitó `flutter create` a `--platforms=web` (en vez del default, que scaffoldea Android/iOS/Windows/Linux/macOS): es la única plataforma compilable de punta a punta en este entorno sin Android SDK ni Xcode, y evita cientos de archivos de proyectos nativos que este ejemplo no necesita para demostrar el patrón dominio/estado/widget.

## Consecuencias

- Positivas: el ejemplo existe y está verificado de punta a punta (18 pruebas, `flutter analyze` y `dart format` limpios); el patrón "descarga directa con un cliente HTTP simple en vez del bootstrap del propio SDK" queda documentado para cualquier otro toolchain que muestre el mismo síntoma (rápido por `curl`/`git`, lento por el instalador/bootstrap del propio proyecto).
- Negativas: quien clone este ejemplo y quiera Android/iOS deberá correr `flutter create --platforms=android,ios .` por su cuenta y aceptar el costo real de esos toolchains — no está cubierto aquí.
- Deuda aceptada: no se confirmó la causa raíz exacta del mecanismo lento (ver arriba); si vuelve a bloquear un intento futuro con esta misma firma (rápido por curl, lento por el bootstrap propio de la herramienta), esta ADR ya documenta el atajo, no hace falta re-diagnosticar desde cero.

## Migración y rollback

Rollback de la instalación: borrar `~/.flutter-fw-example`. Si un proyecto real necesita Android/iOS, `flutter create --platforms=android,ios .` sobre este mismo proyecto añade esas plataformas sin tocar `lib/` ni `test/`.

## Validación

`flutter test` reporta 18 pruebas correctas (14 de dominio con `package:test`, 4 de widget con `flutter_test` y render real vía `testWidgets`) usando exclusivamente el SDK descargado por este método. `flutter analyze` y `dart format --output=none --set-exit-if-changed` no reportan hallazgos.
