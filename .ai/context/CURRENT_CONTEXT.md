# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Cerrados los tres pendientes del pedido explícito del usuario: ejemplo Python, motor de políticas de gobernanza, y el ejemplo ejecutable de Flutter (a la cuarta, tras verificar en vez de asumir el diagnóstico de red).

## Estado
Las ocho extensiones tienen ahora ejemplo ejecutable: 1.3 queda cerrada. Los tres frentes de la fase 2.0 (perfiles, resolución de contexto, motor de políticas) también están entregados. El bloqueo de Flutter, diagnosticado tres veces como "storage.googleapis.com limitado a ~100 KB/s", resultó ser el mecanismo de descarga (downloader por defecto y bootstrap interno de `flutter.bat`), no la red — `curl` contra el mismo host midió 40-56 MB/s. Aún sin nueva versión etiquetada tras 1.4.0.

## Decisiones vigentes relevantes
- ADR-0001 a ADR-0006 del framework.
- `examples/flutter-greeting-app/.ai/decisions/adr/0001-sdk-de-flutter-via-descarga-directa.md`: patrón reusable si otro toolchain muestra la misma firma (rápido por curl/git, lento por el bootstrap propio de la herramienta).

## Archivos o módulos en alcance
- Ninguno en curso.

## Riesgos y bloqueos
- `examples/python-greeting-service` depende de un Python embebido instalado en `~/.python-fw-example`, fuera del repositorio (reversible borrando la carpeta).
- `examples/flutter-greeting-app` depende del SDK de Flutter instalado en `~/.flutter-fw-example`, fuera del repositorio (reversible borrando la carpeta). Solo la plataforma `web` está scaffoldeada (sin Android SDK ni Xcode en este entorno).

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
