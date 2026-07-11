import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGreeting, GreetingError, SUPPORTED_LOCALES } from '../src/domain/greeting.js';

test('saluda en español por defecto y recorta espacios', () => {
  assert.equal(buildGreeting('  Ada  '), 'Hola, Ada.');
});

test('saluda en inglés cuando locale=en', () => {
  assert.equal(buildGreeting('Grace', 'en'), 'Hello, Grace.');
});

test('acepta nombres con acentos, apóstrofos y guiones', () => {
  assert.equal(buildGreeting("José-María O'Neill"), "Hola, José-María O'Neill.");
});

test('rechaza nombre vacío', () => {
  assert.throws(() => buildGreeting(''), GreetingError);
  assert.throws(() => buildGreeting('   '), GreetingError);
});

test('rechaza caracteres fuera de la lista permitida (inyección)', () => {
  for (const bad of ['<script>', 'Ada; DROP TABLE', 'a\nb', '{{x}}']) {
    assert.throws(() => buildGreeting(bad), GreetingError);
  }
});

test('rechaza nombres de más de 80 caracteres', () => {
  assert.throws(() => buildGreeting('a'.repeat(81)), GreetingError);
});

test('rechaza idiomas no soportados y publica los soportados', () => {
  assert.deepEqual(SUPPORTED_LOCALES, ['es', 'en']);
  assert.throws(() => buildGreeting('Ada', 'fr'), GreetingError);
});
