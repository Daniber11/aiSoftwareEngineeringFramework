# GitHub Actions

Cinco workflows con permisos mínimos (`contents: read` por defecto), versiones de acciones fijadas y evidencia de validación publicada como artefactos.

| Workflow | Disparadores | Propósito |
|---|---|---|
| [validate-framework.yml](validate-framework.yml) | `push` a main, `pull_request`, `workflow_call` | Ejecuta `scripts/quality-gates.mjs` y publica el health score como artefacto. Es el gate documental y de estructura de todo repositorio que adopte el framework. |
| [quality.yml](quality.yml) | `workflow_call` | Reutilizable: formato, lint y análisis estático con comandos definidos por el proyecto llamante. |
| [test.yml](test.yml) | `workflow_call` | Reutilizable: pruebas unitarias (obligatorias), integración y E2E opcionales, publicación de cobertura. |
| [security.yml](security.yml) | `workflow_call` | Reutilizable: escaneo de secretos (Gitleaks), revisión de dependencias en PR, y SAST/auditoría/SBOM del stack por comandos. |
| [release.yml](release.yml) | `push` de etiqueta `vX.Y.Z` | Verifica versión-changelog-inventario-gates y publica el release de GitHub con las notas del CHANGELOG. |

## Uso desde un proyecto adoptante

Los workflows reutilizables se invocan desde el pipeline del proyecto con los comandos de su stack (ejemplos concretos por stack en [extensions/](../../extensions/README.md)):

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  framework:
    uses: ./.github/workflows/validate-framework.yml
  quality:
    uses: ./.github/workflows/quality.yml
    with:
      setup-command: npm ci
      lint-command: npm run lint
      static-analysis-command: npm run typecheck
  test:
    uses: ./.github/workflows/test.yml
    with:
      setup-command: npm ci
      unit-command: npm test
  security:
    uses: ./.github/workflows/security.yml
    with:
      dependency-audit-command: npm audit --audit-level=high
```

## Convenciones

- Permisos mínimos declarados por workflow y por job; solo `release.yml` escribe (`contents: write` en el job de publicación).
- Acciones de terceros fijadas por versión mayor; para endurecer la cadena de suministro, fija por SHA de commit en el repositorio adoptante.
- `concurrency` cancela ejecuciones obsoletas de la misma rama.
- Ningún workflow imprime secretos ni los recibe como `inputs`; usa `secrets: inherit` solo cuando el escaneo del stack lo requiera.
- Los comandos vacíos se omiten: cada proyecto activa únicamente los gates que su `FRAMEWORK.yaml` declara.
