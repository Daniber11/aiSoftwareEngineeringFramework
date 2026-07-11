import { test } from 'node:test';
import assert from 'node:assert/strict';
import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { GreetingFormComponent } from '../src/app/greeting-form.component.js';
import { GreetingService } from '../src/app/greeting.service.js';

/**
 * Prueba de lógica de componente sin TestBed ni renderizado: se crea un
 * `Injector` mínimo con `Injector.create` (API pública de Angular para DI
 * fuera del árbol de componentes) y se instancia la clase dentro de ese
 * contexto de inyección, porque el componente usa `inject()` como
 * inicializador de campo (el patrón recomendado por la extensión angular),
 * que requiere un contexto de inyección activo. No renderiza la plantilla
 * — eso es responsabilidad de una prueba E2E/Testing Library en un
 * proyecto real con Angular CLI, fuera del alcance cero-build de este
 * ejemplo (ver ADR-0001).
 */
function makeComponent(): GreetingFormComponent {
  const injector = Injector.create({ providers: [GreetingService] });
  return runInInjectionContext(injector, () => new GreetingFormComponent());
}

test('estado idle cuando el nombre está vacío', () => {
  const cmp = makeComponent();
  assert.equal(cmp.state().kind, 'idle');
});

test('escribir un nombre válido produce el saludo', () => {
  const cmp = makeComponent();
  cmp.onNameChange({ target: { value: 'Ada' } } as unknown as Event);
  assert.deepEqual(cmp.state(), { kind: 'content', greeting: 'Hola, Ada.' });
  assert.equal(cmp.contentMessage(), 'Hola, Ada.');
  assert.equal(cmp.errorMessage(), '');
});

test('cambiar el idioma recalcula el saludo reactivamente', () => {
  const cmp = makeComponent();
  cmp.onNameChange({ target: { value: 'Ada' } } as unknown as Event);
  cmp.setLocale('en');
  assert.deepEqual(cmp.state(), { kind: 'content', greeting: 'Hello, Ada.' });
});

test('un nombre inválido produce estado de error, no una excepción', () => {
  const cmp = makeComponent();
  cmp.onNameChange({ target: { value: '<script>' } } as unknown as Event);
  const state = cmp.state();
  assert.equal(state.kind, 'error');
  assert.equal(cmp.errorMessage(), 'El nombre contiene caracteres no permitidos.');
  assert.equal(cmp.contentMessage(), '');
});

test('recortar el nombre a vacío vuelve a idle', () => {
  const cmp = makeComponent();
  cmp.onNameChange({ target: { value: 'Ada' } } as unknown as Event);
  cmp.onNameChange({ target: { value: '   ' } } as unknown as Event);
  assert.equal(cmp.state().kind, 'idle');
});
