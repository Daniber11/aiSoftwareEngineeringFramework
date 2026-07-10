# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual

Mantener el ejemplo como adopción de referencia de la extensión typescript-node, sincronizado con la especificación 1.1.0.

## Estado

Estable. Dominio, adaptador HTTP y pruebas completos y en verde.

## Decisiones vigentes relevantes

- ADR-0001: validación en dos capas (zod en el borde, reglas de negocio en el dominio).

## Archivos o módulos en alcance

- `src/domain/greeting.ts`
- `src/adapters/http/server.ts`
- `test/`

## Riesgos y bloqueos

- Ninguno registrado.

## Próxima acción verificable

Ejecutar `npm run typecheck && npm run format:check && npm test` tras cualquier cambio; debe pasar completo.
