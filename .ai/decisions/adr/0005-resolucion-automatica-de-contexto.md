# ADR-0005: Resolución automática de contexto por ruta, cruzando MODULES.md y el Alcance de los ADR

- Estado: Aceptado
- Fecha: 2026-07-11
- Responsables: Mantenedores del framework
- Alcance: `scripts/resolve-context.mjs`, `scripts/lib/core.mjs`

## Contexto

`.ai/AGENTS.md` instruye: lee `FRAMEWORK.yaml`, `CURRENT_CONTEXT.md`, `DECISION_POLICY.md`, `MODULES.md` y "documentos y archivos estrictamente relacionados con la tarea". Ese último paso es manual: el asistente (humano o IA) tiene que inferir por su cuenta qué ADR y qué fila de `MODULES.md` aplican a la ruta que va a tocar. Es exactamente el tipo de trabajo repetitivo que `docs/CONTEXT_EFFICIENCY.md` pide minimizar ("prioriza búsquedas dirigidas"). Es la segunda pieza de la fase 2.0 del roadmap, acotada explícitamente con el usuario antes de construir (igual que ADR-0004 para perfiles).

## Opciones consideradas

1. **Metadatos nuevos por archivo** (p. ej. un `context.map.json` que liste manualmente qué documento corresponde a cada ruta): exacto, pero es una fuente de verdad adicional que hay que mantener sincronizada a mano — exactamente el problema que ya tiene la relación implícita actual, solo que en un archivo nuevo en vez de en la cabeza de quien trabaja.
2. **Coincidencia difusa / embeddings sobre el contenido de los documentos**: no determinista, requeriría un modelo o servicio externo, y el framework es explícitamente agnóstico de modelo de IA (ver `README.md`: "Independencia de... modelo de IA"). Descartado.
3. **Cruzar la ruta dada contra datos que ya existen y que el framework ya obliga a mantener**: la columna "Rutas" de `MODULES.md` (validada por `validate-modules.mjs`: cada ruta declarada debe existir) y el campo "- Alcance:" de cada ADR (obligatorio en la plantilla desde el ADR-0000). Ninguna fuente de verdad nueva; si estos datos están desactualizados, ya lo estarían para un lector humano también.

## Decisión

Opción 3. `scripts/resolve-context.mjs <ruta>`:
1. Lee `.ai/context/MODULES.md`, encuentra las filas cuya columna "Rutas" es prefijo (o coincidencia exacta) de la ruta dada.
2. Lee cada ADR en `.ai/decisions/adr/` (excluida la plantilla `0000-template.md`), extrae las rutas entre backticks de su línea "- Alcance:", y encuentra los que cubren la ruta dada.
3. Devuelve ambos resultados junto con los cuatro documentos que `AGENTS.md` pide leer siempre.

El matching de rutas exige que el separador sea `/` (`src/domain-extra/x.ts` no coincide con el módulo de ruta `src/domain/`), para no dar falsos positivos por coincidencia de prefijo de texto. `--json` permite que otro script o un asistente de IA consuma el resultado directamente.

## Consecuencias

- Positivas: cero mantenimiento adicional (reutiliza datos ya obligatorios); determinista y auditable (se puede ver exactamente por qué se sugirió cada documento); funciona igual en cualquier proyecto adoptante, no solo en este repositorio.
- Negativas: la calidad de la resolución depende de que `MODULES.md` y los "- Alcance:" de los ADR estén al día — si un módulo nuevo no se documenta, `resolve-context.mjs` simplemente no lo encuentra (falla en silencio, no con error, porque no encontrar módulo es un caso legítimo, no un error). Esto es una limitación conocida, no oculta: mismo problema que ya tenía la lectura manual.
- Deuda aceptada: no resuelve "qué extensión de stack aplica" — eso requeriría inferir el stack desde la ruta o el tipo de archivo, un problema distinto que no se ha demostrado necesario todavía.

## Migración y rollback

Aditivo puro: no cambia el comportamiento de ningún script existente. Rollback = eliminar `scripts/resolve-context.mjs`.

## Validación

`scripts/tests/resolve-context.test.mjs`: `matchModules` encuentra por prefijo y por coincidencia exacta, no confunde prefijos parciales de nombre de carpeta, y no lanza cuando no hay coincidencia; `matchAdrs` encuentra el ADR correcto e ignora la plantilla. Verificado además contra este propio repositorio: `node scripts/resolve-context.mjs scripts/quality-gates.mjs` devuelve el módulo `automation` y los tres ADR (0001, 0002, 0004) cuyo Alcance realmente cubre ese archivo.
