# ADR-0001: Monolito modular sin dependencias externas

- Estado: Aceptado
- Fecha: 2026-07-10
- Responsables: Equipo del ejemplo
- Alcance: `src/`, `test/`

## Contexto

El ejemplo debe demostrar la adopción completa del framework con el mínimo ruido posible. Cualquier framework web, ORM o librería de logging desviaría la atención de lo que se quiere enseñar (estructura documental, límites, validación, observabilidad y pruebas) y añadiría mantenimiento de dependencias a un repositorio plantilla.

## Opciones consideradas

1. **Framework web popular (Express/Fastify)**: más realista, pero introduce lockfile, auditorías y actualizaciones permanentes en un repo cuya prioridad es la metodología.
2. **`node:http` + módulo de dominio puro, cero dependencias**: menos idiomático para producción, pero autoexplicativo, estable en el tiempo y ejecutable con el mismo runtime que ya exige el tooling del framework.

## Decisión

Opción 2: monolito modular con dominio puro (`src/domain/`) y un único adaptador HTTP (`src/server.mjs`) sobre `node:http`. Ninguna dependencia externa.

## Consecuencias

- Positivas: instalación cero, superficie de ataque mínima, el ejemplo entero se lee en dos archivos de código.
- Negativas: no ilustra integración con frameworks reales; eso corresponde a las extensiones por stack, no a este ejemplo.
- Deuda aceptada: ninguna.

## Migración y rollback

No aplica: es la decisión fundacional del ejemplo. Reemplazar el adaptador HTTP no afectaría al dominio.

## Validación

`node --test "test/**/*.test.mjs"` cubre dominio y adaptador; los validadores del framework verifican la estructura documental.
