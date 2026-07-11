# Reglas para asistentes de IA — java-spring-service

Aplican las reglas generales del framework. Específicas de este servicio:

1. Lee `FRAMEWORK.yaml` y `.ai/context/CURRENT_CONTEXT.md` antes de cualquier cambio.
2. `domain/` no importa nada de `org.springframework.*`; mantenlo puro.
3. Toda entrada externa se valida en `GreetingController` antes de tocar el dominio.
4. Usa siempre `./gradlew`, nunca un `gradle` global — el wrapper fija la versión (ver ADR-0001).
5. Cada cambio de comportamiento actualiza o añade pruebas en `src/test/`.
