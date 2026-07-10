# ADR-0002: El estado del proyecto gobierna la severidad de las validaciones

- Estado: Aceptado
- Fecha: 2026-07-10
- Responsables: Mantenedores del framework
- Alcance: `FRAMEWORK.yaml` (`project.status`), `scripts/`

## Contexto

Este repositorio es una plantilla: un proyecto recién inicializado contiene marcadores `CHANGE_ME` legítimos en el manifiesto y en los documentos de contexto. Si los validadores fallaran por esos marcadores desde el primer minuto, el adoptante tendría que elegir entre desactivar validaciones (mal hábito) o llenar todo antes de poder ejecutar nada. A la vez, un proyecto maduro no debe convivir con placeholders.

## Opciones consideradas

1. **Fallar siempre por placeholders**: bloquea el bootstrap y empuja a desactivar controles.
2. **Nunca fallar (solo avisos)**: los placeholders sobreviven hasta producción.
3. **Severidad según `project.status`**: en `bootstrap` los placeholders y documentos de contexto incompletos son advertencias; en cualquier otro estado (`active`, `production`, `maintenance`) son errores que rompen el gate.

## Decisión

Opción 3. `project.status: bootstrap` es el único estado con validación relajada. `scripts/init-project.mjs` deja el proyecto en `bootstrap`; el equipo lo cambia a `active` cuando completa el contexto, y desde ese momento `check-placeholders`, `validate-context` y `validate-modules` fallan ante contenido de plantilla.

Las rutas de plantilla (`scripts/templates/`, `.ai/templates/`, `.ai/decisions/adr/0000-template.md`) están siempre excluidas del escaneo de placeholders porque su contenido de plantilla es intencional. El texto dentro de bloques y spans de código Markdown tampoco se escanea, para poder documentar los marcadores.

## Consecuencias

- Positivas: bootstrap sin fricción, endurecimiento automático al declarar el proyecto activo, un único interruptor auditable en el manifiesto.
- Negativas: un proyecto que nunca salga de `bootstrap` no será forzado a completar su contexto; el checklist `PROJECT_BOOTSTRAP.md` y el health score lo hacen visible.

## Migración y rollback

Cambiar `project.status` es un cambio de una línea, reversible y sin efectos fuera de la severidad de las validaciones.

## Validación

`scripts/tests/` incluye casos con `status: bootstrap` y `status: active` verificando que la misma entrada produce advertencia o error según el estado.
