# Arquitectura

## Estilo seleccionado

Componente standalone único con servicio inyectable delgado sobre un dominio puro, siguiendo la arquitectura por features de la extensión angular reducida a su mínima expresión (una sola feature). Sin `NgModule`, sin enrutamiento: no hay más de una pantalla que justifique cualquiera de los dos.

## Límites

- `src/domain/` — reglas de saludo, puro, sin dependencias de Angular.
- `src/app/greeting.service.ts` — adaptador inyectable (`@Injectable({ providedIn: 'root' })`) entre el dominio y Angular.
- `src/app/greeting-form.component.ts` — componente standalone, `OnPush`, estado por `signal`/`computed`.
- `test/` — pruebas de dominio (puras) y de lógica de componente (con `Injector` mínimo, sin `TestBed`).

## Flujo de dependencias

`GreetingFormComponent → GreetingService → domain/greeting.ts`. El dominio no conoce Angular; el servicio no conoce el componente.

## Contratos

Sin API HTTP: `GreetingService.greet(name, locale)` es el contrato interno, tipado, que lanza `GreetingError` ante entrada inválida — mismo dominio y mismos mensajes de error que `examples/minimal-service` y `examples/typescript-node-service`, para que los tres ejemplos sean comparables.

## Datos

Sin persistencia ni red. El estado vive solo en memoria del componente mientras la página está abierta.

## Atributos de calidad

- Seguridad: sin `innerHTML` ni `bypassSecurityTrust*`; el binding `{{ }}` de Angular escapa por defecto.
- Mantenibilidad: un único componente pequeño, estado derivado (no duplicado) vía `computed`.
- Testabilidad: la lógica reactiva se prueba sin bootstrap de plataforma (ver ADR-0001).

## Diagramas

Innecesarios a este tamaño; el flujo de dependencias de arriba es el diagrama.

## Decisiones relacionadas

- [ADR-0001: Pruebas de componente sin TestBed ni Angular CLI](../decisions/adr/0001-pruebas-sin-testbed.md)
