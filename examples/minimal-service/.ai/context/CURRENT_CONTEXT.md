# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Mantener el ejemplo como adopción de referencia mínima del framework, sincronizado con la especificación 1.1.0.

## Estado
Estable. Dominio, adaptador HTTP y pruebas completos y en verde.

## Decisiones vigentes relevantes
- ADR-0001: monolito modular sin dependencias externas.

## Archivos o módulos en alcance
- `src/domain/greeting.mjs`
- `src/server.mjs`
- `test/`

## Riesgos y bloqueos
- Ninguno registrado.

## Próxima acción verificable
Ejecutar `node --test "test/**/*.test.mjs"` tras cualquier cambio; debe pasar completo.
