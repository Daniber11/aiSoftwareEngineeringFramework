# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Publicar el release 1.4.0: fase 2.0 con dos de tres frentes entregados (perfiles de configuración, resolución automática de contexto).

## Estado
1.4.0 preparado: manifiesto, CHANGELOG e inventario alineados; quality gates en verde (sin perfil, `--profile contributor`, `--profile release`). Pendiente confirmar y publicar el tag v1.4.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.
- ADR-0003: no se agrega extensión de datos/ML por ahora.
- ADR-0004: perfiles de configuración por ambiente.
- ADR-0005: resolución automática de contexto por ruta.

## Archivos o módulos en alcance
- Ninguno en curso.

## Riesgos y bloqueos
- El motor de políticas de gobernanza de IA (tercer frente de 2.0) sigue sin diseñar; descartado "por ahora" en el ADR-0004, sin fecha.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
