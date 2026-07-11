import 'package:flutter/foundation.dart';

import '../domain/greeting.dart';

sealed class GreetingState {
  const GreetingState();
}

final class GreetingIdle extends GreetingState {
  const GreetingIdle();
}

final class GreetingContent extends GreetingState {
  final String greeting;
  const GreetingContent(this.greeting);
}

final class GreetingErrorState extends GreetingState {
  final String message;
  const GreetingErrorState(this.message);
}

/// Controlador que envuelve el dominio puro. Estado siempre derivado de
/// nombre/idioma actuales, nunca guardado por separado — mismo patrón que
/// `useGreeting` (react-greeting-app) y el `computed` de
/// `GreetingFormComponent` (angular-greeting-app).
class GreetingController extends ChangeNotifier {
  String _name = '';
  String _locale = 'es';

  String get name => _name;
  String get locale => _locale;

  GreetingState get state {
    final trimmed = _name.trim();
    if (trimmed.isEmpty) return const GreetingIdle();
    try {
      return GreetingContent(buildGreeting(trimmed, locale: _locale));
    } on GreetingError catch (e) {
      return GreetingErrorState(e.message);
    }
  }

  void setName(String value) {
    _name = value;
    notifyListeners();
  }

  void setLocale(String value) {
    _locale = value;
    notifyListeners();
  }
}
