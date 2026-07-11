# dotnet-greeting-service

Servicio de saludo con ASP.NET Core Minimal API que adopta la [extensión dotnet](../../extensions/dotnet/README.md) del framework: dominio puro, Minimal API delgada, `src/`+`test/` como proyectos hermanos.

## Qué incluye

- [FRAMEWORK.yaml](FRAMEWORK.yaml) lleno.
- Contexto de IA completo en `.ai/context/`.
- Una decisión registrada: [ADR-0001](.ai/decisions/adr/0001-src-test-hermanos-sdk-local.md) — por qué `src/`+`test/` hermanos, y por qué el SDK de .NET se instaló localmente al usuario en vez de a nivel de sistema.
- Dominio puro en C#: [Greeting.cs](src/Domain/Greeting.cs).
- Minimal API con health check y logs JSON: [Program.cs](src/Program.cs).
- 15 pruebas: 7 casos de dominio con datos parametrizados (xUnit `[Theory]`/`[InlineData]`) y 4 de integración HTTP real (`WebApplicationFactory<Program>`).

## Comandos

```bash
dotnet test test/GreetingService.Tests.csproj    # todas las pruebas
dotnet run --project src/GreetingService.csproj  # ejecutar el servicio
```

Requiere el SDK de .NET 8 (LTS) en el `PATH`, o invocar el `dotnet` de una instalación local con su ruta completa.

## Endpoints

Mismo contrato que `minimal-service`, `typescript-node-service` y `java-spring-service`:

| Método y ruta | Respuesta |
|---|---|
| `GET /health` | `200 {"status":"ok","version":"1.0.0"}` |
| `GET /greet?name=Ada&locale=en` | `200 {"greeting":"Hello, Ada."}` |
| `GET /greet` sin `name` válido | `400 {"error":"..."}` |
