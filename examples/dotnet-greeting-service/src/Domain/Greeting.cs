using System.Text.RegularExpressions;

namespace GreetingService.Domain;

/// <summary>
/// Error de negocio: entrada inválida según las reglas del dominio de saludo.
/// </summary>
public sealed class GreetingException(string message) : Exception(message);

/// <summary>
/// Dominio de saludo: puro, sin ASP.NET Core. Mismo patrón que los demás
/// ejemplos del framework, para que sean comparables entre sí.
/// </summary>
public static partial class Greeting
{
    private const int MaxNameLength = 80;

    private static readonly IReadOnlyDictionary<string, Func<string, string>> Templates =
        new Dictionary<string, Func<string, string>>
        {
            ["es"] = name => $"Hola, {name}.",
            ["en"] = name => $"Hello, {name}.",
        };

    public static IReadOnlyCollection<string> SupportedLocales => (IReadOnlyCollection<string>)Templates.Keys;

    [GeneratedRegex(@"^[\p{L}][\p{L}' -]*$")]
    private static partial Regex ValidNamePattern();

    public static string Build(string? name, string? locale = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new GreetingException("El nombre es obligatorio.");
        }

        var trimmed = name.Trim();
        if (trimmed.Length > MaxNameLength)
        {
            throw new GreetingException($"El nombre supera {MaxNameLength} caracteres.");
        }

        if (!ValidNamePattern().IsMatch(trimmed))
        {
            throw new GreetingException("El nombre contiene caracteres no permitidos.");
        }

        var effectiveLocale = string.IsNullOrWhiteSpace(locale) ? "es" : locale.ToLowerInvariant();
        if (!Templates.TryGetValue(effectiveLocale, out var template))
        {
            throw new GreetingException(
                $"Idioma no soportado: se admite {string.Join(", ", SupportedLocales)}.");
        }

        return template(trimmed);
    }
}
