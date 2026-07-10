# Reglas para asistentes de IA — minimal-service

Aplican las reglas generales del framework (`.ai/AGENTS.md` en la raíz del repositorio del framework). Específicas de este servicio:

1. Lee `FRAMEWORK.yaml` y `.ai/context/CURRENT_CONTEXT.md` antes de cualquier cambio.
2. El dominio (`src/domain/`) no importa nada de `src/server.mjs` ni de módulos de Node con I/O; mantenlo puro.
3. Toda entrada externa se valida en el adaptador HTTP antes de tocar el dominio.
4. Los logs son JSON de una línea, sin datos personales; conserva el correlation ID.
5. Cada cambio de comportamiento actualiza o añade pruebas en `test/`.
