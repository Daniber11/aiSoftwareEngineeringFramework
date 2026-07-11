# Reglas para asistentes de IA — react-greeting-app

Aplican las reglas generales del framework. Específicas de este ejemplo:

1. Lee `FRAMEWORK.yaml` y `.ai/context/CURRENT_CONTEXT.md` antes de cualquier cambio.
2. `src/domain/` no importa nada de `react`; mantenlo puro y tipado estricto.
3. Toda la lógica de estado vive en `useGreeting` (hook), no en `GreetingForm` (componente); el componente solo presenta.
4. Las pruebas de componente usan `jsdom` + `react-dom/client` sin `@testing-library/react` (ver ADR-0001); no añadas Testing Library sin discutirlo primero — cambiaría el alcance de dependencias del ejemplo.
5. `tsc --noEmit` y `prettier --check` deben pasar antes de dar por terminado un cambio.
