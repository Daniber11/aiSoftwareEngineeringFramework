# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Mantener el ejemplo como adopción de referencia de la extensión dotnet, sincronizado con la especificación 1.2.0.

## Estado
Estable. Dominio, Minimal API y pruebas completos y en verde (15 pruebas). Smoke test manual con `dotnet run` confirmó `/health` y `/greet` respondiendo.

## Decisiones vigentes relevantes
- ADR-0001: `src/` y `test/` como proyectos hermanos (no anidados); SDK de .NET 8 instalado localmente en el usuario, no en el sistema.

## Archivos o módulos en alcance
- `src/Domain/Greeting.cs`
- `src/Program.cs`
- `test/`

## Riesgos y bloqueos
- Ninguno registrado.

## Próxima acción verificable
Ejecutar `dotnet test test/GreetingService.Tests.csproj` tras cualquier cambio; debe terminar en "Con error: 0".
