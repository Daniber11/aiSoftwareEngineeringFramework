/// Dominio de saludo: puro, sin Flutter. Mismo patrón que los demás
/// ejemplos del framework, para que sean comparables entre sí.
library;

class GreetingError implements Exception {
  final String message;
  const GreetingError(this.message);

  @override
  String toString() => message;
}

const List<String> supportedLocales = ['es', 'en'];

const int _maxNameLength = 80;
final RegExp _validName = RegExp(r"^[\p{L}][\p{L}' -]*$", unicode: true);

String buildGreeting(String? name, {String locale = 'es'}) {
  final trimmed = name?.trim() ?? '';
  if (trimmed.isEmpty) {
    throw const GreetingError('El nombre es obligatorio.');
  }
  if (trimmed.length > _maxNameLength) {
    throw GreetingError('El nombre supera $_maxNameLength caracteres.');
  }
  if (!_validName.hasMatch(trimmed)) {
    throw const GreetingError('El nombre contiene caracteres no permitidos.');
  }
  final effectiveLocale = locale.toLowerCase();
  if (!supportedLocales.contains(effectiveLocale)) {
    final supported = supportedLocales.join(', ');
    throw GreetingError('Idioma no soportado: se admite $supported.');
  }
  return switch (effectiveLocale) {
    'en' => 'Hello, $trimmed.',
    _ => 'Hola, $trimmed.',
  };
}
