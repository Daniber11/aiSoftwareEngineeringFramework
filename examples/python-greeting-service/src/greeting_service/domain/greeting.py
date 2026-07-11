"""Dominio de saludo: puro, sin FastAPI. Mismo patrón que los demás
ejemplos del framework, para que sean comparables entre sí.
"""

from __future__ import annotations

import re

_TEMPLATES = {
    "es": lambda name: f"Hola, {name}.",
    "en": lambda name: f"Hello, {name}.",
}
SUPPORTED_LOCALES = tuple(_TEMPLATES.keys())

_MAX_NAME_LENGTH = 80
_VALID_NAME = re.compile(r"^[^\W\d_](?:[^\W\d_]|['\- ])*$", re.UNICODE)


class GreetingError(Exception):
    """Error de negocio: entrada inválida según las reglas del dominio."""


def build_greeting(name: str | None, locale: str = "es") -> str:
    if name is None or not name.strip():
        raise GreetingError("El nombre es obligatorio.")
    trimmed = name.strip()
    if len(trimmed) > _MAX_NAME_LENGTH:
        raise GreetingError(f"El nombre supera {_MAX_NAME_LENGTH} caracteres.")
    if not _VALID_NAME.match(trimmed):
        raise GreetingError("El nombre contiene caracteres no permitidos.")
    effective_locale = (locale or "es").lower()
    template = _TEMPLATES.get(effective_locale)
    if template is None:
        supported = ", ".join(SUPPORTED_LOCALES)
        raise GreetingError(f"Idioma no soportado: se admite {supported}.")
    return template(trimmed)
