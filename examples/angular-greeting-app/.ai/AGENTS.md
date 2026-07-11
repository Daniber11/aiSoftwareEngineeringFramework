# Reglas para asistentes de IA — angular-greeting-app

Aplican las reglas generales del framework. Específicas de este ejemplo:

1. Lee `FRAMEWORK.yaml` y `.ai/context/CURRENT_CONTEXT.md` antes de cualquier cambio.
2. `src/domain/` no importa nada de `@angular/*`; mantenlo puro y tipado estricto.
3. `GreetingFormComponent` sigue el patrón standalone + `OnPush` + signals documentado en la extensión angular; no introduzcas `NgModule`, Zone.js explícito ni RxJS donde un signal basta.
4. Las pruebas de componente instancian la clase directamente dentro de un `Injector.create(...)` + `runInInjectionContext(...)` (ver ADR-0001); no añadas `TestBed` ni Angular CLI sin discutirlo primero — cambiaría el alcance cero-build del ejemplo.
5. `tsc --noEmit` y `prettier --check` deben pasar antes de dar por terminado un cambio.
