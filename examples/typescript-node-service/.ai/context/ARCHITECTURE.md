# Arquitectura

## Estilo seleccionado

Monolito modular con separación dominio/adaptador, siguiendo la arquitectura recomendada por la extensión typescript-node. Sin capa de aplicación separada: el dominio es lo bastante pequeño para que el adaptador HTTP invoque sus funciones directamente (ver ADR-0001).

## Límites

- `src/domain/` — reglas de saludo, puro, sin dependencias de framework ni de Node más allá del lenguaje.
- `src/adapters/http/` — servidor `node:http`, validación de entrada con zod, logging y health check.
- `src/main.ts` — composición y arranque.
- `test/` — pruebas unitarias del dominio e integración del adaptador.

## Flujo de dependencias

`main.ts → adapters/http/server.ts → domain/greeting.ts`. El dominio no conoce ni HTTP ni zod.

## Contratos

API HTTP idéntica en forma a la de `examples/minimal-service`: `GET /health` y `GET /greet?name&locale`. La validación de entrada ocurre en dos capas: zod en el borde (forma) y el dominio (reglas de negocio) — documentado como decisión, no como redundancia accidental.

## Datos

Sin persistencia. No se registra el nombre recibido en logs.

## Atributos de calidad

- Seguridad: doble validación de entrada (zod + dominio); TypeScript estricto elimina una clase de errores en tiempo de compilación.
- Mantenibilidad: tipado de punta a punta, sin `any`.
- Observabilidad: logs JSON con correlation ID, igual que `minimal-service`.

## Diagramas

Innecesarios a este tamaño; el flujo de dependencias de arriba es el diagrama.

## Decisiones relacionadas

- [ADR-0001: Validación en dos capas (zod + dominio)](../decisions/adr/0001-validacion-en-dos-capas.md)
