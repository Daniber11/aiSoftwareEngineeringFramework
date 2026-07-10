# Ejemplos

Adopciones de referencia del framework, completas y validables de punta a punta.

| Ejemplo | Qué demuestra |
|---|---|
| [minimal-service](minimal-service/README.md) | La adopción mínima real: manifiesto lleno, contexto activo, índice de módulos, un ADR, dominio puro con validación de entradas, servidor HTTP con health check, logs estructurados con correlation ID y pruebas unitarias y de integración con `node:test`. Cero dependencias externas. |
| [typescript-node-service](typescript-node-service/README.md) | La [extensión typescript-node](../extensions/typescript-node/README.md) llevada a código real: TypeScript estricto, validación en dos capas (zod en el borde + reglas de negocio en el dominio, con su propio ADR), `tsx`, `prettier` y dependencias reales fijadas por lockfile. |

Cada ejemplo debe pasar los validadores del framework:

```bash
node scripts/quality-gates.mjs --root examples/minimal-service --skip-commands
node --test examples/minimal-service/test/greeting.test.mjs examples/minimal-service/test/server.test.mjs

node scripts/quality-gates.mjs --root examples/typescript-node-service --skip-commands
cd examples/typescript-node-service && npm install && npm run typecheck && npm run format:check && npm test
```

`minimal-service` usa Node.js solo porque es el runtime ya exigido por el tooling (ADR-0001); su estructura documental es idéntica para cualquier stack. `typescript-node-service` sí usa dependencias reales de npm porque su propósito es demostrar la extensión tal cual se usaría en un proyecto real, no minimizar el footprint.
