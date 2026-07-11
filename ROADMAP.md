# Roadmap

## 1.0 — Core (entregado)
Especificación, documentos, plantillas y checklists.

## 1.1 — Validation y Automation (entregado)
Validadores, health score, quality gates, CLI de bootstrap/ADR/contexto/release, workflows reutilizables de GitHub Actions, ejemplo de adopción y extensiones de referencia (Java/Spring, TypeScript/Node, Python, .NET, React, Angular, mobile, infraestructura).

## 1.2 — Extensiones ampliadas (entregado)
- [x] Guía de migración para proyectos existentes que adoptan el framework tarde (`docs/MIGRATION_GUIDE.md`).
- [x] Segundo ejemplo ejecutable, con dependencias reales: extensión typescript-node (`examples/typescript-node-service`).

Alcance cerrado deliberadamente en un ejemplo adicional: basta para demostrar que el patrón "extensión documentada → proyecto ejecutable que la implementa" generaliza más allá del ejemplo cero-dependencias de la 1.1. Un ejemplo ejecutable por cada una de las 8 extensiones queda fuera de esta versión — cada uno requiere instalar y verificar un toolchain distinto (Gradle/Maven para Java, SDK de .NET, Python real, Flutter, Terraform), y ninguno estaba disponible y verificable en el entorno de esta sesión. Se retoma en 1.3 cuando haya cómo validarlos de punta a punta, no solo describirlos.

## 1.3 — Cobertura de extensiones y datos/ML (entregado)
- [x] Ejemplo ejecutable de la extensión angular (`examples/angular-greeting-app`): standalone, `OnPush`, signals; pruebas de componente sin `TestBed` documentadas en su propio ADR.
- [x] Ejemplo ejecutable de la extensión react (`examples/react-greeting-app`): hook/componente, render real sobre jsdom sin Testing Library ni `react-test-renderer` (deprecado), documentado en su propio ADR.
- [x] Ejemplo ejecutable de la extensión java-spring (`examples/java-spring-service`): dominio puro + Spring Boot 3, Gradle Wrapper bootstrapeado localmente (sin Gradle global), documentado en su propio ADR.
- [x] Ejemplo ejecutable de la extensión dotnet (`examples/dotnet-greeting-service`): dominio puro + Minimal API con ASP.NET Core 8, SDK instalado localmente al usuario (sin tocar el sistema), `src/`+`test/` como proyectos hermanos, documentado en su propio ADR.
- [x] Ejemplo ejecutable de la extensión infrastructure (`examples/infrastructure-module`): módulo Terraform con variables validadas, verificado de punta a punta (`fmt`/`validate`/`plan`/`apply`/`destroy`) con el proveedor `local`, sin cuenta de nube, documentado en su propio ADR.
- [x] Ejemplo ejecutable para la extensión python (`examples/python-greeting-service`): dominio puro + FastAPI, Python 3.12 embebido instalado localmente sin instalador MSI (el instalador oficial falló dos veces por restricción del entorno, ver su ADR-0001), 17 pruebas.
- [x] Ejemplo ejecutable para mobile (Flutter) — [`examples/flutter-greeting-app`](examples/flutter-greeting-app/README.md): dominio puro, controlador de estado (`ChangeNotifier`), widget delgado, 18 pruebas (`package:test` + `flutter_test`/`testWidgets`). Los intentos 1-3 diagnosticaron erróneamente `storage.googleapis.com` como limitado a ~100 KB/s (medido con el downloader por defecto y con el bootstrap interno de `flutter.bat`). Un cuarto intento verificó el diagnóstico en vez de asumirlo: `curl` contra el mismo host midió 40-56 MB/s sostenido — el host nunca estuvo limitado; el cuello de botella real era el mecanismo de descarga usado (ver ADR-0001 del ejemplo). Descargando el zip oficial con `curl` (1.9 GB en 34 s) y extrayéndolo con `tar.exe` nativo de Windows, el SDK quedó listo en minutos.
- [x] Decisión explícita sobre si se agrega una extensión de datos/ML: [ADR-0003](.ai/decisions/adr/0003-no-agregar-extension-de-datos-ml-por-ahora.md) — no por ahora, con condiciones claras para reabrirlo.

Las ocho extensiones tienen ahora ejemplo ejecutable (typescript-node, angular, react, java-spring, dotnet, infrastructure, python, mobile). El patrón "extensión documentada → proyecto ejecutable que la implementa" queda demostrado a través de seis toolchains genuinamente distintos (npm/Node, Gradle/Java, SDK de .NET, Terraform, Python embebido, SDK de Flutter). Cobertura completa: 1.3 queda cerrada.

## 2.0 — Runtime (entregado)
- [x] Perfiles de configuración por ambiente: sección `profiles` en `FRAMEWORK.yaml` con overrides parciales de `quality_gates`/`ai`/`commands`, resueltos por `scripts/resolve-profile.mjs` y `quality-gates.mjs --profile`. Ver [ADR-0004](.ai/decisions/adr/0004-perfiles-de-configuracion-por-ambiente.md). Este propio repositorio declara `contributor` y `release` como dogfooding real.
- [x] Resolución automática de contexto: `scripts/resolve-context.mjs <ruta>` cruza la ruta dada contra `MODULES.md` y el "Alcance" de cada ADR, sin metadatos nuevos que mantener. Ver [ADR-0005](.ai/decisions/adr/0005-resolucion-automatica-de-contexto.md). `.ai/AGENTS.md` ahora referencia esta herramienta en su paso 5.
- [x] Motor de políticas para gobernanza de IA: `scripts/classify-change.mjs` clasifica rutas contra las categorías de `DECISION_POLICY.md` con reglas deterministas por ruta (manifiestos de dependencias, CI/CD, migraciones, seguridad, eliminaciones), reutilizando `resolve-context.mjs`. Retomado a pedido explícito del usuario, que es exactamente la condición de reapertura que el propio ADR-0004 había fijado. Ver [ADR-0006](.ai/decisions/adr/0006-motor-de-politicas-de-gobernanza-de-ia.md).

Los tres frentes de la fase 2.0 quedan entregados.
