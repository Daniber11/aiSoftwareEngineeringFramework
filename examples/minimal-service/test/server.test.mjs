import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.mjs';

let server;
let baseUrl;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test('GET /health responde ok con versión', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.match(body.version, /^\d+\.\d+\.\d+$/);
});

test('GET /greet responde el saludo localizado', async () => {
  const res = await fetch(`${baseUrl}/greet?name=Ada&locale=en`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { greeting: 'Hello, Ada.' });
});

test('GET /greet sin nombre responde 400 con error opaco', async () => {
  const res = await fetch(`${baseUrl}/greet`);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(typeof body.error, 'string');
});

test('propaga el correlation ID recibido', async () => {
  const res = await fetch(`${baseUrl}/health`, { headers: { 'x-correlation-id': 'test-123' } });
  assert.equal(res.headers.get('x-correlation-id'), 'test-123');
});

test('genera correlation ID cuando no llega ninguno', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.ok(res.headers.get('x-correlation-id').length > 0);
});

test('rutas desconocidas y métodos no permitidos', async () => {
  assert.equal((await fetch(`${baseUrl}/nope`)).status, 404);
  assert.equal((await fetch(`${baseUrl}/greet?name=Ada`, { method: 'POST' })).status, 405);
});
