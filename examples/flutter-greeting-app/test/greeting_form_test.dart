import 'package:flutter/material.dart';
import 'package:flutter_greeting_app/main.dart';
import 'package:flutter_test/flutter_test.dart';

/// Prueba de widget con render real (flutter_test/testWidgets), a
/// diferencia de angular-greeting-app (que evita TestBed): aquí no hay
/// infraestructura pesada que evitar, `flutter test` ya es el camino
/// estándar del SDK, así que se usa tal cual — mismo espíritu que
/// react-greeting-app (render real sobre DOM).
void main() {
  testWidgets('muestra el estado idle sin nombre', (tester) async {
    await tester.pumpWidget(const GreetingApp());

    expect(find.byKey(const Key('greeting-idle')), findsOneWidget);
    expect(find.text('Escribe un nombre.'), findsOneWidget);
  });

  testWidgets('escribir un nombre válido muestra el saludo', (tester) async {
    await tester.pumpWidget(const GreetingApp());

    await tester.enterText(find.byKey(const Key('name-field')), 'Ada');
    await tester.pump();

    expect(find.byKey(const Key('greeting-content')), findsOneWidget);
    expect(find.text('Hola, Ada.'), findsOneWidget);
  });

  testWidgets('un nombre inválido muestra error, no una excepción', (
    tester,
  ) async {
    await tester.pumpWidget(const GreetingApp());

    await tester.enterText(find.byKey(const Key('name-field')), '123');
    await tester.pump();

    expect(find.byKey(const Key('greeting-error')), findsOneWidget);
    expect(
      find.text('El nombre contiene caracteres no permitidos.'),
      findsOneWidget,
    );
  });

  testWidgets('vaciar el nombre vuelve al estado idle', (tester) async {
    await tester.pumpWidget(const GreetingApp());

    await tester.enterText(find.byKey(const Key('name-field')), 'Ada');
    await tester.pump();
    await tester.enterText(find.byKey(const Key('name-field')), '   ');
    await tester.pump();

    expect(find.byKey(const Key('greeting-idle')), findsOneWidget);
  });
}
