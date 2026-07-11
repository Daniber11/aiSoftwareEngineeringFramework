# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Mantener el ejemplo como adopción de referencia de la extensión react, sincronizado con la especificación 1.2.0.

## Estado
Estable. Dominio, hook, componente y pruebas completos y en verde (11 pruebas, incluido render real sobre DOM); sin vulnerabilidades conocidas en dependencias.

## Decisiones vigentes relevantes
- ADR-0001: pruebas de componente con jsdom + `react-dom/client`, sin `@testing-library/react` ni `react-test-renderer` (deprecado en React 19).

## Archivos o módulos en alcance
- `src/domain/greeting.ts`
- `src/app/useGreeting.ts`
- `src/app/GreetingForm.tsx`
- `test/`

## Riesgos y bloqueos
- Ninguno registrado.

## Próxima acción verificable
Ejecutar `npm run typecheck && npm run format:check && npm test` tras cualquier cambio; debe pasar completo.
