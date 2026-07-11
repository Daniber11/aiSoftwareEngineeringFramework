# Changelog

Todos los cambios relevantes se documentan aquí siguiendo Keep a Changelog y versionado semántico.

## [Unreleased]

### Added
- Tercer ejemplo de adopción: `examples/angular-greeting-app` implementa la extensión angular (standalone component, `ChangeDetectionStrategy.OnPush`, estado por signals, servicio inyectable sobre un dominio puro), con 12 pruebas y sin vulnerabilidades conocidas en dependencias. Documenta en su propio ADR-0001 cómo se prueba la lógica del componente sin `TestBed` ni Angular CLI, y qué queda deliberadamente sin cobertura (el binding de la plantilla al DOM).

### Changed
- `extensions/angular/README.md` y `examples/README.md` enlazan el nuevo ejemplo.
- `@angular/core` se fija en `^20.3.26` para evitar tres CVE de XSS conocidas en versiones ≤ 19.2.25.

## [1.2.0] - 2026-07-10

### Added
- Guía de migración para proyectos existentes (`docs/MIGRATION_GUIDE.md`): cómo adoptar el framework de forma incremental sin romper CI ni producción, con los pasos y las trampas a evitar.
- Segundo ejemplo de adopción, ahora con dependencias reales: `examples/typescript-node-service` implementa la extensión typescript-node (TypeScript estricto, validación en dos capas con zod documentada en ADR-0001 propio, `tsx`, `prettier`, 13 pruebas).

### Changed
- `extensions/typescript-node/README.md` y `examples/README.md` enlazan el nuevo ejemplo.

## [1.1.0] - 2026-07-10

### Added
- Validadores ejecutables en Node.js ≥ 18 sin dependencias (`scripts/`): estructura, manifiesto, enlaces e inventario, contexto activo, índice de módulos y placeholders.
- Orquestadores: `quality-gates.mjs` (gate local/CI) y `health-score.mjs` (score 0-100 con reporte JSON).
- CLI de ciclo de vida: `init-project.mjs`, `new-adr.mjs` y `prepare-release.mjs` (con `--sync-inventory`).
- Pruebas del tooling con `node:test` (parser YAML, helpers y validadores sobre fixtures).
- GitHub Actions: `validate-framework.yml` y los reutilizables `quality.yml`, `test.yml`, `security.yml` y `release.yml`, con permisos mínimos.
- Ejemplo de adopción completa y validable: `examples/minimal-service` (dominio puro, adaptador HTTP con health check, logs estructurados con correlation ID, 13 pruebas).
- Ocho extensiones por stack: Java/Spring, TypeScript/Node, Python, .NET, React, Angular, mobile e infraestructura.
- ADR-0001 (tooling en Node stdlib) y ADR-0002 (severidad de validaciones según `project.status`).

### Changed
- `FRAMEWORK.yaml` incorpora las secciones `validation` y `commands`, y este repositorio deja de contener placeholders (identidad propia, contexto activo e índice de módulos reales).
- READMEs de `scripts/`, `.github/workflows/` y `extensions/` pasan de descripciones previstas a documentación de lo implementado.

## [1.0.0] - 2026-07-10

### Added
- Core documental.
- Gobernanza de IA.
- Contexto eficiente.
- Estrategias de calidad, pruebas, seguridad, rendimiento, CI/CD y observabilidad.
- Plantillas y checklists.
