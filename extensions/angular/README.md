# Extensión Angular

Adapta el Core a frontends empresariales con Angular 17+.

## 1. Arquitectura recomendada

Standalone components organizados por feature con lazy loading por ruta. Estado con signals para UI local y servicios inyectables para estado compartido; NgRx solo cuando la complejidad de estado lo justifique por ADR. Lógica de negocio en servicios puros, componentes delgados.

## 2. Estructura de carpetas

```text
src/app/
  features/
    saludo/
      saludo.component.ts     # componente standalone
      saludo.service.ts       # lógica y acceso a datos de la feature
      saludo.routes.ts        # rutas lazy de la feature
  shared/
    components/               # UI reutilizable
    lib/                      # utilidades puras
  core/                       # interceptores, guards, configuración
  app.routes.ts
  app.config.ts
```

## 3. Convenciones

- Standalone components; sin NgModules nuevos.
- `ChangeDetectionStrategy.OnPush` por defecto; estado reactivo con signals.
- Inyección con `inject()`; servicios `providedIn: 'root'` solo si son globales.
- TypeScript estricto y `strictTemplates: true`.
- HTTP tipado con interfaces y validación en el borde; interceptor único para errores y correlation ID.

## 4. Herramientas de calidad

- Formato: Prettier.
- Lint: angular-eslint (incluye reglas de plantillas y accesibilidad).
- Análisis estático: `ng build` con presupuestos (`budgets`) y `tsc` estricto.

## 5. Estrategia de pruebas

- Unitarias: Jest o Vitest para servicios y lógica pura.
- Componentes: Testing Library (o TestBed enfocado en comportamiento) sobre interacción real.
- Integración con API: MSW o `HttpTestingController` en el límite HTTP.
- E2E: Playwright o Cypress en recorridos críticos.

## 6. Seguridad

- Confiar en la sanitización de Angular; nunca `bypassSecurityTrust*` con datos externos.
- Tokens en cookies `HttpOnly`; protección CSRF coordinada con el backend.
- CSP estricta; Trusted Types cuando el hosting lo permita.
- `npm audit --audit-level=high` y lockfile obligatorio.

## 7. Build y dependencias

- `ng build` con presupuestos de tamaño que fallan el build al excederse.
- `npm ci` en CI; artefacto estático inmutable con hash en nombres de archivo.
- Actualizaciones mayores con `ng update` en cambios aislados y revisables.

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
      static-analysis-command: npm run build -- --configuration=production
  test:
    uses: ./.github/workflows/test.yml
    with:
      setup-command: npm ci
      unit-command: npm test -- --watch=false
      e2e-command: npm run e2e
  security:
    uses: ./.github/workflows/security.yml
    with:
      setup-command: npm ci
      dependency-audit-command: npm audit --audit-level=high
```

## 9. Observabilidad

- `ErrorHandler` global que reporta a Sentry o equivalente con release y sourcemaps.
- Web Vitals y métricas de negocio de la SPA reportadas al backend.
- Interceptor HTTP que propaga `x-correlation-id` y mide latencia percibida.

## 10. Comandos de desarrollo

```bash
ng serve               # servidor de desarrollo
npm test               # unitarias
npm run e2e            # end-to-end
npm run lint
ng build               # build de producción con presupuestos
```

## 11. Ejemplo mínimo

```ts
// features/saludo/saludo.service.ts
@Injectable({ providedIn: 'root' })
export class SaludoService {
  private http = inject(HttpClient);
  obtener(name: string): Observable<{ greeting: string }> {
    return this.http.get<{ greeting: string }>('/api/greet', { params: { name } });
  }
}

// features/saludo/saludo.component.ts
@Component({
  selector: 'app-saludo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (saludo(); as s) { <p>{{ s.greeting }}</p> }
    @else { <p role="status">Cargando…</p> }
  `,
})
export class SaludoComponent {
  private service = inject(SaludoService);
  saludo = toSignal(this.service.obtener('Ada'));
}
```
