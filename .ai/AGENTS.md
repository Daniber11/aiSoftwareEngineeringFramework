# Reglas para asistentes de IA

Este archivo aplica a cualquier asistente que trabaje en el repositorio.

## Inicio obligatorio

Lee, en orden:

1. `FRAMEWORK.yaml`.
2. `.ai/context/CURRENT_CONTEXT.md`.
3. `.ai/governance/DECISION_POLICY.md`.
4. `.ai/context/MODULES.md`.
5. Documentos y archivos estrictamente relacionados con la tarea — `node scripts/resolve-context.mjs <ruta>` calcula automáticamente qué módulo de `MODULES.md` y qué ADR aplican a una ruta dada (ver ADR-0005); úsalo antes de buscar manualmente.

## Conducta

- Resuelve el problema con el menor cambio seguro.
- No amplíes el alcance silenciosamente.
- No inventes requisitos.
- No ocultes incertidumbre.
- No sustituyas pruebas por confianza.
- No desactives controles para hacer pasar el pipeline.
- Respeta convenciones, contratos y ADR vigentes. Antes de tocar rutas sensibles (manifiestos de dependencias, workflows de CI/CD, migraciones), corre `node scripts/classify-change.mjs <ruta>...` — si el veredicto es `DEBE_PROPONER_ANTES_DE_EJECUTAR`, sigue el formato de propuesta de `DECISION_POLICY.md` antes de ejecutar (ver ADR-0006).
- Actualiza documentación cuando cambie el comportamiento.
- Evita reescribir código correcto sin beneficio medible.
- Conserva compatibilidad salvo autorización explícita.

## Salida al finalizar

Incluye:

- Resumen.
- Archivos modificados.
- Pruebas o validaciones.
- Riesgos y supuestos.
- Acción humana requerida, solo cuando exista.
