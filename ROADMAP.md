# Roadmap

## 1.0 — Core (entregado)
Especificación, documentos, plantillas y checklists.

## 1.1 — Validation y Automation (entregado)
Validadores, health score, quality gates, CLI de bootstrap/ADR/contexto/release, workflows reutilizables de GitHub Actions, ejemplo de adopción y extensiones de referencia (Java/Spring, TypeScript/Node, Python, .NET, React, Angular, mobile, infraestructura).

## 1.2 — Extensiones ampliadas (entregado)
- [x] Guía de migración para proyectos existentes que adoptan el framework tarde (`docs/MIGRATION_GUIDE.md`).
- [x] Segundo ejemplo ejecutable, con dependencias reales: extensión typescript-node (`examples/typescript-node-service`).

Alcance cerrado deliberadamente en un ejemplo adicional: basta para demostrar que el patrón "extensión documentada → proyecto ejecutable que la implementa" generaliza más allá del ejemplo cero-dependencias de la 1.1. Un ejemplo ejecutable por cada una de las 8 extensiones queda fuera de esta versión — cada uno requiere instalar y verificar un toolchain distinto (Gradle/Maven para Java, SDK de .NET, Python real, Flutter, Terraform), y ninguno estaba disponible y verificable en el entorno de esta sesión. Se retoma en 1.3 cuando haya cómo validarlos de punta a punta, no solo describirlos.

## 1.3 — Cobertura de extensiones y datos/ML
- [ ] Ejemplos ejecutables para el resto de extensiones (Java/Spring, Python, .NET, React, Angular, mobile, infraestructura), priorizando las que tengan toolchain verificable en CI.
- [ ] Decisión explícita (ADR) sobre si se agrega una extensión de datos/ML, fuera del alcance original de `extensions/README.md`.

## 2.0 — Runtime
Orquestación de perfiles, políticas y resolución automática de contexto.
