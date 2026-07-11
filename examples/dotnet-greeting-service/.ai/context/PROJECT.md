# Identidad del proyecto

## Propósito
Servicio de saludo con ASP.NET Core Minimal API: adopción de referencia de la [extensión dotnet](../../../../extensions/dotnet/README.md), con dominio puro y SDK de .NET instalado localmente (sin tocar el sistema).

## Alcance
Incluido: dominio puro con validación de negocio, Minimal API con `/health` y `/greet`, pruebas unitarias (xUnit) y de integración real (`WebApplicationFactory<Program>`). Excluido: persistencia, autenticación, contenedor Docker.

## Usuarios y actores
- Equipos que adoptan la extensión dotnet: lo usan como referencia de estructura y del patrón dominio/adaptador en C#.
- CI del framework: ejecuta `dotnet test` como gate.

## Restricciones
- .NET 8 SDK (LTS).
- `src/` y `test/` como directorios hermanos, nunca anidados (ver ADR-0001).
- Debe pasar los validadores del framework con `--root`.

## Criterios de éxito
- `dotnet test test/GreetingService.Tests.csproj` pasa en local y CI (15 pruebas: 7 casos de dominio con datos parametrizados, 4 de integración HTTP real).
- `quality-gates.mjs --root . --skip-commands` sin errores.
- El contrato HTTP es idéntico en forma al de `minimal-service`, `typescript-node-service` y `java-spring-service`.

## Estado
Mantenimiento.
