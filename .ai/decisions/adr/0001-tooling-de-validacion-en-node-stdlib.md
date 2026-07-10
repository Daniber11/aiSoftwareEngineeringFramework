# ADR-0001: Tooling de validación en Node.js con biblioteca estándar

- Estado: Aceptado
- Fecha: 2026-07-10
- Responsables: Mantenedores del framework
- Alcance: `scripts/`, `.github/workflows/`

## Contexto

El framework necesita validadores ejecutables (estructura, manifiesto, enlaces, contexto, placeholders, health score, quality gates) que funcionen igual en la máquina de cualquier adoptante y en CI. El Core es agnóstico de lenguaje: el tooling no debe imponer un stack al proyecto que adopta el framework, ni exigir instalación de dependencias adicionales.

## Opciones consideradas

1. **Bash/PowerShell**: sin runtime extra, pero requiere mantener dos implementaciones (POSIX y Windows) y el parsing de YAML/Markdown en shell es frágil.
2. **Python 3 (stdlib)**: portable, pero no viene preinstalado en Windows y la stdlib no incluye parser YAML, lo que obligaría a una dependencia (PyYAML) o a un parser propio.
3. **Node.js ≥ 18 (stdlib)**: preinstalado en todos los runners de GitHub Actions, multiplataforma real, incluye `node:test` para autoprobar el tooling, y permite cero dependencias (`package.json` innecesario). Requiere un parser propio para el subconjunto de YAML del manifiesto, acotado y probado.

## Decisión

Implementar todos los scripts en Node.js ≥ 18 usando exclusivamente la biblioteca estándar (`node:fs`, `node:path`, `node:child_process`, `node:test`). Ninguna dependencia externa, ningún gestor de paquetes. El subconjunto de YAML del manifiesto (mapas anidados por indentación, escalares y listas simples) se parsea con `scripts/lib/core.mjs`, cubierto por pruebas unitarias.

Esto no acopla el Core a Node: los proyectos adoptantes usan su propio stack; los scripts son herramientas del framework, igual que Git.

## Consecuencias

- Positivas: instalación cero, ejecución idéntica local/CI, tooling autoprobado con `node --test`.
- Negativas: el manifiesto debe mantenerse dentro del subconjunto YAML soportado (documentado en `scripts/README.md`); anclas, alias y estructuras complejas no están permitidas.
- Deuda aceptada: si el manifiesto creciera en complejidad, se evaluará un parser completo mediante nuevo ADR.

## Migración y rollback

No hay estado que migrar. Rollback = eliminar `scripts/` y volver a validación manual con los checklists.

## Validación

`node --test scripts/tests` prueba el parser y los helpers; `node scripts/quality-gates.mjs` ejecuta todos los validadores contra este mismo repositorio.
