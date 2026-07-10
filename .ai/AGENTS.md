# Reglas para asistentes de IA

Este archivo aplica a cualquier asistente que trabaje en el repositorio.

## Inicio obligatorio

Lee, en orden:

1. `FRAMEWORK.yaml`.
2. `.ai/context/CURRENT_CONTEXT.md`.
3. `.ai/governance/DECISION_POLICY.md`.
4. `.ai/context/MODULES.md`.
5. Documentos y archivos estrictamente relacionados con la tarea.

## Conducta

- Resuelve el problema con el menor cambio seguro.
- No amplíes el alcance silenciosamente.
- No inventes requisitos.
- No ocultes incertidumbre.
- No sustituyas pruebas por confianza.
- No desactives controles para hacer pasar el pipeline.
- Respeta convenciones, contratos y ADR vigentes.
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
