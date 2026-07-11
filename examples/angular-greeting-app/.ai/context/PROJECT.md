# Identidad del proyecto

## Propósito

Formulario de saludo en Angular: adopción de referencia de la [extensión angular](../../../../extensions/angular/README.md), demostrando standalone components, `OnPush` y estado por signals sin necesidad de Angular CLI, builder ni bootstrap de plataforma para poder probarse.

## Alcance

Incluido: un servicio inyectable (`GreetingService`) que envuelve un dominio puro, un componente standalone (`GreetingFormComponent`) con estado 100% por signals, y pruebas de lógica de componente sin `TestBed`. Excluido explícitamente: enrutamiento, HTTP real, Angular CLI/`angular.json`, pruebas E2E o de integración (no hay backend que integrar) y renderizado real de la plantilla (ver ADR-0001 sobre por qué).

## Usuarios y actores

- Equipos que adoptan la extensión angular: lo usan como referencia de estructura, signals y DI testeable.
- CI del framework: instala dependencias reales y ejecuta typecheck, formato y pruebas como gate.

## Restricciones

- Node.js ≥ 18; Angular sin versiones con vulnerabilidades conocidas (≥ 19.2.26 / rama 20 LTS al momento de escribir esto).
- Debe pasar los validadores del framework con `--root`.
- Sin Angular CLI: el proyecto se compila y prueba solo con `tsc`/`tsx`, para mantener el mismo alcance ligero que `typescript-node-service`.

## Criterios de éxito

- `npm run typecheck`, `npm run format:check` y `npm test` pasan en local y CI.
- `quality-gates.mjs --root . --skip-commands` sin errores.
- `npm audit` sin vulnerabilidades conocidas.

## Estado

Mantenimiento.
