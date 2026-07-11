# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Cerrar la fase 1.3 del roadmap: ejemplos ejecutables para las extensiones con toolchain verificable (npm/Node ya cubierto); decisión explícita sobre datos/ML pendiente.

## Estado
Cuarto ejemplo añadido: `examples/react-greeting-app` (hook/componente, render real sobre jsdom sin Testing Library, 11 pruebas, 0 vulnerabilidades). Aún sin nueva versión etiquetada tras 1.2.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.

## Archivos o módulos en alcance
- `examples/react-greeting-app/` (cuarto ejemplo; ver su propio ADR-0001 sobre pruebas con jsdom sin Testing Library).
- `extensions/react/README.md`, `examples/README.md` (enlazados al nuevo ejemplo).

## Riesgos y bloqueos
- Java (JDK sin Gradle/Maven), .NET (sin SDK) y Python (solo alias falso de la Store) siguen sin toolchain verificable en este entorno; instalar SDKs vía internet requiere confirmación explícita del usuario antes de proceder.
- Mobile (Flutter) e infraestructura (Terraform) no evaluados aún.

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
