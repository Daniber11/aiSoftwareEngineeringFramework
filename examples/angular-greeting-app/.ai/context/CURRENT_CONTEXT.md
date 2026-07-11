# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual

Mantener el ejemplo como adopción de referencia de la extensión angular, sincronizado con la especificación 1.2.0.

## Estado

Estable. Dominio, servicio, componente y pruebas completos y en verde; sin vulnerabilidades conocidas en dependencias.

## Decisiones vigentes relevantes

- ADR-0001: pruebas de componente sin `TestBed` ni Angular CLI, usando `Injector.create` + `runInInjectionContext` + `@angular/compiler` en modo JIT.

## Archivos o módulos en alcance

- `src/domain/greeting.ts`
- `src/app/greeting.service.ts`
- `src/app/greeting-form.component.ts`
- `test/`

## Riesgos y bloqueos

- `@angular/core` fija versión ≥ 20.3.26 por una vulnerabilidad XSS conocida en versiones ≤ 19.2.25 (GHSA-prjf-86w9-mfqv, GHSA-g93w-mfhg-p222, GHSA-rgjc-h3x7-9mwg); revisar `npm audit` antes de bajar la versión.

## Próxima acción verificable

Ejecutar `npm run typecheck && npm run format:check && npm test` tras cualquier cambio; debe pasar completo.
