# Automatizaciones

Scripts idempotentes en Node.js ≥ 18, sin dependencias externas (ADR-0001). Funcionan igual en local y en CI, sobre este repositorio o sobre cualquier proyecto adoptante (`--root <ruta>` apunta a otro proyecto; por defecto se busca `FRAMEWORK.yaml` hacia arriba).

## Ciclo de vida

```bash
node scripts/init-project.mjs --name mi-servicio --type backend-service --risk medium
node scripts/new-adr.mjs "Decisión inicial de arquitectura"
node scripts/quality-gates.mjs          # gate local completo
node scripts/health-score.mjs           # diagnóstico graduado 0-100
node scripts/prepare-release.mjs        # verificación previa a release
```

## Scripts

| Script | Propósito | Falla cuando |
|---|---|---|
| `init-project.mjs` | Personaliza `project.*` del manifiesto, deja `status: bootstrap` y restaura el contexto activo y el índice de módulos desde `templates/`. No sobrescribe contenido real salvo `--force`. | Faltan `--name`/`--type` o el riesgo es inválido. |
| `validate-structure.mjs` | Archivos obligatorios presentes y no vacíos. Autodetecta perfil: proyecto adoptante (mínimo) o repositorio del framework (completo). | Falta cualquier ruta obligatoria. |
| `validate-manifest.mjs` | `FRAMEWORK.yaml` cumple el esquema: claves obligatorias, valores permitidos, rutas de `authority` existentes, 12 quality gates declarados. | Cualquier violación del esquema. |
| `validate-links.mjs` | Todos los enlaces Markdown relativos resuelven; `framework-inventory.json` (si existe) tiene entrypoints reales y `file_count` exacto. | Enlace roto o inventario desincronizado. |
| `validate-context.mjs` | El contexto activo tiene sus seis secciones con contenido y ≤ 60 líneas (advertencia). | Sección ausente/vacía, o marcador de plantilla fuera de bootstrap. |
| `validate-modules.mjs` | El índice de módulos documenta módulos reales y sus rutas existen. | Ruta inexistente, o fila de plantilla fuera de bootstrap. |
| `check-placeholders.mjs` | Sin `CHANGE_ME` en documentación (error; advertencia en bootstrap). `TODO`, `FIXME`, `TBD` y `HACK` son siempre advertencia. Excluye rutas de plantilla y código dentro de Markdown. | Marcador de plantilla fuera de bootstrap. |
| `new-adr.mjs "Título"` | Crea el siguiente ADR numerado desde la plantilla 0000 con fecha del día. | Sin título o número duplicado. |
| `health-score.mjs` | Ejecuta todos los validadores y pondera un score 0-100 (`--json`, `--out reporte.json`). Niveles: ≥90 saludable, ≥70 aceptable, ≥50 insuficiente, <50 crítico. | Score < 70 (código de salida 1). |
| `quality-gates.mjs` | Gate local completo: todos los validadores y después los comandos de la sección `commands` del manifiesto (`--skip-commands` los omite). `--profile <nombre>` usa los `commands` resueltos de ese perfil (ver ADR-0004). | Cualquier validador con errores o comando con salida ≠ 0. |
| `resolve-profile.mjs <nombre>` | Imprime la configuración efectiva (`quality_gates`, `ai`, `commands`) de un perfil declarado en `FRAMEWORK.yaml: profiles` (`--json` para máquina). Herramienta de inspección; no ejecuta nada. | Perfil inexistente. |
| `resolve-context.mjs <ruta>` | Calcula qué módulo de `MODULES.md` y qué ADR (por su campo "Alcance:") cubren una ruta dada (`--json` para máquina). Ver ADR-0005. | Falta el argumento de ruta. |
| `classify-change.mjs <ruta>[:A\|M\|D] ...` | Clasifica rutas contra las categorías de `DECISION_POLICY.md` con reglas deterministas (manifiestos de dependencias, workflows de CI, migraciones, eliminación de archivos). Ver ADR-0006. | Alguna ruta dispara una regla (`DEBE_PROPONER_ANTES_DE_EJECUTAR`, salida ≠ 0) — es la señal, no un fallo del script. |
| `prepare-release.mjs` | Verifica versión del manifiesto ↔ entrada de CHANGELOG ↔ inventario, y corre los quality gates. `--sync-inventory` regenera `framework-inventory.json`. | Cualquier verificación fallida. |

