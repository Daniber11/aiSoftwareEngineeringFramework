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
| `quality-gates.mjs` | Gate local completo: todos los validadores y después los comandos de la sección `commands` del manifiesto (`--skip-commands` los omite). | Cualquier validador con errores o comando con salida ≠ 0. |
| `prepare-release.mjs` | Verifica versión del manifiesto ↔ entrada de CHANGELOG ↔ inventario, y corre los quality gates. `--sync-inventory` regenera `framework-inventory.json`. | Cualquier verificación fallida. |

## Severidad según el estado del proyecto (ADR-0002)

Con `project.status: bootstrap` los marcadores de plantilla son advertencias; con cualquier otro estado (`active`, `production`, `maintenance`) son errores. `init-project.mjs` deja el proyecto en bootstrap; cambia el estado a `active` cuando el contexto esté completo.

## Subconjunto YAML soportado en FRAMEWORK.yaml

El parser propio (`lib/core.mjs`) admite mapas anidados por indentación, escalares (texto, número, booleano, null, comillas), listas simples de `- valor` y comentarios `#`. No admite anclas, alias, valores multilínea ni colecciones en línea. Mantén el manifiesto dentro de este subconjunto.

## Pruebas del tooling

```bash
node --test "scripts/tests/**/*.test.mjs"
```

Cubren el parser YAML, los helpers de Markdown y el comportamiento de cada validador (incluida la dualidad bootstrap/active) sobre fixtures en directorios temporales.
