# Arquitectura

## Estilo seleccionado
Minimal API con dominio puro separado (`src/Domain/`). Sin controladores MVC, sin capas adicionales: el servicio es demasiado pequeño para justificarlas.

## Límites
- `src/Domain/Greeting.cs` — reglas de saludo y `GreetingException`, sin dependencias de ASP.NET Core.
- `src/Program.cs` — Minimal API, composición y arranque; expone `public partial class Program` para que `WebApplicationFactory<Program>` pueda referenciarlo en pruebas.
- `test/` — proyecto de pruebas hermano de `src/` (no anidado, ver ADR-0001), con pruebas de dominio y de integración HTTP.

## Flujo de dependencias
`Program.cs → Domain/Greeting.cs`. El dominio no conoce ASP.NET Core.

## Contratos
API HTTP idéntica en forma a `examples/minimal-service` y `examples/java-spring-service`: `GET /health` y `GET /greet?name&locale`.

## Datos
Sin persistencia. No se registra el nombre recibido en logs.

## Atributos de calidad
- Seguridad: validación de entrada antes de tocar el dominio; sin datos sensibles en logs.
- Reproducibilidad: `TargetFramework net8.0` fijo; SDK de .NET 8 requerido (LTS).
- Observabilidad: logs JSON con correlation ID, igual que los demás ejemplos.

## Diagramas
Innecesarios a este tamaño; el flujo de dependencias de arriba es el diagrama.

## Decisiones relacionadas
- [ADR-0001: src/ y test/ como proyectos hermanos, SDK de .NET instalado localmente](../decisions/adr/0001-src-test-hermanos-sdk-local.md)
