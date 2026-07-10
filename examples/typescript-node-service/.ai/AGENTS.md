# Reglas para asistentes de IA — typescript-node-service

Aplican las reglas generales del framework. Específicas de este servicio:

1. Lee `FRAMEWORK.yaml` y `.ai/context/CURRENT_CONTEXT.md` antes de cualquier cambio.
2. `src/domain/` no importa `node:http`, `zod` ni nada de `src/adapters/`; mantenlo puro y tipado estricto.
3. Toda entrada externa se valida con zod en `src/adapters/http/server.ts` antes de tocar el dominio.
4. `tsc --noEmit` y `prettier --check` deben pasar antes de dar por terminado un cambio.
5. Cada cambio de comportamiento actualiza o añade pruebas en `test/`.
