package com.framework.example.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class GreetingTest {

    @Test
    void saludaEnEspanolPorDefectoYRecortaEspacios() {
        assertThat(Greeting.build("  Ada  ", null)).isEqualTo("Hola, Ada.");
    }

    @Test
    void saludaEnInglesCuandoLocaleEsEn() {
        assertThat(Greeting.build("Grace", "en")).isEqualTo("Hello, Grace.");
    }

    @Test
    void aceptaNombresConAcentosApostrofosYGuiones() {
        assertThat(Greeting.build("José-María O'Neill", "es")).isEqualTo("Hola, José-María O'Neill.");
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   "})
    void rechazaNombreVacio(String name) {
        assertThatThrownBy(() -> Greeting.build(name, "es")).isInstanceOf(GreetingException.class);
    }

    @Test
    void rechazaNombreNulo() {
        assertThatThrownBy(() -> Greeting.build(null, "es")).isInstanceOf(GreetingException.class);
    }

    @ParameterizedTest
    @ValueSource(strings = {"<script>", "Ada; DROP TABLE", "{{x}}"})
    void rechazaCaracteresFueraDeLaListaPermitida(String name) {
        assertThatThrownBy(() -> Greeting.build(name, "es")).isInstanceOf(GreetingException.class);
    }

    @Test
    void rechazaNombresDeMasDe80Caracteres() {
        String tooLong = "a".repeat(81);
        assertThatThrownBy(() -> Greeting.build(tooLong, "es")).isInstanceOf(GreetingException.class);
    }

    @Test
    void rechazaIdiomasNoSoportadosYPublicaLosSoportados() {
        assertThat(Greeting.SUPPORTED_LOCALES).containsExactlyInAnyOrder("es", "en");
        assertThatThrownBy(() -> Greeting.build("Ada", "fr")).isInstanceOf(GreetingException.class);
    }
}
