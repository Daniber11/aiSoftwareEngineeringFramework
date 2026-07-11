# Changelog

Todos los cambios relevantes se documentan aquí siguiendo Keep a Changelog y versionado semántico.

## [Unreleased]

### Added
- Octavo ejemplo de adopción: `examples/python-greeting-service` implementa la extensión python (dominio puro, API con FastAPI), con Python 3.12 instalado localmente vía distribución embebida (el instalador oficial `.exe` falló dos veces con `0x80070003` — MSI restringido en este entorno — así que se usó el zip embebido sin instalador, `pip` bootstrapeado con `get-pip.py`) y 17 pruebas (pytest + `TestClient`). Documentado en su propio ADR-0001. Verificado además con un smoke test real (`uvicorn` + peticiones HTTP).

- Tercer y último frente de la fase 2.0: motor de políticas de gobernanza de IA. `scripts/classify-change.mjs <ruta>[:A|M|D]...` clasifica rutas contra las categorías de `.ai/governance/DECISION_POLICY.md` con reglas deterministas (manifiestos de dependencias, workflows de CI/CD, rutas de migración, `SECURITY_POLICY.md`, archivos eliminados), reutilizando `matchModules`/`matchAdrs` de `resolve-context.mjs`. `.ai/AGENTS.md` lo referencia antes de tocar rutas sensibles. Documentado en [ADR-0006](.ai/decisions/adr/0006-motor-de-politicas-de-gobernanza-de-ia.md), que revisa explícitamente la postura de "no por ahora" del ADR-0004 a partir de un pedido explícito del usuario.

- Octavo y último ejemplo de adopción, cerrando la cobertura de las ocho extensiones: `examples/flutter-greeting-app` implementa la extensión mobile (dominio puro, controlador de estado `ChangeNotifier`, widget delgado sobre Flutter Material), con el SDK real de Flutter 3.44.6 instalado localmente. Los tres intentos anteriores habían diagnosticado `storage.googleapis.com` como limitado a ~100 KB/s; un cuarto intento verificó ese diagnóstico con `curl` en vez de asumirlo y lo encontró falso (40-56 MB/s sostenido contra el mismo host) — el cuello de botella real era el mecanismo de descarga usado (downloader por defecto y bootstrap interno de `flutter.bat`), no la red. Descargando el zip oficial con `curl` y extrayéndolo con `tar.exe` nativo de Windows, el SDK quedó listo en minutos. Documentado en su propio [ADR-0001](examples/flutter-greeting-app/.ai/decisions/adr/0001-sdk-de-flutter-via-descarga-directa.md). 18 pruebas (`package:test` + `flutter_test`/`testWidgets`), `flutter analyze` y `dart format` sin hallazgos.

### Changed
- `extensions/python/README.md`, `extensions/mobile/README.md` y `examples/README.md` enlazan los nuevos ejemplos.
- `scripts/lib/core.mjs`: `DEFAULT_EXCLUDED_DIRS` ahora también excluye `__pycache__` y `.pytest_cache` del conteo del inventario.
- `scripts/tests/classify-change.test.mjs`: 8 pruebas nuevas (36/36 en el suite completo antes de sumar las de Flutter).

### Fixed
- `scripts/lib/core.mjs`: `walkFiles` ahora también excluye por extensión (`DEFAULT_EXCLUDED_EXTENSIONS`, inicialmente `.iml`), no solo por carpeta o nombre exacto. `flutter create` deja un `*.iml` de IntelliJ/Android Studio suelto en la raíz del proyecto (fuera de `.idea/`, ya excluida), lo que desincronizaba el conteo del inventario entre un disco local donde ya corrió el toolchain (268) y un checkout limpio como el de CI (267) — el primer push de `flutter-greeting-app` falló el gate `Enlaces e inventario` en CI por esto.

## [1.4.0] - 2026-07-11

### Added
- Primera pieza de la fase 2.0 (Runtime): perfiles de configuración por ambiente. Nueva sección opcional `profiles` en `FRAMEWORK.yaml` con overrides parciales por clave de `quality_gates`, `ai` y `commands`; `scripts/resolve-profile.mjs` inspecciona la configuración efectiva de un perfil; `quality-gates.mjs --profile <nombre>` ejecuta los `commands` resueltos de ese perfil. Aditivo y retrocompatible: sin `profiles`, nada cambia. Documentado en [ADR-0004](.ai/decisions/adr/0004-perfiles-de-configuracion-por-ambiente.md).
- Este repositorio declara dos perfiles reales como dogfooding: `contributor` (autonomía de IA `full`, escaneos de dependencias/secretos `optional`, para iteración local) y `release` (añade el comando `release_check`).
- `scripts/tests/profiles.test.mjs`: 7 pruebas cubriendo la resolución de perfiles, la validación de overrides inválidos, y la ejecución real de `quality-gates --profile`.

