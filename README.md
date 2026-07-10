# AI Software Engineering Framework

Metodología integral y agnóstica de modelo para iniciar, desarrollar, validar, desplegar y evolucionar proyectos de software asistidos por IA.

## Objetivo

Evitar que arquitectura, calidad, seguridad, pruebas, observabilidad y DevOps se agreguen tarde. Cada proyecto debe nacer con una base sólida, verificable y preparada para producción.

## Principios

- Contexto mínimo, precisión máxima.
- Arquitectura antes que implementación.
- Seguridad y observabilidad desde el inicio.
- Cambios pequeños, reversibles y trazables.
- Automatización antes que procesos manuales repetitivos.
- Documentación viva como fuente de verdad.
- Independencia de lenguaje, framework, proveedor y modelo de IA.
- YAGNI: activar complejidad solo cuando exista una necesidad demostrable.
- La IA propone o ejecuta según el nivel de riesgo y las reglas de gobernanza.

## Uso rápido

Requisito único: Node.js ≥ 18 (solo para el tooling; el proyecto usa su propio stack).

1. Copiar este framework al repositorio del proyecto.
2. Inicializar: `node scripts/init-project.mjs --name mi-servicio --type backend-service --risk medium`.
3. Completar `.ai/context/PROJECT.md`, `ARCHITECTURE.md`, `MODULES.md` y `CURRENT_CONTEXT.md`; registrar la primera decisión con `node scripts/new-adr.mjs "Decisión inicial de arquitectura"`.
4. Seleccionar una [extensión de stack](extensions/README.md) y declarar sus comandos en la sección `commands` de `FRAMEWORK.yaml`.
5. Cambiar `project.status` a `active` para endurecer las validaciones (ver ADR-0002) y ejecutar `node scripts/quality-gates.mjs`.
6. Entregar `CODEX_BOOTSTRAP_PROMPT.md` al asistente de IA y activar el workflow `validate-framework.yml` en CI.

¿El proyecto ya existe, con historia y CI propio? Los pasos de arriba asumen un repositorio vacío; usa la [guía de migración](docs/MIGRATION_GUIDE.md) en su lugar.

## Estructura

| Ruta | Contenido |
|---|---|
| `FRAMEWORK.yaml` | Manifiesto: identidad, autoridad, quality gates y reglas de IA. |
| `.ai/` | Gobernanza, contexto, ADR, plantillas, checklists y memoria para asistentes. |
| `docs/` | Estándares de CI/CD, observabilidad, eficiencia de contexto, madurez y [migración](docs/MIGRATION_GUIDE.md). |
| `scripts/` | Validadores, health score, quality gates y CLI ([guía](scripts/README.md)). |
| `.github/workflows/` | Workflows reutilizables de CI ([guía](.github/workflows/README.md)). |
| `extensions/` | Adaptación del Core a stacks concretos ([índice](extensions/README.md)). |
| `examples/` | Adopciones de referencia validables ([índice](examples/README.md)). |

## Validación

```bash
node scripts/quality-gates.mjs     # gate completo (validadores + comandos del manifiesto)
node scripts/health-score.mjs      # diagnóstico graduado 0-100
```

## Jerarquía de autoridad

1. Requisitos aprobados y restricciones legales.
2. `FRAMEWORK.yaml`.
3. `.ai/governance/DECISION_POLICY.md`.
4. ADR activos.
5. Arquitectura y estándares del proyecto.
6. Contexto de la tarea.
7. Código existente.
8. Suposiciones del asistente.

Ante contradicciones, el asistente debe detener la implementación riesgosa y señalar el conflicto.
