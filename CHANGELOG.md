# Changelog

Todos los cambios relevantes se documentan aquí siguiendo Keep a Changelog y versionado semántico.

## [Unreleased]

### Added
- Tercer ejemplo de adopción: `examples/angular-greeting-app` implementa la extensión angular (standalone component, `ChangeDetectionStrategy.OnPush`, estado por signals, servicio inyectable sobre un dominio puro), con 12 pruebas y sin vulnerabilidades conocidas en dependencias. Documenta en su propio ADR-0001 cómo se prueba la lógica del componente sin `TestBed` ni Angular CLI, y qué queda deliberadamente sin cobertura (el binding de la plantilla al DOM).

- Cuarto ejemplo de adopción: `examples/react-greeting-app` implementa la extensión react (hook `useGreeting` con estado derivado vía `useMemo`, componente de presentación `GreetingForm`), con 11 pruebas que renderizan de verdad sobre DOM (jsdom + `react-dom/client`) sin `@testing-library/react` ni la deprecada `react-test-renderer`, y sin vulnerabilidades conocidas en dependencias. Documentado en su propio ADR-0001.
- [ADR-0003](.ai/decisions/adr/0003-no-agregar-extension-de-datos-ml-por-ahora.md): decisión explícita de no agregar una extensión de datos/ML por ahora, con las condiciones que la reabrirían.
- Quinto ejemplo de adopción: `examples/java-spring-service` implementa la extensión java-spring (dominio puro, controlador REST con Spring Boot 3), con Gradle Wrapper 8.10.2 bootstrapeado localmente y commiteado (sin depender de un Gradle instalado globalmente) y 15 pruebas (JUnit 5 + AssertJ + `@SpringBootTest` con puerto efímero). Documentado en su propio ADR-0001; verificado además con un smoke test real (`bootRun` + peticiones HTTP).
- Sexto ejemplo de adopción: `examples/dotnet-greeting-service` implementa la extensión dotnet (dominio puro, Minimal API con ASP.NET Core 8), con el SDK de .NET 8 instalado localmente al usuario (sin privilegios de administrador ni cambios en el PATH del sistema) y 15 pruebas (xUnit con datos parametrizados + `WebApplicationFactory<Program>` para integración HTTP real). Documentado en su propio ADR-0001 (por qué `src/`+`test/` deben ser proyectos hermanos, no anidados); verificado además con un smoke test real (`dotnet run` + peticiones HTTP).

### Changed
- `extensions/angular/README.md`, `extensions/react/README.md`, `extensions/java-spring/README.md`, `extensions/dotnet/README.md` y `examples/README.md` enlazan los nuevos ejemplos.
- `@angular/core` se fija en `^20.3.26` para evitar tres CVE de XSS conocidas en versiones ≤ 19.2.25.
- `scripts/lib/core.mjs`: `DEFAULT_EXCLUDED_DIRS` ahora excluye cachés locales de toolchains (`.gradle`, `bin`, `obj`, `.dart_tool`, `.terraform`) del conteo de `framework-inventory.json`.

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
