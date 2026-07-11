import 'package:flutter/material.dart';

import '../state/greeting_controller.dart';

/// Componente delgado: toda la lógica vive en [GreetingController]. Mismo
/// alcance que `GreetingForm` (react-greeting-app) y
/// `GreetingFormComponent` (angular-greeting-app): solo el campo de
/// nombre — el idioma se prueba a nivel de controlador, no desde la UI,
/// para que los tres ejemplos de frontend sean comparables.
class GreetingForm extends StatefulWidget {
  const GreetingForm({super.key});

  @override
  State<GreetingForm> createState() => _GreetingFormState();
}

class _GreetingFormState extends State<GreetingForm> {
  final _controller = GreetingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        final state = _controller.state;
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                key: const Key('name-field'),
                decoration: const InputDecoration(labelText: 'Nombre'),
                onChanged: _controller.setName,
              ),
              const SizedBox(height: 16),
              switch (state) {
                GreetingContent(:final greeting) => Text(
                  greeting,
                  key: const Key('greeting-content'),
                ),
                GreetingErrorState(:final message) => Text(
                  message,
                  key: const Key('greeting-error'),
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                ),
                GreetingIdle() => const Text(
                  'Escribe un nombre.',
                  key: Key('greeting-idle'),
                ),
              },
            ],
          ),
        );
      },
    );
  }
}
