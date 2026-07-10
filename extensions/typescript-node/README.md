# Extensión TypeScript / Node.js

Adapta el Core a servicios backend con TypeScript estricto sobre Node.js 20+.

## 1. Arquitectura recomendada

Monolito modular con puertos y adaptadores ligeros: dominio y casos de uso en módulos puros sin dependencias de framework; HTTP (Fastify o Express), persistencia y colas como adaptadores. Evitar microservicios y event sourcing salvo necesidad demostrada por ADR.

## 2. Estructura de carpetas

```text
src/
  domain/            # entidades, reglas puras, errores de negocio
  application/       # casos de uso, puertos (interfaces)
  adapters/
    http/            # rutas, validación de entrada, mapeo de errores
    persistence/     # repositorios concretos
  config/            # carga y validación de configuración
test/
  unit/
  integration/
```

## 3. Convenciones

- `tsconfig` con `strict: true`, `noUncheckedIndexedAccess: true` y ESM (`"type": "module"`).
- Validación de entrada en el borde con esquemas (zod o JSON Schema); el dominio recibe tipos ya válidos.
- Errores de negocio como clases propias; nunca lanzar strings.
- Sin `any` salvo justificación comentada; preferir `unknown` + narrowing.
- Configuración solo desde variables de entorno validadas al arranque (fail fast).

## 4. Herramientas de calidad

- Formato: Prettier (modo check en CI).
- Lint: ESLint con `typescript-eslint` (perfil `strict-type-checked`).
- Análisis estático: `tsc --noEmit` como gate independiente.

## 5. Estrategia de pruebas

- Unitarias: `node:test` o Vitest sobre dominio y casos de uso; sin mocks de detalles internos.
- Integración: adaptadores contra dependencias reales (Testcontainers para BD; servidor HTTP en puerto efímero).
- Contrato: Pact cuando existan consumidores independientes.
- E2E: pocos recorridos críticos con Playwright o supertest contra entorno efímero.

## 6. Seguridad

- `npm audit --audit-level=high` como gate; lockfile obligatorio y commiteado.
- Helmet (o cabeceras equivalentes), rate limiting en el borde y CORS explícito.
- Secretos por variables de entorno; `.env` fuera del repositorio (solo `.env.example`).
- Sanitizar todo lo que llegue a logs; nunca registrar tokens ni PII.

## 7. Build y dependencias

- Build determinista con `npm ci` (nunca `npm install` en CI).
- Compilación con `tsc` o esbuild; artefacto inmutable (imagen o tarball) versionado.
- Contenedor multi-stage, usuario no root, `node:20-slim` o distroless.
- Dependencias de producción mínimas; revisar cada nueva dependencia estructural por ADR.

## 8. CI/CD

```yaml
jobs:
  framework:
    uses: ./.github/workflows/validate-framework.yml
  quality:
    uses: ./.github/workflows/quality.yml
    with:
      setup-command: npm ci
      format-command: npm run format:check
      lint-command: npm run lint
      static-analysis-command: npm run typecheck
  test:
    uses: ./.github/workflows/test.yml
    with:
      setup-command: npm ci
      unit-command: npm test
      integration-command: npm run test:integration
      coverage-path: coverage/
  security:
    uses: ./.github/workflows/security.yml
    with:
      setup-command: npm ci
      dependency-audit-command: npm audit --audit-level=high
```

## 9. Observabilidad

- Logs JSON con pino; correlation ID por request (AsyncLocalStorage) propagado en `x-correlation-id`.
- Métricas RED con `prom-client`; `/health` (liveness) y `/ready` (readiness) separados.
- OpenTelemetry para trazas solo en flujos distribuidos.

## 10. Comandos de desarrollo

```bash
npm run dev            # servidor con recarga (tsx/node --watch)
npm test               # unitarias
npm run test:integration
npm run lint && npm run typecheck && npm run format:check
npm run build          # compilar artefacto
```

## 11. Ejemplo mínimo

```ts
// src/domain/greeting.ts — puro, sin framework
export class GreetingError extends Error {}

export function buildGreeting(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) throw new GreetingError('El nombre es obligatorio.');
  if (trimmed.length > 80) throw new GreetingError('Nombre demasiado largo.');
  return `Hola, ${trimmed}.`;
}

// src/adapters/http/routes.ts — borde con validación
import { z } from 'zod';
const GreetQuery = z.object({ name: z.string().min(1).max(80) });

app.get('/greet', (req, reply) => {
  const parsed = GreetQuery.safeParse(req.query);
  if (!parsed.success) return reply.code(400).send({ error: 'Parámetros inválidos.' });
  return { greeting: buildGreeting(parsed.data.name) };
});
```

El [ejemplo minimal-service](../../examples/minimal-service/README.md) implementa este mismo patrón sin dependencias, en JavaScript puro. El [ejemplo typescript-node-service](../../examples/typescript-node-service/README.md) implementa esta extensión tal cual: TypeScript estricto, zod, `tsx` y `prettier` reales, instalables con `npm install` y validados en CI.