- Segunda pieza de la fase 2.0: resolución automática de contexto. `scripts/resolve-context.mjs <ruta>` cruza la ruta dada contra la columna "Rutas" de `.ai/context/MODULES.md` y el campo "- Alcance:" de cada ADR — sin metadatos nuevos que mantener por separado. `.ai/AGENTS.md` referencia la herramienta en su paso 5. Documentado en [ADR-0005](.ai/decisions/adr/0005-resolucion-automatica-de-contexto.md).
- `scripts/tests/resolve-context.test.mjs`: 6 pruebas nuevas (28/28 en el suite completo).

### Changed
- `scripts/validate-manifest.mjs` valida la sección `profiles` cuando existe (mismas reglas que la sección base, sin exigir las 12 claves).

### Known limitations
- Motor de políticas de gobernanza de IA (tercer frente de 2.0): descartado por ahora en el [ADR-0004](.ai/decisions/adr/0004-perfiles-de-configuracion-por-ambiente.md) por falta de necesidad demostrada, no diseñado.

## [1.3.0] - 2026-07-11

### Added
- Tercer ejemplo de adopción: `examples/angular-greeting-app` implementa la extensión angular (standalone component, `ChangeDetectionStrategy.OnPush`, estado por signals, servicio inyectable sobre un dominio puro), con 12 pruebas y sin vulnerabilidades conocidas en dependencias. Documenta en su propio ADR-0001 cómo se prueba la lógica del componente sin `TestBed` ni Angular CLI, y qué queda deliberadamente sin cobertura (el binding de la plantilla al DOM).

- Cuarto ejemplo de adopción: `examples/react-greeting-app` implementa la extensión react (hook `useGreeting` con estado derivado vía `useMemo`, componente de presentación `GreetingForm`), con 11 pruebas que renderizan de verdad sobre DOM (jsdom + `react-dom/client`) sin `@testing-library/react` ni la deprecada `react-test-renderer`, y sin vulnerabilidades conocidas en dependencias. Documentado en su propio ADR-0001.
- [ADR-0003](.ai/decisions/adr/0003-no-agregar-extension-de-datos-ml-por-ahora.md): decisión explícita de no agregar una extensión de datos/ML por ahora, con las condiciones que la reabrirían.
- Quinto ejemplo de adopción: `examples/java-spring-service` implementa la extensión java-spring (dominio puro, controlador REST con Spring Boot 3), con Gradle Wrapper 8.10.2 bootstrapeado localmente y commiteado (sin depender de un Gradle instalado globalmente) y 15 pruebas (JUnit 5 + AssertJ + `@SpringBootTest` con puerto efímero). Documentado en su propio ADR-0001; verificado además con un smoke test real (`bootRun` + peticiones HTTP).
- Sexto ejemplo de adopción: `examples/dotnet-greeting-service` implementa la extensión dotnet (dominio puro, Minimal API con ASP.NET Core 8), con el SDK de .NET 8 instalado localmente al usuario (sin privilegios de administrador ni cambios en el PATH del sistema) y 15 pruebas (xUnit con datos parametrizados + `WebApplicationFactory<Program>` para integración HTTP real). Documentado en su propio ADR-0001 (por qué `src/`+`test/` deben ser proyectos hermanos, no anidados); verificado además con un smoke test real (`dotnet run` + peticiones HTTP).
- Séptimo ejemplo de adopción: `examples/infrastructure-module` implementa la extensión infrastructure (módulo `greeting-artifact` con variables tipadas y validadas, composición `envs/dev`), usando el proveedor `hashicorp/local` para ser verificable sin ninguna cuenta de nube. Verificado de punta a punta con Terraform 1.9.8 real: `fmt`, `validate`, `plan`, `apply` (creando el archivo esperado) y `destroy`, además de confirmar que una variable inválida es rechazada antes de tocar cualquier recurso. Documentado en su propio ADR-0001.

### Changed
- `extensions/angular/README.md`, `extensions/react/README.md`, `extensions/java-spring/README.md`, `extensions/dotnet/README.md`, `extensions/infrastructure/README.md` y `examples/README.md` enlazan los nuevos ejemplos.
- `@angular/core` se fija en `^20.3.26` para evitar tres CVE de XSS conocidas en versiones ≤ 19.2.25.
- `scripts/lib/core.mjs`: `DEFAULT_EXCLUDED_DIRS` ahora excluye cachés locales de toolchains (`.gradle`, `bin`, `obj`, `.dart_tool`, `.terraform`) del conteo de `framework-inventory.json`.

### Known limitations
- Extensión mobile (Flutter): sin ejemplo ejecutable — la descarga del SDK se abandonó por velocidad de red de la sesión de desarrollo (~120 KB/s), no por decisión de alcance. Ver `ROADMAP.md`.
- Extensión python: sin ejemplo ejecutable — no autorizado en la ronda de instalaciones de esta versión.

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
