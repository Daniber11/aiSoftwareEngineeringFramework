# Identidad del proyecto

## Propósito

Servicio HTTP de saludo en TypeScript estricto: adopción de referencia de la [extensión typescript-node](../../../../extensions/typescript-node/README.md), con dependencias reales de npm (a diferencia de `minimal-service`, que es deliberadamente cero-dependencias).

## Alcance

Incluido: endpoint de saludo con localización es/en, validación de entrada con zod en el borde, health check, tipado estricto, pruebas con `node:test` vía `tsx`. Excluido: persistencia, autenticación, despliegue productivo, linting completo (se documenta ESLint en la extensión pero se omite aquí para mantener el footprint de dependencias mínimo).

## Usuarios y actores

- Equipos que adoptan la extensión typescript-node: lo usan como referencia de estructura y comandos.
- CI del framework: instala dependencias reales y ejecuta typecheck, formato y pruebas como gate.

## Restricciones

- Node.js ≥ 18; TypeScript en modo `strict` + `noUncheckedIndexedAccess`.
- Debe pasar los validadores del framework con `--root`.
- Las dependencias de npm deben quedar fijadas por `package-lock.json` commiteado.

## Criterios de éxito

- `npm run typecheck`, `npm run format:check` y `npm test` pasan en local y CI.
- `quality-gates.mjs --root . --skip-commands` sin errores.
- El contrato HTTP es idéntico en forma al de `minimal-service`, para comparar ambos patrones.

## Estado

Mantenimiento.
