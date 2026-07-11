# Reglas para asistentes de IA — dotnet-greeting-service

Aplican las reglas generales del framework. Específicas de este servicio:

1. Lee `FRAMEWORK.yaml` y `.ai/context/CURRENT_CONTEXT.md` antes de cualquier cambio.
2. `src/Domain/` no importa nada de `Microsoft.AspNetCore.*`; mantenlo puro.
3. `src/` y `test/` son directorios hermanos, nunca anidados (ver ADR-0001): el glob implícito de un `.csproj` de SDK style incluye recursivamente todo su árbol, así que anidar `test/` dentro de `src/` mezclaría el proyecto de pruebas con el principal.
4. Toda entrada externa se valida en `Program.cs` antes de tocar el dominio.
5. Cada cambio de comportamiento actualiza o añade pruebas en `test/`.
