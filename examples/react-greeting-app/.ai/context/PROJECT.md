# Identidad del proyecto

## Propósito
Formulario de saludo en React: adopción de referencia de la [extensión react](../../../../extensions/react/README.md), demostrando la separación hook/componente y estado derivado, con pruebas que renderizan sobre un DOM real (jsdom) sin `@testing-library/react`.

## Alcance
Incluido: un hook (`useGreeting`) que envuelve un dominio puro con estado derivado (`useMemo`), un componente de presentación (`GreetingForm`), y pruebas que renderizan el componente real y verifican el DOM resultante. Excluido explícitamente: enrutamiento, estado de servidor/TanStack Query (no hay backend que integrar), Vite/bundler y pruebas E2E.

## Usuarios y actores
- Equipos que adoptan la extensión react: lo usan como referencia de separación hook/componente y de cómo probar sin Testing Library.
- CI del framework: instala dependencias reales y ejecuta typecheck, formato y pruebas como gate.

## Restricciones
- Node.js ≥ 18; React 19 (sin usar `react-test-renderer`, deprecado — ver ADR-0001).
- Debe pasar los validadores del framework con `--root`.
- Sin Vite ni bundler: el proyecto se compila y prueba solo con `tsc`/`tsx`, igual que `typescript-node-service` y `angular-greeting-app`.

## Criterios de éxito
- `npm run typecheck`, `npm run format:check` y `npm test` pasan en local y CI.
- `quality-gates.mjs --root . --skip-commands` sin errores.
- `npm audit` sin vulnerabilidades conocidas.

## Estado
Mantenimiento.
