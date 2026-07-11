# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Mantener el ejemplo como adopción de referencia de la extensión mobile, sincronizado con la especificación 1.4.0.

## Estado
Estable. Dominio, controlador de estado y widget completos y en verde (18 pruebas). `flutter analyze` y `dart format --set-exit-if-changed` sin hallazgos.

## Decisiones vigentes relevantes
- ADR-0001: el SDK de Flutter se instaló descargando el zip oficial directo con `curl` en vez de dejar que `flutter.bat` lo bootstrapee internamente — el mecanismo interno (probablemente `Invoke-WebRequest` de PowerShell) era el cuello de botella real, no la red hacia `storage.googleapis.com` (que mide 40-56 MB/s con `curl`).

## Archivos o módulos en alcance
- `lib/domain/greeting.dart`
- `lib/state/greeting_controller.dart`
- `lib/widgets/greeting_form.dart`
- `test/`

## Riesgos y bloqueos
- Ninguno registrado. El SDK vive en `~/.flutter-fw-example`, fuera del repositorio (reversible borrando la carpeta).

## Próxima acción verificable
Ejecutar `flutter test` tras cualquier cambio; debe pasar completo (18 pruebas).
