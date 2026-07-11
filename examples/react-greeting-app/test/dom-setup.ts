import { JSDOM } from 'jsdom';

/**
 * Entorno DOM mínimo para probar componentes reales con `react-dom/client`
 * sin `@testing-library/react` ni un navegador. Debe importarse antes que
 * cualquier módulo de `react-dom`, porque react-dom detecta el entorno
 * (`document`/`window`) al cargarse. Ver ADR-0001 de este ejemplo.
 */
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });

const globals: Record<string, unknown> = {
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  HTMLElement: dom.window.HTMLElement,
  HTMLInputElement: dom.window.HTMLInputElement,
  Event: dom.window.Event,
  customElements: dom.window.customElements,
};

for (const [key, value] of Object.entries(globals)) {
  Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
}

// Le indica a React que act() corre en un entorno de pruebas reconocido.
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
