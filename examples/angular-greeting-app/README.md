# angular-greeting-app

Formulario de saludo en Angular que adopta la [extensión angular](../../extensions/angular/README.md) del framework: standalone components, `ChangeDetectionStrategy.OnPush` y estado por signals, sin Angular CLI ni empaquetador — el mismo espíritu cero-build que [minimal-service](../minimal-service/README.md) y [typescript-node-service](../typescript-node-service/README.md).

## Qué incluye

- [FRAMEWORK.yaml](FRAMEWORK.yaml) lleno, con `quality_gates` honestos sobre lo que este ejemplo no cubre (sin integración, sin E2E: no hay backend ni build real que integrar).
- Contexto de IA completo en `.ai/context/`.
- Una decisión registrada: [ADR-0001](.ai/decisions/adr/0001-pruebas-sin-testbed.md) — por qué las pruebas de componente no usan `TestBed` ni renderizan la plantilla.
- Dominio puro reutilizado del mismo patrón: [src/domain/greeting.ts](src/domain/greeting.ts).
- Servicio inyectable: [src/app/greeting.service.ts](src/app/greeting.service.ts).
- Componente standalone con signals: [src/app/greeting-form.component.ts](src/app/greeting-form.component.ts).
- 12 pruebas (`node:test` vía `tsx`) sobre el dominio y sobre la lógica reactiva del componente.

## Comandos

```bash
npm install              # instala @angular/core, @angular/compiler, typescript, tsx, prettier
npm run typecheck        # tsc --noEmit (análisis estático)
npm run format:check     # prettier --check
npm test                 # pruebas de dominio y de componente
```

No hay comando para "levantar" la app: sin Angular CLI no hay dev-server ni bundler configurado en este ejemplo (ver ADR-0001). Un proyecto real que adopte la extensión angular sí necesita Angular CLI para eso.

## Por qué existe una vulnerabilidad a evitar

`@angular/core` está fijado en `^20.3.26` porque las versiones ≤ 19.2.25 tienen tres CVE de XSS conocidas (ver `.ai/context/CURRENT_CONTEXT.md`). `npm audit` debe reportar cero vulnerabilidades; si no es así, no bajes la versión sin revisar el changelog de seguridad de Angular.
