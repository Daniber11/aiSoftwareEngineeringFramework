using GreetingService.Domain;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

const string Version = "1.0.0";

app.MapGet("/health", () => Results.Ok(new { status = "ok", version = Version }));

app.MapGet("/greet", (string? name, string? locale, HttpContext context) =>
{
    var correlationId = context.Request.Headers["x-correlation-id"].FirstOrDefault() ?? Guid.NewGuid().ToString();
    try
    {
        var greeting = Greeting.Build(name, locale);
        Log(app, correlationId, 200);
        return Results.Ok(new { greeting });
    }
    catch (GreetingException e)
    {
        Log(app, correlationId, 400);
        return Results.BadRequest(new { error = e.Message });
    }
});

app.Run();

static void Log(WebApplication app, string correlationId, int status)
{
    // Nunca registrar el nombre recibido: puede ser dato personal.
    app.Logger.LogInformation(
        "{{\"timestamp\":\"{Timestamp}\",\"level\":\"info\",\"service\":\"dotnet-greeting-service\",\"version\":\"1.0.0\",\"correlationId\":\"{CorrelationId}\",\"status\":{Status}}}",
        DateTimeOffset.UtcNow,
        correlationId,
        status);
}

// Necesario para que WebApplicationFactory<Program> (pruebas de integración) pueda referenciar
// el entry point de una Minimal API.
public partial class Program { }
