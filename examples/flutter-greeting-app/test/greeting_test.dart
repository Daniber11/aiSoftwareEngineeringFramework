import 'package:flutter_greeting_app/domain/greeting.dart';
import 'package:test/test.dart';

void main() {
  group('buildGreeting', () {
    test('saluda en español por defecto', () {
      expect(buildGreeting('Ana'), 'Hola, Ana.');
    });

    test('saluda en inglés cuando se pide', () {
      expect(buildGreeting('Ada', locale: 'en'), 'Hello, Ada.');
    });

    test('recorta espacios al inicio y al final', () {
      expect(buildGreeting('  Ana  '), 'Hola, Ana.');
    });

    test('acepta apóstrofes y guiones', () {
      expect(buildGreeting("O'Brien"), "Hola, O'Brien.");
      expect(buildGreeting('Jean-Paul'), 'Hola, Jean-Paul.');
    });

    test('acepta nombres con tildes y eñes', () {
      expect(buildGreeting('María José'), 'Hola, María José.');
    });

    test('rechaza nombre nulo', () {
      expect(() => buildGreeting(null), throwsA(isA<GreetingError>()));
    });

    test('rechaza nombre vacío', () {
      expect(() => buildGreeting(''), throwsA(isA<GreetingError>()));
    });

    test('rechaza nombre solo con espacios', () {
      expect(() => buildGreeting('   '), throwsA(isA<GreetingError>()));
    });

    test('rechaza nombre con dígitos', () {
      expect(() => buildGreeting('Ana3'), throwsA(isA<GreetingError>()));
    });

    test('rechaza nombre con símbolos no permitidos', () {
      expect(() => buildGreeting('Ana@'), throwsA(isA<GreetingError>()));
    });

    test('rechaza nombre que excede el máximo de caracteres', () {
      final longName = 'A'.padRight(81, 'A');
      expect(() => buildGreeting(longName), throwsA(isA<GreetingError>()));
    });

    test('acepta nombre justo en el límite de caracteres', () {
      final maxName = 'A'.padRight(80, 'A');
      expect(buildGreeting(maxName), 'Hola, $maxName.');
    });

    test('rechaza locale no soportado', () {
      expect(
        () => buildGreeting('Ana', locale: 'fr'),
        throwsA(isA<GreetingError>()),
      );
    });

    test('el mensaje de error es legible, no una excepción genérica', () {
      expect(
        () => buildGreeting(''),
        throwsA(
          isA<GreetingError>().having(
            (e) => e.message,
            'message',
            'El nombre es obligatorio.',
          ),
        ),
      );
    });
  });
}
