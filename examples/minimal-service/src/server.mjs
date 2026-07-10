/**
 * Adaptador HTTP del servicio de saludo.
 * Observabilidad mínima del estándar del framework: logs JSON de una línea
 * con correlation ID, y health check diferenciado.
 */
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { buildGreeting, GreetingError } from './domain/greeting.mjs';

export const SERVICE = 'minimal-service';
export const VERSION = '1.0.0';

function log(level, fields) {
  // Nunca registrar el nombre recibido: puede ser dato personal.
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: SERVICE,
    version: VERSION,
    ...fields,
  }));
}

function json(res, status, body, correlationId) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'x-correlation-id': correlationId,
  });
  res.end(JSON.stringify(body));
}

export function createServer() {
  return http.createServer((req, res) => {
    const started = process.hrtime.bigint();
    const correlationId = req.headers['x-correlation-id'] ?? randomUUID();
    const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

    const finish = (status, body) => {
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
      return finish(405, { error: 'Método no permitido.' });
    }
    if (url.pathname === '/health') {
      return finish(200, { status: 'ok', version: VERSION });
    }
    if (url.pathname === '/greet') {
      try {
        const greeting = buildGreeting(url.searchParams.get('name'), url.searchParams.get('locale') ?? 'es');
        return finish(200, { greeting });
      } catch (e) {
        if (e instanceof GreetingError) {
          return finish(400, { error: e.message });
        }
        // No exponer detalles internos al cliente.
        log('error', { correlationId, path: url.pathname, error: e.message });
        return finish(500, { error: 'Error interno.' });
      }
    }
    return finish(404, { error: 'Ruta no encontrada.' });
  });
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop());
if (isMain) {
  const port = Number(process.env.PORT ?? 3000);
  createServer().listen(port, () => {
    log('info', { message: `Escuchando en el puerto ${port}` });
  });
}
