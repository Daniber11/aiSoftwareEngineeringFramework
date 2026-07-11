# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Publicar el release 1.3.0: fase 1.3 cerrada con 6 de 8 extensiones con ejemplo ejecutable (typescript-node, angular, react, java-spring, dotnet, infrastructure).

## Estado
1.3.0 preparado: manifiesto, CHANGELOG e inventario alineados; quality gates en verde. Pendiente confirmar y publicar el tag v1.3.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.
- ADR-0003: no se agrega extensión de datos/ML por ahora.

## Archivos o módulos en alcance
- Ninguno en curso.

## Riesgos y bloqueos
- Flutter (mobile) y Python siguen sin ejemplo ejecutable: Flutter por velocidad de red de esta sesión, Python por falta de autorización explícita. Documentado en `ROADMAP.md` y en el CHANGELOG de 1.3.0 como "Known limitations".

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
