using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace GreetingService.Tests;

/// <summary>
/// Prueba de integración real: levanta la aplicación en memoria con
/// <see cref="WebApplicationFactory{TEntryPoint}"/> y hace peticiones HTTP
/// reales, igual que las pruebas de integración de los demás ejemplos.
/// </summary>
public class ProgramTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task HealthRespondeOkConVersion()
    {
        var response = await _client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.Equal("ok", body?["status"]);
        Assert.NotNull(body?["version"]);
    }

    [Fact]
    public async Task GreetRespondeElSaludoLocalizado()
    {
        var response = await _client.GetAsync("/greet?name=Ada&locale=en");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.Equal("Hello, Ada.", body?["greeting"]);
    }

    [Fact]
    public async Task GreetSinNombreResponde400ConErrorOpaco()
    {
        var response = await _client.GetAsync("/greet");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(body?["error"]);
    }

    [Fact]
    public async Task GreetConNombreInvalidoResponde400()
    {
        var response = await _client.GetAsync("/greet?name=%3Cscript%3E");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
