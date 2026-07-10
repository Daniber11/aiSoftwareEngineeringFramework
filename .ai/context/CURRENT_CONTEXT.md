# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Mantener el release 1.2.0: fase 1.2 cerrada (guía de migración + segundo ejemplo ejecutable). Siguiente foco es 1.3: ejemplos ejecutables del resto de extensiones y decisión sobre datos/ML.

## Estado
1.2.0 preparado: manifiesto, CHANGELOG e inventario alineados; quality gates en verde. Pendiente confirmar y publicar el tag v1.2.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.

## Archivos o módulos en alcance
- `examples/typescript-node-service/` (segundo ejemplo, con dependencias reales de npm).
- `docs/MIGRATION_GUIDE.md` (adopción incremental para proyectos existentes).
- `ROADMAP.md` (1.2 cerrado, 1.3 definido con alcance explícito).

## Riesgos y bloqueos
- 1.3 requiere toolchains no disponibles/verificables en este entorno (Gradle/Maven, SDK de .NET, Python real); no intentar ejemplos ejecutables de esos stacks sin poder correrlos de punta a punta.
- Los workflows reutilizables (`quality`, `test`, `security`) siguen sin ejecución real fuera de este propio repo.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
