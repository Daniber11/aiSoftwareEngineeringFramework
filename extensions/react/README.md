# Extensión React

Adapta el Core a frontends SPA con React 18+ y TypeScript.

## 1. Arquitectura recomendada

Arquitectura por features: cada funcionalidad agrupa componentes, hooks, estado y pruebas. Estado del servidor con TanStack Query; estado global de UI solo si cruza features (Zustand o context acotado). Evitar Redux y micro-frontends sin necesidad demostrada por ADR.

## 2. Estructura de carpetas

```text
src/
  features/
    saludo/
      components/     # componentes de la feature
      hooks/          # lógica reutilizable de la feature
      api.ts          # llamadas al backend tipadas
      index.ts        # superficie pública de la feature
  shared/
    components/       # UI reutilizable entre features
    lib/              # utilidades puras
  app/                # rutas, providers, layout
test/                 # utilidades de prueba compartidas
```

## 3. Convenciones

- TypeScript estricto; props tipadas explícitamente, sin `React.FC`.
- Las features solo se importan entre sí por su `index.ts` (superficie pública).
- Lógica no visual en hooks o funciones puras testeables; componentes delgados.
- Accesibilidad como criterio de aceptación: roles, labels y navegación por teclado.
- Datos remotos siempre validados (zod) antes de entrar al estado.

## 4. Herramientas de calidad

- Formato: Prettier.
- Lint: ESLint con `typescript-eslint`, `eslint-plugin-react-hooks` y `eslint-plugin-jsx-a11y`.
- Análisis estático: `tsc --noEmit`.

## 5. Estrategia de pruebas

- Unitarias: Vitest para funciones puras y hooks (`renderHook`).
- Componentes: Testing Library orientada a comportamiento visible, no a implementación.
- Integración con API: MSW para simular el backend en el límite de red (no mockear fetch interno).
- E2E: Playwright en los recorridos críticos del usuario.

## 6. Seguridad

- Nunca `dangerouslySetInnerHTML` con datos externos; sanitizar si es inevitable.
- Tokens en cookies `HttpOnly` gestionadas por el backend; no en `localStorage`.
- CSP estricta desde el servidor que sirve la SPA.
- `npm audit --audit-level=high` y lockfile obligatorio.

## 7. Build y dependencias

- Vite para build; `npm ci` en CI; artefacto estático inmutable y versionado.
- Análisis de tamaño de bundle en CI con presupuesto definido (p. ej. `rollup-plugin-visualizer`).
- Variables de entorno solo públicas (`VITE_*`); ningún secreto llega al bundle.

## 8. CI/CD

```yaml
jobs:
  framework:
    uses: ./.github/workflows/validate-framework.yml
  quality:
    uses: ./.github/workflows/quality.yml
    with:
      setup-command: npm ci
      format-command: npm run format:check
      lint-command: npm run lint
      static-analysis-command: npm run typecheck
  test:
    uses: ./.github/workflows/test.yml
    with:
      setup-command: npm ci
      unit-command: npm test
      e2e-command: npm run test:e2e
  security:
    uses: ./.github/workflows/security.yml
    with:
      setup-command: npm ci
      dependency-audit-command: npm audit --audit-level=high
```

## 9. Observabilidad

- Errores de runtime a un servicio de tracking (Sentry o equivalente) con release y sourcemaps.
- Web Vitals (LCP, CLS, INP) reportadas como métricas de producto.
- Error boundaries por feature con fallback útil; correlation ID propagado en llamadas a la API.

## 10. Comandos de desarrollo

```bash
npm run dev            # servidor de desarrollo
npm test               # unitarias y componentes
npm run test:e2e       # Playwright
npm run lint && npm run typecheck
npm run build && npm run preview
```

## 11. Ejemplo mínimo

```tsx
// features/saludo/hooks/useGreeting.ts
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const GreetingSchema = z.object({ greeting: z.string() });

export function useGreeting(name: string) {
  return useQuery({
    queryKey: ['greeting', name],
    queryFn: async () => {
      const res = await fetch(`/api/greet?name=${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error('No se pudo obtener el saludo.');
      return GreetingSchema.parse(await res.json());
    },
    enabled: name.trim().length > 0,
  });
}

// features/saludo/components/Saludo.tsx
export function Saludo({ name }: { name: string }) {
  const { data, isPending, isError } = useGreeting(name);
  if (isPending) return <p role="status">Cargando…</p>;
  if (isError) return <p role="alert">No se pudo saludar.</p>;
  return <p>{data.greeting}</p>;
}
```

El [ejemplo react-greeting-app](../../examples/react-greeting-app/README.md) implementa el mismo patrón hook/componente de forma ejecutable y probada (sin backend real: el hook envuelve un dominio síncrono en vez de `useQuery`), con pruebas de render real sobre DOM — ver su ADR-0001 sobre por qué usa jsdom directo en vez de Testing Library.
