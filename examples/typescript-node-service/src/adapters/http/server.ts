/**
 * Adaptador HTTP: valida en el borde con zod (patrón de la extensión
 * typescript-node) y delega al dominio. Mismo contrato observable que
 * examples/minimal-service para que ambos ejemplos sean comparables.
 */
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { buildGreeting, GreetingError } from '../../domain/greeting.js';

export const SERVICE = 'typescript-node-service';
export const VERSION = '1.0.0';

const GreetQuery = z.object({
  name: z.string().min(1).max(80),
  locale: z.string().optional(),
});

function log(level: 'info' | 'error', fields: Record<string, unknown>): void {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      service: SERVICE,
      version: VERSION,
      ...fields,
    }),
  );
}

function json(
  res: http.ServerResponse,
  status: number,
  body: unknown,
  correlationId: string,
): void {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'x-correlation-id': correlationId,
  });
  res.end(JSON.stringify(body));
}

export function createServer(): http.Server {
  return http.createServer((req, res) => {
    const started = process.hrtime.bigint();
    const correlationId = (req.headers['x-correlation-id'] as string | undefined) ?? randomUUID();
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

    const finish = (status: number, body: unknown): void => {
      json(res, status, body, correlationId);
      const durationMs = Number(process.hrtime.bigint() - started) / 1e6;
      log(status >= 500 ? 'error' : 'info', {
        correlationId,
        method: req.method,
        path: url.pathname,
        status,
        durationMs: Math.round(durationMs * 100) / 100,
      });
    };

    if (req.method !== 'GET') {
      finish(405, { error: 'Método no permitido.' });
      return;
    }
    if (url.pathname === '/health') {
      finish(200, { status: 'ok', version: VERSION });
      return;
    }
    if (url.pathname === '/greet') {
      const parsed = GreetQuery.safeParse(Object.fromEntries(url.searchParams));
      if (!parsed.success) {
        finish(400, { error: 'Parámetros inválidos: name es obligatorio (1-80 caracteres).' });
        return;
      }
      try {
        const greeting = buildGreeting(parsed.data.name, parsed.data.locale);
        finish(200, { greeting });
      } catch (e) {
        if (e instanceof GreetingError) {
          finish(400, { error: e.message });
          return;
        }
        log('error', { correlationId, path: url.pathname, error: String(e) });
        finish(500, { error: 'Error interno.' });
      }
      return;
    }
    finish(404, { error: 'Ruta no encontrada.' });
  });
}
