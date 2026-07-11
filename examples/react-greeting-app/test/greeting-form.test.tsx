import './dom-setup.js';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { GreetingForm } from '../src/app/GreetingForm.js';

/**
 * Prueba de componente con render real sobre jsdom (no un DOM simulado a
 * medias): a diferencia del ejemplo angular-greeting-app, aquí sí se
 * verifica que la plantilla/JSX vincule correctamente el estado del hook
 * al DOM, incluida la simulación de un evento de entrada real sobre un
 * input controlado (ver ADR-0001).
 */
let container: HTMLDivElement;
let root: Root;

before(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    root = createRoot(container);
    root.render(<GreetingForm />);
  });
});

after(() => {
  act(() => root.unmount());
  container.remove();
});

function setInputValue(value: string): void {
  const input = container.querySelector('input');
  if (!input) throw new Error('No se encontró el input en el DOM renderizado.');
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set;
  if (!nativeSetter)
    throw new Error('No se pudo acceder al setter nativo de HTMLInputElement.value.');
  act(() => {
    nativeSetter.call(input, value);
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
}

test('muestra el estado idle sin nombre', () => {
  assert.equal(container.querySelector('[role="status"]')?.textContent, 'Escribe un nombre.');
});

test('escribir un nombre válido muestra el saludo en el DOM', () => {
  setInputValue('Ada');
  assert.equal(container.querySelector('p:not([role])')?.textContent, 'Hola, Ada.');
});

test('un nombre inválido muestra una alerta accesible', () => {
  setInputValue('<script>');
  assert.equal(
    container.querySelector('[role="alert"]')?.textContent,
    'El nombre contiene caracteres no permitidos.',
  );
});

test('vaciar el nombre vuelve al estado idle', () => {
  setInputValue('Ada');
  setInputValue('   ');
  assert.equal(container.querySelector('[role="status"]')?.textContent, 'Escribe un nombre.');
});
