# Ejemplos

Adopciones de referencia del framework, completas y validables de punta a punta.

| Ejemplo | Qué demuestra |
|---|---|
| [minimal-service](minimal-service/README.md) | La adopción mínima real: manifiesto lleno, contexto activo, índice de módulos, un ADR, dominio puro con validación de entradas, servidor HTTP con health check, logs estructurados con correlation ID y pruebas unitarias y de integración con `node:test`. Cero dependencias externas. |
| [typescript-node-service](typescript-node-service/README.md) | La [extensión typescript-node](../extensions/typescript-node/README.md) llevada a código real: TypeScript estricto, validación en dos capas (zod en el borde + reglas de negocio en el dominio, con su propio ADR), `tsx`, `prettier` y dependencias reales fijadas por lockfile. |
| [angular-greeting-app](angular-greeting-app/README.md) | La [extensión angular](../extensions/angular/README.md) llevada a código real: standalone component, `OnPush`, estado por signals, servicio inyectable sobre un dominio puro, y pruebas de componente sin `TestBed` ni Angular CLI (ADR-0001 propio explica cómo y qué queda sin cubrir). |
| [react-greeting-app](react-greeting-app/README.md) | La [extensión react](../extensions/react/README.md) llevada a código real: separación hook/componente, estado derivado con `useMemo`, y pruebas con render real sobre DOM (jsdom) sin Testing Library ni la deprecada `react-test-renderer` (ADR-0001 propio explica la elección). |
| [java-spring-service](java-spring-service/README.md) | La [extensión java-spring](../extensions/java-spring/README.md) llevada a código real: dominio puro, controlador REST con Spring Boot 3, Gradle Wrapper autocontenido (sin depender de un Gradle instalado globalmente, ADR-0001 propio), 15 pruebas (JUnit 5 + AssertJ + `@SpringBootTest`). |
| [dotnet-greeting-service](dotnet-greeting-service/README.md) | La [extensión dotnet](../extensions/dotnet/README.md) llevada a código real: dominio puro, Minimal API con ASP.NET Core 8, `src/`+`test/` como proyectos hermanos (ADR-0001 propio explica por qué), 15 pruebas (xUnit + `WebApplicationFactory`). |
| [infrastructure-module](infrastructure-module/README.md) | La [extensión infrastructure](../extensions/infrastructure/README.md) llevada a código real: módulo Terraform con variables validadas y outputs documentados, verificado de punta a punta (`fmt`/`validate`/`plan`/`apply`/`destroy`) con el proveedor `local`, sin ninguna cuenta de nube (ADR-0001 propio explica por qué). |

Cada ejemplo debe pasar los validadores del framework:

```bash
node scripts/quality-gates.mjs --root examples/minimal-service --skip-commands
node --test examples/minimal-service/test/greeting.test.mjs examples/minimal-service/test/server.test.mjs

node scripts/quality-gates.mjs --root examples/typescript-node-service --skip-commands
cd examples/typescript-node-service && npm install && npm run typecheck && npm run format:check && npm test

node scripts/quality-gates.mjs --root examples/angular-greeting-app --skip-commands
cd examples/angular-greeting-app && npm install && npm run typecheck && npm run format:check && npm test

node scripts/quality-gates.mjs --root examples/react-greeting-app --skip-commands
cd examples/react-greeting-app && npm install && npm run typecheck && npm run format:check && npm test

node scripts/quality-gates.mjs --root examples/java-spring-service --skip-commands
cd examples/java-spring-service && ./gradlew test --console=plain

node scripts/quality-gates.mjs --root examples/dotnet-greeting-service --skip-commands
cd examples/dotnet-greeting-service && dotnet test test/GreetingService.Tests.csproj

node scripts/quality-gates.mjs --root examples/infrastructure-module --skip-commands
cd examples/infrastructure-module && terraform fmt -check -recursive && terraform -chdir=envs/dev init && terraform -chdir=envs/dev validate && terraform -chdir=envs/dev plan
```

`minimal-service` usa Node.js solo porque es el runtime ya exigido por el tooling (ADR-0001); su estructura documental es idéntica para cualquier stack. Los demás ejemplos sí usan dependencias y toolchains reales porque su propósito es demostrar cada extensión tal cual se usaría en un proyecto real, no minimizar el footprint.
