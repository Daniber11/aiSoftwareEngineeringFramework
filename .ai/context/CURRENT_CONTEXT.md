# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Fase 1.3 sustancialmente cumplida: 6 de 8 extensiones tienen ejemplo ejecutable. Flutter y Python quedan fuera por costo/autorización, no por decisión de alcance.

## Estado
Séptimo ejemplo (`examples/infrastructure-module`) publicado y en verde. El intento de descargar el SDK de Flutter se abandonó: ~120 KB/s en esta sesión, habría tomado más de 90 minutos adicionales solo para el archivo. Aún sin nueva versión etiquetada tras 1.2.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.

## Archivos o módulos en alcance
- Ninguno en curso; última tarea (Flutter) cerrada sin producir código.

## Riesgos y bloqueos
- Python real sigue sin autorización explícita — no intentar sin confirmación adicional.
- Flutter quedó abandonado por velocidad de red de esta sesión, no por decisión permanente; retomar si hay conexión más rápida disponible.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
