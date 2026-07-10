import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import { createServer } from '../src/adapters/http/server.js';

let server: Server;
let baseUrl: string;

before(async () => {
  server = createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (address === null || typeof address === 'string')
    throw new Error('No se pudo obtener el puerto.');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(() => new Promise<void>((resolve) => server.close(() => resolve())));

test('GET /health responde ok con versión', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = (await res.json()) as { status: string; version: string };
  assert.equal(body.status, 'ok');
  assert.match(body.version, /^\d+\.\d+\.\d+$/);
});

test('GET /greet responde el saludo localizado', async () => {
  const res = await fetch(`${baseUrl}/greet?name=Ada&locale=en`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { greeting: 'Hello, Ada.' });
});

test('GET /greet sin nombre responde 400 (rechazado por zod en el borde)', async () => {
  const res = await fetch(`${baseUrl}/greet`);
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error: string };
  assert.equal(typeof body.error, 'string');
});

test('GET /greet con nombre inválido para el dominio responde 400', async () => {
  const res = await fetch(`${baseUrl}/greet?name=${encodeURIComponent('<script>')}`);
  assert.equal(res.status, 400);
});

test('propaga el correlation ID recibido', async () => {
  const res = await fetch(`${baseUrl}/health`, { headers: { 'x-correlation-id': 'test-123' } });
  assert.equal(res.headers.get('x-correlation-id'), 'test-123');
});

test('rutas desconocidas y métodos no permitidos', async () => {
  assert.equal((await fetch(`${baseUrl}/nope`)).status, 404);
  assert.equal((await fetch(`${baseUrl}/greet?name=Ada`, { method: 'POST' })).status, 405);
});
