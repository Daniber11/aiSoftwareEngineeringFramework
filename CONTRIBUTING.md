# Contribución

- Crear cambios pequeños y enfocados.
- Abrir ADR para cambios estructurales.
- Incluir pruebas y documentación.
- No disminuir quality gates.
- Explicar compatibilidad y migración.
- Usar Conventional Commits cuando el proyecto lo adopte.
- Ejecutar `node scripts/quality-gates.mjs` antes de abrir el pull request; debe salir con código 0.
- Actualizar `CHANGELOG.md` y ejecutar `node scripts/prepare-release.mjs --sync-inventory` cuando el cambio afecte el número de archivos o la versión.
