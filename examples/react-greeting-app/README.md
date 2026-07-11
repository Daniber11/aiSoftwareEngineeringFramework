# react-greeting-app

Formulario de saludo en React que adopta la [extensión react](../../extensions/react/README.md) del framework: separación hook/componente, estado derivado con `useMemo`, y pruebas que renderizan de verdad sobre DOM (jsdom) sin `@testing-library/react` ni la deprecada `react-test-renderer` — mismo espíritu cero-build que los demás ejemplos.

## Qué incluye

- [FRAMEWORK.yaml](FRAMEWORK.yaml) lleno, con `quality_gates` honestos sobre lo que este ejemplo no cubre (sin integración, sin E2E: no hay backend ni build real que integrar).
- Contexto de IA completo en `.ai/context/`.
- Una decisión registrada: [ADR-0001](.ai/decisions/adr/0001-pruebas-con-jsdom-sin-testing-library.md) — por qué las pruebas usan jsdom directo en vez de Testing Library o `react-test-renderer`.
- Dominio puro reutilizado del mismo patrón: [src/domain/greeting.ts](src/domain/greeting.ts).
- Hook con estado derivado: [src/app/useGreeting.ts](src/app/useGreeting.ts).
- Componente de presentación: [src/app/GreetingForm.tsx](src/app/GreetingForm.tsx).
- 11 pruebas (`node:test` vía `tsx`): dominio puro + render real del componente sobre DOM.

## Comandos

```bash
npm install              # instala react, react-dom, jsdom, typescript, tsx, prettier
npm run typecheck        # tsc --noEmit (análisis estático)
npm run format:check     # prettier --check
npm test                 # pruebas de dominio y de componente (DOM real vía jsdom)
```

No hay comando para "levantar" la app: sin bundler no hay dev-server configurado en este ejemplo (ver ADR-0001 sobre el alcance de las pruebas). Un proyecto real que adopte la extensión react sí necesita Vite u otro bundler para eso.