## Severidad según el estado del proyecto (ADR-0002)

Con `project.status: bootstrap` los marcadores de plantilla son advertencias; con cualquier otro estado (`active`, `production`, `maintenance`) son errores. `init-project.mjs` deja el proyecto en bootstrap; cambia el estado a `active` cuando el contexto esté completo.

## Perfiles de configuración por ambiente (ADR-0004)

`FRAMEWORK.yaml` admite una sección opcional `profiles` con overrides parciales por clave de `quality_gates`, `ai` y `commands`. Sin `profiles` o sin pedir uno, nada cambia — es aditivo y retrocompatible.

```yaml
profiles:
  dev:
    quality_gates:
      e2e_tests: optional        # solo esta clave cambia; el resto se hereda
    ai:
      default_autonomy: full
    commands:
      tests: npm run test:fast   # sobrescribe o añade un comando
```

```bash
node scripts/resolve-profile.mjs dev          # inspecciona qué se resolvería
node scripts/quality-gates.mjs --profile dev  # ejecuta el gate con los commands de "dev"
```

Este propio repositorio declara `contributor` (autonomía `full`, escaneos de dependencias/secretos `optional`, para iteración local) y `release` (añade `release_check: node scripts/prepare-release.mjs`) como ejemplo real.

## Resolución automática de contexto (ADR-0005)

`node scripts/resolve-context.mjs <ruta>` cruza la ruta dada contra la columna "Rutas" de `.ai/context/MODULES.md` y el campo "- Alcance:" de cada ADR, y devuelve qué módulo y qué decisiones aplican — sin metadatos nuevos que mantener, solo lo que el framework ya obliga a declarar.

```bash
node scripts/resolve-context.mjs scripts/quality-gates.mjs
node scripts/resolve-context.mjs examples/react-greeting-app/src/app/GreetingForm.tsx --json
```

## Motor de políticas de gobernanza de IA (ADR-0006)

`node scripts/classify-change.mjs <ruta>[:A|M|D] ...` clasifica un conjunto de rutas cambiadas contra las categorías de `.ai/governance/DECISION_POLICY.md` con reglas deterministas por ruta (manifiestos de dependencias, workflows de CI/CD, rutas de migración, `SECURITY_POLICY.md`, archivos eliminados) — no interpreta el texto libre de la política con un modelo. Reutiliza `matchModules`/`matchAdrs` de `resolve-context.mjs` para mostrar qué ADR aceptados podrían verse afectados.

```bash
node scripts/classify-change.mjs "package.json" "src/domain/greeting.ts"
# Veredicto: DEBE_PROPONER_ANTES_DE_EJECUTAR (package.json toca un manifiesto de dependencias)

git diff --name-status main | awk '{print $2":"$1}' | xargs node scripts/classify-change.mjs
```

El código de salida es 1 cuando el veredicto es `DEBE_PROPONER_ANTES_DE_EJECUTAR` — úsalo como gate, no solo como reporte.

## Subconjunto YAML soportado en FRAMEWORK.yaml

El parser propio (`lib/core.mjs`) admite mapas anidados por indentación, escalares (texto, número, booleano, null, comillas), listas simples de `- valor` y comentarios `#`. No admite anclas, alias, valores multilínea ni colecciones en línea. Mantén el manifiesto dentro de este subconjunto.

## Pruebas del tooling

```bash
cd scripts && node --test
```

Sin argumentos, el runner de Node descubre por convención de nombres (`*.test.mjs`) todo lo que cuelga del directorio actual — por eso se acota el `cwd` a `scripts/`, en vez de pasar un directorio o un glob como argumento: los directorios como argumento no se recorren de forma fiable entre versiones de Node, y los patrones glob requieren Node ≥ 21 y fallan en runners con Node 20 (así se declara en `commands.framework_selftest` de `FRAMEWORK.yaml`). Cubren el parser YAML, los helpers de Markdown y el comportamiento de cada validador (incluida la dualidad bootstrap/active) sobre fixtures en directorios temporales.

Cada ejemplo bajo `examples/` tiene su propio comando de prueba, declarado en su propio `FRAMEWORK.yaml` y documentado en [examples/README.md](../examples/README.md) — no forman parte de este gate porque algunos (como `typescript-node-service`) requieren su propio toolchain instalado (`npm install`) antes de poder correr.
