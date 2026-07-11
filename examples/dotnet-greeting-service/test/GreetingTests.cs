using GreetingService.Domain;
using Xunit;

namespace GreetingService.Tests;

public class GreetingTests
{
    [Fact]
    public void SaludaEnEspanolPorDefectoYRecortaEspacios()
    {
        Assert.Equal("Hola, Ada.", Greeting.Build("  Ada  "));
    }

    [Fact]
    public void SaludaEnInglesCuandoLocaleEsEn()
    {
        Assert.Equal("Hello, Grace.", Greeting.Build("Grace", "en"));
    }

    [Fact]
    public void AceptaNombresConAcentosApostrofosYGuiones()
    {
        Assert.Equal("Hola, José-María O'Neill.", Greeting.Build("José-María O'Neill"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void RechazaNombreVacioONulo(string? name)
    {
        Assert.Throws<GreetingException>(() => Greeting.Build(name));
    }

    [Theory]
    [InlineData("<script>")]
    [InlineData("Ada; DROP TABLE")]
    [InlineData("{{x}}")]
    public void RechazaCaracteresFueraDeLaListaPermitida(string name)
    {
        Assert.Throws<GreetingException>(() => Greeting.Build(name));
    }

    [Fact]
    public void RechazaNombresDeMasDe80Caracteres()
    {
        var tooLong = new string('a', 81);
        Assert.Throws<GreetingException>(() => Greeting.Build(tooLong));
    }

    [Fact]
    public void RechazaIdiomasNoSoportadosYPublicaLosSoportados()
    {
        Assert.Equal(new[] { "es", "en" }, Greeting.SupportedLocales);
        Assert.Throws<GreetingException>(() => Greeting.Build("Ada", "fr"));
    }
}
