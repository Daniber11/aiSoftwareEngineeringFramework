# Arquitectura

## Estilo seleccionado
Separación hook/componente reducida a su mínima expresión: un hook con toda la lógica de estado, un componente de presentación puro. Sin enrutamiento ni estado de servidor: no hay más de una pantalla ni backend que lo justifiquen.

## Límites
- `src/domain/` — reglas de saludo, puro, sin dependencias de React.
- `src/app/useGreeting.ts` — hook: estado (`useState`) y estado derivado (`useMemo`) sobre el dominio.
- `src/app/GreetingForm.tsx` — componente de presentación, sin lógica propia.
- `test/` — pruebas de dominio (puras) y de componente (render real sobre jsdom).

## Flujo de dependencias
`GreetingForm → useGreeting → domain/greeting.ts`. El dominio no conoce React; el componente no conoce las reglas de validación, solo el estado que el hook expone.

## Contratos
Sin API HTTP: `useGreeting(initialName?)` es el contrato interno, tipado, que expone `state: GreetingState` (`idle | content | error`) — mismo dominio y mismos mensajes de error que los demás ejemplos del framework, para que sean comparables.

## Datos
Sin persistencia ni red. El estado vive solo en memoria del componente mientras la página está abierta.

## Atributos de calidad
- Seguridad: sin `dangerouslySetInnerHTML`; JSX escapa por defecto.
- Mantenibilidad: estado derivado con `useMemo` en vez de duplicado en múltiples `useState`.
- Testabilidad: el componente se prueba con render real sobre DOM (ver ADR-0001), no solo la lógica del hook en aislamiento.

## Diagramas
Innecesarios a este tamaño; el flujo de dependencias de arriba es el diagrama.

## Decisiones relacionadas
- [ADR-0001: Pruebas de componente con jsdom, sin Testing Library ni react-test-renderer](../decisions/adr/0001-pruebas-con-jsdom-sin-testing-library.md)
