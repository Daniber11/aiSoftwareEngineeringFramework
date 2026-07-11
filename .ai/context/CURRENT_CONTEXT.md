# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Cerrados los tres pendientes del pedido explícito del usuario: ejemplo Python, motor de políticas de gobernanza, y un tercer intento diagnosticado de Flutter.

## Estado
Los tres frentes de la fase 2.0 quedan entregados (perfiles, resolución de contexto, motor de políticas). Flutter se reintentó una tercera vez: `git clone` desde GitHub evita el host lento para el SDK completo, pero el binario del Dart SDK que `flutter --version` descarga en su primer arranque también vive en `storage.googleapis.com` y se estancó ahí. Diagnóstico ya no admite más reintentos útiles sin un host/CDN alternativo. Aún sin nueva versión etiquetada tras 1.4.0.

## Decisiones vigentes relevantes
- ADR-0001 a ADR-0006 del framework.

## Archivos o módulos en alcance
- Ninguno en curso.

## Riesgos y bloqueos
- Flutter sigue bloqueado por `storage.googleapis.com`: aplica a cualquier binario de Flutter/Dart (zip completo o solo el Dart SDK vía `git clone` + primer arranque), no solo al artefacto grande. No basta con "mejor conexión en general" ni con evitar la descarga del zip completo.
- `examples/python-greeting-service` depende de un Python embebido instalado en `~/.python-fw-example`, fuera del repositorio (reversible borrando la carpeta).

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
