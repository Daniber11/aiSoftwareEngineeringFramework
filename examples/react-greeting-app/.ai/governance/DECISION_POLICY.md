# Política de decisiones — react-greeting-app

Aplica la política general del framework. Específico de este ejemplo:

## Puede ejecutar sin aprobación
- Correcciones de bugs con prueba de regresión.
- Mejoras de documentación y de mensajes de error.
- Nuevos casos de prueba.

## Debe proponer antes de ejecutar
- Añadir Vite, Create React App u otro bundler (cambiaría el alcance cero-build documentado en `PROJECT.md`).
- Añadir `@testing-library/react` o volver a `react-test-renderer` (reemplazaría el patrón del ADR-0001).
- Añadir enrutamiento o estado de servidor (TanStack Query, etc.).
- Añadir dependencias de producción nuevas.

Toda decisión estructural se registra como ADR en `.ai/decisions/adr/`.
