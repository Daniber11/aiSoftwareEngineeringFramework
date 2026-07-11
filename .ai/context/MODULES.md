# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |
|---|---|---|---|---|---|
| core-manifest | Identidad del proyecto, autoridad y quality gates | `FRAMEWORK.yaml`, `README.md` | Esquema verificado por `scripts/validate-manifest.mjs` | `scripts/tests/manifest.test.mjs` | Mantenedores |
| governance | Políticas de decisión, seguridad, pruebas, rendimiento y DoD | `.ai/governance/` | Documental; jerarquía de autoridad del README | `scripts/validate-links.mjs` | Mantenedores |
| context | Identidad, dominio, arquitectura, módulos y contexto activo | `.ai/context/` | Secciones obligatorias verificadas por `scripts/validate-context.mjs` | `scripts/tests/context.test.mjs` | Mantenedores |
| decisions | Registro de decisiones mediante ADR | `.ai/decisions/adr/` | Formato del ADR-0000 | `scripts/validate-structure.mjs` | Mantenedores |
| task-templates | Plantillas de tarea y checklists operativos | `.ai/templates/`, `.ai/checklists/` | Documental | `scripts/validate-links.mjs` | Mantenedores |
| standards | Estándares de CI/CD, observabilidad, contexto y madurez | `docs/` | Documental | `scripts/validate-links.mjs` | Mantenedores |
| automation | Validadores, health score, quality gates y CLI de bootstrap | `scripts/` | CLI: código de salida 0/≠0; `health-score --json` emite JSON | `scripts/tests/` (descubiertas por `node --test`) | Mantenedores |
| ci | Workflows reutilizables de GitHub Actions | `.github/workflows/` | Interfaces `workflow_call` documentadas en su README | `validate-framework.yml` se ejecuta en cada push/PR | Mantenedores |
| extensions | Adaptación del Core a stacks concretos | `extensions/` | Estructura de 11 secciones definida en `extensions/README.md` | `scripts/validate-links.mjs` | Mantenedores |
| examples | Adopciones de referencia validables de punta a punta (cero dependencias, typescript-node, angular, react y java-spring) | `examples/` | Pasa los validadores con `--root` | `examples/*/test/` (Node) y `examples/java-spring-service` (`./gradlew test`) | Mantenedores |
| migration | Guía para adoptar el framework en proyectos existentes, no desde cero | `docs/MIGRATION_GUIDE.md` | Documental | `scripts/validate-links.mjs` | Mantenedores |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
