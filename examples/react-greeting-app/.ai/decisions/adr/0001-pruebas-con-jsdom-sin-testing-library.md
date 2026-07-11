# ADR-0001: Pruebas de componente con jsdom, sin Testing Library ni react-test-renderer

- Estado: Aceptado
- Fecha: 2026-07-10
- Responsables: Equipo del ejemplo
- Alcance: `test/dom-setup.ts`, `test/greeting-form.test.tsx`, `package.json`

## Contexto

Los otros ejemplos del framework se prueban sin empaquetador ni framework de pruebas adicional (`node --test`/`tsx --test`). Para React existían dos caminos habituales: `@testing-library/react` (el estándar de facto, pero trae su propia cadena de dependencias y utilidades que este ejemplo no necesita) o `react-test-renderer` (permite probar sin DOM, pero **React 19 lo declara deprecado** — ver https://react.dev/warnings/react-test-renderer). El primer intento de este ejemplo usó `react-test-renderer`; al ejecutarlo, React imprime la advertencia de deprecación en cada prueba. Enviar un ejemplo de referencia del framework usando una API deprecada iba contra el principio de no introducir deuda evitable a sabiendas.

## Opciones consideradas

1. **`@testing-library/react` + jsdom**: el estándar de la comunidad, pero añade una capa de utilidades (`render`, `screen`, `fireEvent`) encima de lo que ya provee `react-dom/client`, aumentando el árbol de dependencias sin necesidad demostrable para un componente de una pantalla.
2. **`react-test-renderer`**: evita jsdom, pero está deprecado en React 19 y emite advertencias en cada ejecución; no es defendible como referencia.
3. **`jsdom` + `react-dom/client` directo, sin capa de utilidades**: jsdom crea un `document`/`window` reales (no una simulación parcial); `createRoot` + `act` (ambos de `react`/`react-dom`, sin dependencias extra) renderizan el componente de verdad. Las interacciones se simulan con el truco estándar de "setter nativo + `dispatchEvent`" que usa la propia Testing Library internamente.

## Decisión

Opción 3. `test/dom-setup.ts` crea un `document`/`window` con `jsdom` y los asigna a `globalThis` antes de que `react-dom` se cargue (debe ser la primera importación del archivo de prueba). `test/greeting-form.test.tsx` monta `<GreetingForm />` con `createRoot`, dentro de `act()`, sobre un `<div>` real del `document` de jsdom, y verifica el DOM resultante con `querySelector`/`textContent`.

A diferencia del ejemplo `angular-greeting-app` (que documenta explícitamente no probar el binding de la plantilla al DOM), este ejemplo **sí** renderiza y verifica el DOM real, incluida la simulación de un evento de entrada sobre un input controlado.

## Consecuencias

- Positivas: sin advertencias de deprecación, sin dependencia de Testing Library, cobertura real del renderizado (no solo de la lógica del hook en aislamiento).
- Negativas: la simulación de eventos de input requiere el truco del setter nativo (`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set`), que es menos legible que `fireEvent.change` de Testing Library; documentado en el propio código (`setInputValue`), no oculto.
- Deuda aceptada: ninguna nueva. `jsdom` es una dependencia de desarrollo razonable y ampliamente usada (es la base de Testing Library y de Jest en modo `jsdom`).

## Migración y rollback

Si el ejemplo creciera y se justificara `@testing-library/react`, migrar es aditivo: se instala, y `render`/`screen` reemplazan a `createRoot`/`querySelector` sin tocar `dom-setup.ts` (jsdom seguiría siendo la base).

## Validación

`npm test` ejecuta `test/greeting-form.test.tsx`: verifica el estado idle inicial, que un nombre válido produce el saludo en el DOM, que un nombre inválido muestra una alerta con `role="alert"`, y que vaciar el campo vuelve a idle — sin ninguna advertencia de deprecación en la salida.
