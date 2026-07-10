# ADR-0001: Validación en dos capas (zod en el borde, reglas en el dominio)

- Estado: Aceptado
- Fecha: 2026-07-10
- Responsables: Equipo del ejemplo
- Alcance: `src/adapters/http/server.ts`, `src/domain/greeting.ts`

## Contexto

La extensión typescript-node recomienda validar con esquemas (zod) en el borde y dejar el dominio con tipos ya válidos. Pero el dominio de saludo tiene reglas de negocio (longitud máxima, caracteres permitidos, idiomas soportados) que no son solo de forma. Había que decidir dónde vive cada validación para no duplicar conocimiento sin razón ni dejar reglas de negocio en el adaptador HTTP.

## Opciones consideradas

1. **Solo zod en el borde**: rápido, pero el dominio quedaría confiando ciegamente en la forma validada, y esa misma regla de negocio (regex de caracteres, idiomas soportados) tendría que vivir en el esquema zod — acoplando reglas de negocio al framework de validación HTTP.
2. **Solo el dominio valida, el borde no**: el dominio ya lanza `GreetingError`, así que técnicamente basta. Pero entonces errores de forma (parámetro ausente, tipo incorrecto) llegan al dominio como excepciones no tipadas en vez de un 400 temprano y explícito.
3. **Dos capas con responsabilidades distintas**: zod valida _forma_ (¿llegó `name` como string no vacío?), el dominio valida _reglas de negocio_ (¿es un nombre válido según nuestras reglas?). Redundancia parcial intencional, no accidental.

## Decisión

Opción 3. `GreetQuery` (zod) verifica que `name` sea un string de 1-80 caracteres antes de llamar al dominio; `buildGreeting` sigue validando patrón de caracteres e idiomas soportados, porque esas son reglas de negocio que también aplican si el dominio se reutiliza fuera de HTTP (p. ej. desde un job en cola, sin zod de por medio).

## Consecuencias

- Positivas: el dominio es reutilizable sin depender de zod; el borde HTTP falla rápido con mensajes claros de forma.
- Negativas: el límite de longitud (80) está declarado en dos lugares (zod y el dominio); si cambia, hay que actualizar ambos. Aceptado porque son solo dos números y el dominio es la fuente de verdad si divergen.
- Deuda aceptada: ninguna nueva; ya existía en `minimal-service` (que valida todo en una sola capa por no tener dependencias).

## Migración y rollback

No aplica: es la decisión fundacional de este ejemplo.

## Validación

`test/server.test.ts` cubre el caso de forma inválida (400 por zod) y el caso de regla de negocio inválida (400 por el dominio) por separado.
