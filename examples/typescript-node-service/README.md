# typescript-node-service

Servicio de saludo en TypeScript estricto que adopta la [extensión typescript-node](../../extensions/typescript-node/README.md) del framework. A diferencia de [minimal-service](../minimal-service/README.md) (cero dependencias, JavaScript puro), este ejemplo usa dependencias reales de npm para demostrar el patrón completo: tipado estricto, validación con zod en el borde y tooling de calidad instalable.

## Qué incluye

- [FRAMEWORK.yaml](FRAMEWORK.yaml) lleno, con `commands` que instalan e invocan las herramientas reales del stack.
- Contexto de IA completo en `.ai/context/`.
- Una decisión registrada: [ADR-0001](.ai/decisions/adr/0001-validacion-en-dos-capas.md) (por qué hay validación tanto en el borde como en el dominio).
- Dominio puro en TypeScript: [src/domain/greeting.ts](src/domain/greeting.ts).
- Adaptador HTTP con validación zod, health check, logs JSON y correlation ID: [src/adapters/http/server.ts](src/adapters/http/server.ts).
- Pruebas unitarias y de integración con `node:test` vía `tsx`: [test/](test/).

## Comandos

```bash
npm install                     # instala zod, typescript, tsx, prettier
npm run typecheck               # tsc --noEmit (análisis estático)
npm run format:check            # prettier --check
npm test                        # pruebas unitarias + integración HTTP
npm run dev                     # ejecutar el servicio (PORT=3000 por defecto)
```

## Endpoints

Igual contrato que `minimal-service`, para comparar ambos patrones:

| Método y ruta                   | Respuesta                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `GET /health`                   | `200 {"status":"ok","version":"1.0.0"}`                                             |
| `GET /greet?name=Ada&locale=es` | `200 {"greeting":"Hola, Ada."}`                                                     |
| `GET /greet` sin `name` válido  | `400` (rechazado por zod, forma) o por el dominio (regla de negocio) — ver ADR-0001 |

## Nota sobre el alcance

La extensión typescript-node documenta ESLint como herramienta de lint. Este ejemplo la omite deliberadamente para mantener el árbol de `node_modules` pequeño y rápido de instalar en CI; `quality_gates.linting` está marcado `optional` en su `FRAMEWORK.yaml` por esa razón, no por descuido. Un proyecto real que adopte esta extensión debe activarlo.
