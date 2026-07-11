# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Fase 1.3 del roadmap: ejemplos ejecutables para más extensiones, priorizando las que tengan toolchain verificable en este entorno (npm/Node).

## Estado
Tercer ejemplo añadido: `examples/angular-greeting-app` (standalone, OnPush, signals, 12 pruebas, 0 vulnerabilidades). Aún sin nueva versión etiquetada tras 1.2.0.

## Decisiones vigentes relevantes
- ADR-0001: tooling de validación en Node.js ≥ 18 solo con stdlib.
- ADR-0002: `project.status` gobierna la severidad de placeholders y validaciones de contexto.

## Archivos o módulos en alcance
- `examples/angular-greeting-app/` (tercer ejemplo; ver su propio ADR-0001 sobre pruebas sin TestBed).
- `extensions/angular/README.md`, `examples/README.md` (enlazados al nuevo ejemplo).

## Riesgos y bloqueos
- Java (JDK sin Gradle/Maven), .NET (sin SDK) y Python (solo alias falso de la Store) siguen sin toolchain verificable en este entorno; no intentar ejemplos ejecutables de esos stacks aquí sin poder correrlos de punta a punta.
- React sigue pendiente en 1.3 (mismo toolchain npm que ya funciona).

## Próxima acción verificable
Ejecutar `node scripts/quality-gates.mjs` tras cualquier cambio; debe salir con código 0. Antes de release, `node scripts/prepare-release.mjs --sync-inventory`.
