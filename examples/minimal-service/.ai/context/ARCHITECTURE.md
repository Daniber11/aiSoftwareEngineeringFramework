# Arquitectura

## Estilo seleccionado
Monolito modular con separación puertos-adaptadores mínima: un módulo de dominio puro y un adaptador HTTP. No hay DDD táctico, CQRS ni capas adicionales porque el dominio es trivial (ver ADR-0001).

## Límites
- `src/domain/` — reglas de saludo, puro, sin I/O ni dependencias de Node más allá del lenguaje.
- `src/server.mjs` — adaptador HTTP (`node:http`), validación de entradas, logging y health check.
- `test/` — pruebas unitarias del dominio e integración del adaptador.

## Flujo de dependencias
`server.mjs → domain/greeting.mjs`. El dominio no conoce al servidor. Ninguna dependencia externa.

## Contratos
API HTTP documentada en el [README](../../README.md): `GET /health` y `GET /greet?name&locale`. Errores en JSON `{"error": string}` sin detalles internos. Cambios incompatibles requieren ADR.

## Datos
Sin persistencia. No se almacena ni registra el nombre recibido (dato personal potencial); solo longitud y resultado de validación.

## Atributos de calidad
- Seguridad: validación estricta de `name` y `locale` en el límite de confianza; respuestas de error opacas.
- Observabilidad: logs JSON con `timestamp`, `level`, `service`, `version`, `correlationId`, `path`, `status`, `durationMs`.
- Mantenibilidad: cero dependencias; el servicio completo se lee en dos archivos.

## Diagramas
Innecesarios a este tamaño; el flujo de dependencias de arriba es el diagrama.

## Decisiones relacionadas
- [ADR-0001: Monolito modular sin dependencias](../decisions/adr/0001-monolito-modular-sin-dependencias.md)
