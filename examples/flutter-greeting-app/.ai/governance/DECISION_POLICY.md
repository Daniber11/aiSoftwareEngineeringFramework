# Política de decisiones — flutter-greeting-app

Aplica la política general del framework. Específico de este ejemplo:

## Puede ejecutar sin aprobación
- Correcciones de bugs con prueba de regresión.
- Mejoras de documentación y de mensajes de error.
- Nuevos casos de prueba.

## Debe proponer antes de ejecutar
- Añadir dependencias de producción nuevas.
- Cambiar el mensaje de saludo de forma incompatible con `angular-greeting-app`/`react-greeting-app`.
- Agregar las plataformas Android/iOS/Windows/Linux/macOS (cambia el alcance de "compilable de punta a punta en este entorno" documentado en ADR-0001).
- Añadir navegación, persistencia u otro alcance excluido en `PROJECT.md`.

Toda decisión estructural se registra como ADR en `.ai/decisions/adr/`.
