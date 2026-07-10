# Guía de migración

`scripts/init-project.mjs` asume un proyecto vacío: copia el framework y arranca en `bootstrap`. La mayoría de las adopciones reales no son así — hay un repositorio con historia, CI propio y producción corriendo. Esta guía cubre ese caso: cómo incorporar el framework sin romper lo que ya funciona.

## Principio

Adoptar el framework es un cambio incremental más, sujeto a las mismas reglas que cualquier otro: [DECISION_POLICY.md](../.ai/governance/DECISION_POLICY.md) y `max_unrelated_files_per_change: 0` en `FRAMEWORK.yaml`. No se reescribe el repositorio en una sola tanda; se documenta lo que ya existe y se endurece gate por gate.

## Pasos

### 1. Copiar el Core sin tocar código

Copia `FRAMEWORK.yaml`, `.ai/`, `docs/` y `scripts/` a la raíz del proyecto. No muevas ni renombres nada del código existente en este paso — es un cambio de cero riesgo, solo añade archivos.

```bash
node scripts/init-project.mjs --name mi-proyecto-existente --type <tipo-real> --risk <riesgo-real>
```

Esto dejará `project.status: bootstrap`. Es intencional (ver ADR-0002 del framework): permite documentar sin que los validadores bloqueen antes de que el contexto esté completo.

### 2. Documentar el estado real, no el ideal

Completa `.ai/context/PROJECT.md`, `ARCHITECTURE.md`, `DOMAIN.md` y `QUALITY_ATTRIBUTES.md` describiendo lo que el sistema **es hoy**, incluida su deuda técnica conocida. Un documento que describe una arquitectura aspiracional que el código no tiene es peor que no tener documento: engaña a la siguiente persona (o IA) que lo lea. Si hay decisiones de arquitectura ya tomadas informalmente, regístralas como ADR retroactivos con `node scripts/new-adr.mjs "..."` — la fecha del ADR es la de hoy, no la de cuando se decidió; el contexto lo explica.

### 3. Mapear los quality gates existentes, no inventar nuevos

Antes de activar `node scripts/quality-gates.mjs` en CI, revisa qué ya corre en el pipeline actual (lint, tests, escaneos) y declara esos comandos reales en la sección `commands` de `FRAMEWORK.yaml`. Marca en `quality_gates` como `optional` o `disabled` (nunca borres la clave) lo que el proyecto todavía no tiene — así queda visible como deuda explícita en vez de desaparecer. Súbelo a `required` cuando exista de verdad; ver [DEFINITION_OF_DONE.md](../.ai/governance/DEFINITION_OF_DONE.md).

### 4. Integrar `validate-framework.yml` sin bloquear el pipeline existente

Añade el workflow como un job más, en paralelo al CI actual, sin hacerlo requisito de merge todavía:

```yaml
jobs:
  legacy-ci: # el pipeline que ya existía
    # ...
  framework-check:
    uses: ./.github/workflows/validate-framework.yml
    continue-on-error: true # quítalo cuando el equipo decida que ya es un gate real
```

Quita `continue-on-error` como una decisión explícita del equipo, no automáticamente — es el punto en que el framework pasa de documentación a gate.

### 5. Elegir o escribir la extensión del stack

Si el stack ya está cubierto en [extensions/](../extensions/README.md), sigue sus convenciones donde no entren en conflicto con las del proyecto (si hay conflicto, gana el patrón ya establecido salvo que se decida migrar por ADR). Si no hay extensión para el stack, créala documentando lo que el proyecto **ya hace**, no lo que sería ideal.

### 6. Endurecer el estado cuando el contexto esté completo

Cambia `project.status` de `bootstrap` a `active` (o `production`/`maintenance` según corresponda) solo cuando `CURRENT_CONTEXT.md` y `MODULES.md` reflejen la realidad. A partir de ahí, `check-placeholders.mjs` y `validate-context.mjs` tratan los `CHANGE_ME` como error, no advertencia.

## Qué NO hacer

- No renombrar carpetas ni mover código existente para "encajar" con la estructura recomendada de una extensión en el mismo cambio que introduce el framework — son dos cambios distintos con riesgos distintos.
- No subir todos los `quality_gates` a `required` de golpe: cada gate nuevo que empieza a fallar en CI bloquea a todo el equipo hasta que se resuelva; súbelos uno a uno, con margen para corregir lo que encuentren.
- No escribir ADR retroactivos para decisiones triviales; solo las que un lector futuro (humano o IA) necesitaría para no deshacerlas por error.
- No dejar `project.status: bootstrap` indefinidamente: es una fase de transición, no un estado permanente. Si el proyecto lleva meses en bootstrap, es una señal de que el contexto no se está completando.

## Verificación

En cualquier punto de la migración:

```bash
node scripts/health-score.mjs
```

El score sube gradualmente a medida que el contexto se completa y los gates se activan; no se espera 100/100 desde el primer commit de adopción.
