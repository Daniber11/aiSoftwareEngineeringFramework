# Roadmap

## 1.0 — Core (entregado)
Especificación, documentos, plantillas y checklists.

## 1.1 — Validation y Automation (entregado)
Validadores, health score, quality gates, CLI de bootstrap/ADR/contexto/release, workflows reutilizables de GitHub Actions, ejemplo de adopción y extensiones de referencia (Java/Spring, TypeScript/Node, Python, .NET, React, Angular, mobile, infraestructura).

## 1.2 — Extensiones ampliadas (entregado)
- [x] Guía de migración para proyectos existentes que adoptan el framework tarde (`docs/MIGRATION_GUIDE.md`).
- [x] Segundo ejemplo ejecutable, con dependencias reales: extensión typescript-node (`examples/typescript-node-service`).

Alcance cerrado deliberadamente en un ejemplo adicional: basta para demostrar que el patrón "extensión documentada → proyecto ejecutable que la implementa" generaliza más allá del ejemplo cero-dependencias de la 1.1. Un ejemplo ejecutable por cada una de las 8 extensiones queda fuera de esta versión — cada uno requiere instalar y verificar un toolchain distinto (Gradle/Maven para Java, SDK de .NET, Python real, Flutter, Terraform), y ninguno estaba disponible y verificable en el entorno de esta sesión. Se retoma en 1.3 cuando haya cómo validarlos de punta a punta, no solo describirlos.

## 1.3 — Cobertura de extensiones y datos/ML (en curso)
- [x] Ejemplo ejecutable de la extensión angular (`examples/angular-greeting-app`): standalone, `OnPush`, signals; pruebas de componente sin `TestBed` documentadas en su propio ADR.
- [x] Ejemplo ejecutable de la extensión react (`examples/react-greeting-app`): hook/componente, render real sobre jsdom sin Testing Library ni `react-test-renderer` (deprecado), documentado en su propio ADR.
- [x] Ejemplo ejecutable de la extensión java-spring (`examples/java-spring-service`): dominio puro + Spring Boot 3, Gradle Wrapper bootstrapeado localmente (sin Gradle global), documentado en su propio ADR.
- [x] Ejemplo ejecutable de la extensión dotnet (`examples/dotnet-greeting-service`): dominio puro + Minimal API con ASP.NET Core 8, SDK instalado localmente al usuario (sin tocar el sistema), `src/`+`test/` como proyectos hermanos, documentado en su propio ADR.
- [ ] Ejemplos ejecutables para Python, mobile e infraestructura — requieren instalar Python real, Flutter o Terraform; cada instalación requiere confirmación explícita del usuario antes de proceder (no una delegación genérica).
- [x] Decisión explícita sobre si se agrega una extensión de datos/ML: [ADR-0003](.ai/decisions/adr/0003-no-agregar-extension-de-datos-ml-por-ahora.md) — no por ahora, con condiciones claras para reabrirlo.

## 2.0 — Runtime
Orquestación de perfiles, políticas y resolución automática de contexto.
