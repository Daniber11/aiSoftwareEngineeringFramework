import pytest

from greeting_service.domain.greeting import SUPPORTED_LOCALES, GreetingError, build_greeting


def test_saluda_en_espanol_por_defecto_y_recorta_espacios():
    assert build_greeting("  Ada  ") == "Hola, Ada."


def test_saluda_en_ingles_cuando_locale_es_en():
    assert build_greeting("Grace", "en") == "Hello, Grace."


def test_acepta_nombres_con_acentos_apostrofos_y_guiones():
    assert build_greeting("José-María O'Neill") == "Hola, José-María O'Neill."


@pytest.mark.parametrize("name", ["", "   ", None])
def test_rechaza_nombre_vacio_o_nulo(name):
    with pytest.raises(GreetingError):
        build_greeting(name)


@pytest.mark.parametrize("name", ["<script>", "Ada; DROP TABLE", "{{x}}", "a1b2"])
def test_rechaza_caracteres_fuera_de_la_lista_permitida(name):
    with pytest.raises(GreetingError):
        build_greeting(name)


def test_rechaza_nombres_de_mas_de_80_caracteres():
    with pytest.raises(GreetingError):
        build_greeting("a" * 81)


def test_rechaza_idiomas_no_soportados_y_publica_los_soportados():
    assert SUPPORTED_LOCALES == ("es", "en")
    with pytest.raises(GreetingError):
        build_greeting("Ada", "fr")
