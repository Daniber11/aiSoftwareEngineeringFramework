# Extensión .NET

Adapta el Core a servicios backend con .NET 8+ (C# 12).

## 1. Arquitectura recomendada

Monolito modular con Vertical Slice o Clean Architecture ligera: dominio y casos de uso sin dependencias de ASP.NET; Minimal APIs o controladores como adaptador HTTP. Un proyecto por capa solo cuando el tamaño lo justifique; empezar con carpetas dentro de un único proyecto.

## 2. Estructura de carpetas

```text
src/Servicio/
  Domain/             # entidades, value objects, excepciones de negocio
  Application/        # casos de uso, puertos (interfaces)
  Adapters/
    Http/             # endpoints, DTO, mapeo de errores (ProblemDetails)
    Persistence/      # EF Core / Dapper
  Program.cs          # composición y configuración
tests/
  Servicio.UnitTests/
  Servicio.IntegrationTests/
```

## 3. Convenciones

- `Nullable enable` y `TreatWarningsAsErrors` en todos los proyectos.
- Inyección por constructor; composición explícita en `Program.cs`.
- Records para DTO y value objects; entidades con invariantes en el constructor.
- Errores de negocio como excepciones propias mapeadas a `ProblemDetails` en un handler único.
- Configuración tipada con `IOptions<T>` validada al arranque (`ValidateOnStart`).

## 4. Herramientas de calidad

- Formato: `dotnet format --verify-no-changes`.
- Análisis estático: Roslyn analyzers + `Microsoft.CodeAnalysis.NetAnalyzers` en nivel estricto (`AnalysisLevel: latest-recommended`).
- Cobertura: coverlet con umbral acordado.

## 5. Estrategia de pruebas

- Unitarias: xUnit + FluentAssertions sobre dominio y casos de uso.
- Integración: `WebApplicationFactory` para la API y Testcontainers para base de datos real.
- Contrato: PactNet cuando existan consumidores independientes.
- E2E: recorridos críticos contra entorno efímero.

## 6. Seguridad

- AuthN/AuthZ en servidor con ASP.NET Identity/JWT y políticas (`[Authorize(Policy=...)]`).
- Validación de entradas con DataAnnotations o FluentValidation en el borde.
- `dotnet list package --vulnerable --include-transitive` como gate de dependencias.
- Secretos con user-secrets en local y vault/variables de entorno en despliegue.

## 7. Build y dependencias

- `dotnet restore --locked-mode` con lockfile (`packages.lock.json`) commiteado.
- Publicación `dotnet publish -c Release` como artefacto inmutable; contenedor con imágenes `mcr` chiseled y usuario no root.
- Migraciones EF Core versionadas con script de rollback generado (`dotnet ef migrations script`).

## 8. CI/CD

```yaml
jobs:
  framework:
    uses: ./.github/workflows/validate-framework.yml
  quality:
    uses: ./.github/workflows/quality.yml
    with:
      format-command: dotnet format --verify-no-changes
      static-analysis-command: dotnet build -warnaserror
  test:
    uses: ./.github/workflows/test.yml
    with:
      unit-command: dotnet test tests/Servicio.UnitTests
      integration-command: dotnet test tests/Servicio.IntegrationTests
  security:
    uses: ./.github/workflows/security.yml
    with:
      dependency-audit-command: dotnet list package --vulnerable --include-transitive
```

## 9. Observabilidad

- `Microsoft.Extensions.Logging` con formato JSON; scopes para correlation ID.
- OpenTelemetry (métricas, trazas) integrado de serie; exportar métricas RED.
- Health checks con `AddHealthChecks()`: `/health/live` y `/health/ready` separados.

## 10. Comandos de desarrollo

```bash
dotnet run --project src/Servicio      # servidor local
dotnet test                            # todas las pruebas
dotnet format                          # formatear
dotnet build -warnaserror              # build con gates
```

## 11. Ejemplo mínimo

```csharp
// Domain/Greeting.cs — puro
public class GreetingError(string message) : Exception(message);

public static class Greeting
{
    public static string Build(string name)
    {
        var trimmed = name?.Trim() ?? "";
        if (trimmed.Length == 0) throw new GreetingError("El nombre es obligatorio.");
        if (trimmed.Length > 80) throw new GreetingError("Nombre demasiado largo.");
        return $"Hola, {trimmed}.";
    }
}

// Program.cs — borde
app.MapGet("/greet", (string name) =>
{
    try { return Results.Ok(new { greeting = Greeting.Build(name) }); }
    catch (GreetingError e) { return Results.Problem(e.Message, statusCode: 400); }
});
```
