package com.framework.example.domain;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Dominio de saludo: puro, sin dependencias de Spring. Mismo patrón que los
 * demás ejemplos del framework (minimal-service, typescript-node-service,
 * angular-greeting-app, react-greeting-app), para que sean comparables.
 */
public final class Greeting {

    private static final int MAX_NAME_LENGTH = 80;
    private static final Pattern VALID_NAME = Pattern.compile("^[\\p{L}][\\p{L}' -]*$");
    private static final Map<String, java.util.function.Function<String, String>> TEMPLATES =
            Map.of(
                    "es", name -> "Hola, " + name + ".",
                    "en", name -> "Hello, " + name + ".");
    public static final Set<String> SUPPORTED_LOCALES = TEMPLATES.keySet();

    private Greeting() {}

    public static String build(String name, String locale) {
        if (name == null) {
            throw new GreetingException("El nombre es obligatorio.");
        }
        String trimmed = name.strip();
        if (trimmed.isEmpty()) {
            throw new GreetingException("El nombre es obligatorio.");
        }
        if (trimmed.length() > MAX_NAME_LENGTH) {
            throw new GreetingException("El nombre supera " + MAX_NAME_LENGTH + " caracteres.");
        }
        if (!VALID_NAME.matcher(trimmed).matches()) {
            throw new GreetingException("El nombre contiene caracteres no permitidos.");
        }
        String effectiveLocale = locale == null || locale.isBlank() ? "es" : locale.toLowerCase(Locale.ROOT);
        var template = TEMPLATES.get(effectiveLocale);
        if (template == null) {
            throw new GreetingException(
                    "Idioma no soportado: se admite " + String.join(", ", List.copyOf(SUPPORTED_LOCALES)) + ".");
        }
        return template.apply(trimmed);
    }
}
