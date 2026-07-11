# ADR-0006: Motor de políticas de gobernanza de IA, por ruta y reglas deterministas

- Estado: Aceptado
- Fecha: 2026-07-11
- Responsables: Mantenedores del framework
- Alcance: `scripts/classify-change.mjs`

## Contexto

El [ADR-0004](0004-perfiles-de-configuracion-por-ambiente.md) descartó este frente "por ahora, por falta de necesidad demostrada". Esa necesidad ya existe: el usuario lo pidió explícitamente después de revisar el estado del framework. Este ADR no contradice al 0004 — confirma su propia condición de reapertura ("un proyecto real... lo necesita") y documenta el diseño concreto, tal como se exigió antes de construir cualquier pieza vaga de la fase 2.0 (ver también ADR-0004 y ADR-0005, ambos acotados primero con el usuario).

El problema: `.ai/governance/DECISION_POLICY.md` distingue cambios que un asistente puede ejecutar sin aprobación de los que debe proponer antes. Hoy esa clasificación es autoevaluación del propio asistente, leyendo prosa libre — sin verificación externa ni consistencia entre sesiones.

## Opciones consideradas

1. **Un modelo de IA clasifica el cambio leyendo `DECISION_POLICY.md` y el diff**: es literalmente la coincidencia difusa que el ADR-0005 ya rechazó — rompería la independencia de modelo de IA que el framework declara como principio (`README.md`: "Independencia de... modelo de IA"), y produciría clasificaciones no reproducibles entre ejecuciones.
2. **Reglas deterministas por ruta (y estado A/M/D), cada una citando textualmente la categoría de `DECISION_POLICY.md` que la justifica**: mismo enfoque que el ADR-0005 (matching sobre datos ya existentes, sin heurística difusa), extendido para clasificar riesgo en vez de solo enrutar documentación.

## Decisión

Opción 2. `scripts/classify-change.mjs <ruta>[:A|M|D] ...` aplica un conjunto pequeño y explícito de reglas:

| Regla | Dispara con | Categoría de DECISION_POLICY.md citada |
|---|---|---|
| `dependency-manifest` | `package.json`, `pyproject.toml`, `*.csproj`, `build.gradle`, `go.mod`, `Cargo.toml`, etc. | "Nuevas dependencias estructurales" |
| `ci-cd-pipeline` | cualquier ruta bajo `.github/workflows/` | "Cambios de infraestructura de producción" (interpretación amplia, declarada como tal) |
| `destructive-migration` | ruta que contiene `migration`/`migrations` | "Migraciones destructivas" |
| `security-policy` | `.ai/governance/SECURITY_POLICY.md` exacto | "Cambios en seguridad, identidad o permisos" |
| `file-removed` | estado `D` (eliminado) | "Eliminación de funcionalidades" |

Cada ruta clasificada también reutiliza `matchModules`/`matchAdrs` de `scripts/resolve-context.mjs` (ADR-0005): muestra qué módulo la documenta y qué ADR **aceptados** declaran esa ruta en su alcance, para que quien revise sepa qué decisión previa podría verse afectada. El veredicto agregado de un conjunto de rutas es el peor caso: si una sola ruta dispara una regla, todo el conjunto se marca `DEBE_PROPONER_ANTES_DE_EJECUTAR` (código de salida 1).

## Consecuencias

- Positivas: clasificación reproducible y auditable — cualquiera puede ver exactamente qué regla disparó y por qué; funciona igual sin importar qué modelo de IA esté operando el asistente.
- Negativas: cobertura deliberadamente parcial. No detecta "se añadió una dependencia nueva" dentro de un manifiesto ya existente (solo que el manifiesto se tocó) — distinguir eso requeriría parsear el diff de contenido por lenguaje, fuera de alcance de esta versión. No clasifica cambios "arquitectónicos" que no dejan rastro en la ruta (p. ej. cambiar el estilo de arquitectura documentado en `ARCHITECTURE.md` sin tocar código) — sigue dependiendo del juicio de quien lee `DECISION_POLICY.md`.
- Deuda aceptada: la regla `ci-cd-pipeline` interpreta "infraestructura de producción" de forma amplia para cubrir CI/CD; es una interpretación razonable, no una cita literal, y queda marcada como tal en el propio mensaje que imprime el script.

## Migración y rollback

Aditivo puro: no cambia el comportamiento de ningún script existente ni cómo se ejecutan los quality gates. Rollback = eliminar `scripts/classify-change.mjs`.

## Validación

`scripts/tests/classify-change.test.mjs`: 8 pruebas — clasifica correctamente manifiestos de dependencias, workflows de CI, rutas de migración y eliminaciones; no marca falsos positivos en un archivo de dominio ordinario; el veredicto agregado toma el peor caso. Dogfooding real: clasificar `examples/python-greeting-service/pyproject.toml` y `.github/workflows/release.yml` de este propio repositorio produce `DEBE_PROPONER_ANTES_DE_EJECUTAR` con las razones correctas; clasificar un archivo de dominio ordinario del mismo commit produce `PUEDE_EJECUTAR_SIN_APROBACION`.
