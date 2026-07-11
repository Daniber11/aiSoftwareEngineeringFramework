# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Versión 1.5.0 publicada: cierra la fase 1.3 (cobertura completa de extensiones) y la fase 2.0 (Runtime) al completo.

## Estado
Las ocho extensiones tienen ejemplo ejecutable y los tres frentes de la fase 2.0 (perfiles, resolución de contexto, motor de políticas) están entregados. Revisión final de release verificada de punta a punta: 150 pruebas automatizadas en verde a través de nueve ejemplos y seis toolchains distintos (Node, Gradle/Java, .NET, Terraform, Python embebido, Flutter), health score 100/100, inventario y CI sincronizados.

## Decisiones vigentes relevantes
- ADR-0001 a ADR-0006 del framework.
- `examples/flutter-greeting-app/.ai/decisions/adr/0001-sdk-de-flutter-via-descarga-directa.md`: patrón reusable si otro toolchain muestra la misma firma (rápido por curl/git, lento por el bootstrap propio de la herramienta).

## Archivos o módulos en alcance
- Ninguno en curso.

## Riesgos y bloqueos
- `examples/python-greeting-service` depende de un Python embebido instalado en `~/.python-fw-example`, fuera del repositorio (reversible borrando la carpeta).
- `examples/flutter-greeting-app` depende del SDK de Flutter instalado en `~/.flutter-fw-example`, fuera del repositorio. Solo la plataforma `web` está scaffoldeada (sin Android SDK ni Xcode en este entorno).
- `examples/dotnet-greeting-service` y `examples/infrastructure-module` dependen de toolchains instalados localmente al usuario (`~/.dotnet-fw-example`, `~/.terraform-fw-example`), fuera del repositorio y no persistidos entre sesiones de este entorno — deben reinstalarse antes de reverificar en una sesión nueva.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory` y luego `node scripts/prepare-release.mjs` sin argumentos.
