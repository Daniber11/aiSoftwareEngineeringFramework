# Reglas para asistentes de IA — flutter-greeting-app

Aplican las reglas generales del framework. Específicas de esta app:

1. Lee `FRAMEWORK.yaml` y `.ai/context/CURRENT_CONTEXT.md` antes de cualquier cambio.
2. `lib/domain/` no importa nada de `package:flutter`; mantenlo puro.
3. `lib/state/greeting_controller.dart` deriva el estado del nombre/idioma actuales; nunca guardes el saludo o el error en un campo separado que pueda desincronizarse.
4. El SDK de Flutter vive en `~/.flutter-fw-example`, fuera del repositorio (ver ADR-0001) — no lo commitees ni asumas que existe en otra máquina sin instalarlo primero.
5. Cada cambio de comportamiento actualiza o añade pruebas en `test/`.
