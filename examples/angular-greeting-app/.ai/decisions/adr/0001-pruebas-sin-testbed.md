# ADR-0001: Pruebas de componente sin TestBed ni Angular CLI

- Estado: Aceptado
- Fecha: 2026-07-10
- Responsables: Equipo del ejemplo
- Alcance: `test/greeting-form.component.test.ts`, `package.json`

## Contexto

Los otros ejemplos del framework (`minimal-service`, `typescript-node-service`) se prueban con `node --test`/`tsx --test` sin empaquetador ni framework de pruebas adicional. Angular normalmente se prueba con `TestBed` (que requiere Angular CLI, Karma o un adaptador como Vitest+jsdom, y zona de ejecución) o con Angular CLI completo para tener un entorno de build. Adoptar cualquiera de los dos habría roto la consistencia "cero-build" de los ejemplos del framework y añadido dependencias pesadas (Karma necesita un navegador; Angular CLI trae su propio builder y `angular.json`) solo para probar un componente de una pantalla.

## Opciones consideradas

1. **Angular CLI + Karma/Jasmine**: el camino oficial, pero exige un navegador (headless Chrome) en CI, `angular.json`, y un árbol de dependencias mucho mayor — desproporcionado para un ejemplo de una pantalla.
2. **Angular CLI + Vitest** (vía `@analogjs/vite-plugin-angular` u opción experimental del CLI): más liviano que Karma, pero igual exige Angular CLI y una configuración de build no trivial.
3. **Sin Angular CLI: instanciar la clase del componente directamente y probar su estado reactivo (signals), usando solo `@angular/core` en modo JIT.**

## Decisión

Opción 3. `GreetingFormComponent` usa `inject()` como inicializador de campo (patrón recomendado por la extensión angular), lo que exige un contexto de inyección activo al construir la instancia. Se crea ese contexto manualmente con la API pública `Injector.create({ providers: [GreetingService] })` + `runInInjectionContext(...)`, sin `TestBed`. Angular resuelve la inyección en modo JIT (compilación en tiempo de ejecución), lo que exige tener cargado `@angular/compiler` — se añade como dependencia de desarrollo y se importa (`import '@angular/compiler'`) al inicio del archivo de prueba, tal como indica el propio mensaje de error de Angular cuando falta.

Esto prueba la lógica reactiva completa (signals, `computed`, inyección de dependencias) pero **no renderiza la plantilla HTML** del componente: no hay aserciones sobre el DOM. Es una prueba de lógica de componente, no una prueba de integración de UI.

## Consecuencias

- Positivas: cero dependencias de build (`angular.json`, Karma, navegador headless); las pruebas corren con el mismo `tsx --test` que el resto del ejemplo, en milisegundos.
- Negativas: no se verifica que la plantilla realmente vincule `state()` al DOM correctamente (por ejemplo, un error de sintaxis en el `@switch` del template no lo detectaría esta prueba). Un proyecto real que adopte esta extensión debe complementar esto con Testing Library sobre un build real, como documenta `extensions/angular/README.md`.
- Deuda aceptada: el `@switch`/`@case` de la plantilla queda sin cobertura automatizada en este ejemplo; documentado aquí explícitamente, no oculto.

## Migración y rollback

Si el ejemplo creciera a más de una pantalla, migrar a Angular CLI + Vitest sería la opción natural (opción 2 de arriba); no requiere deshacer nada de esta decisión, solo añadir un builder.

## Validación

`npm test` ejecuta `test/greeting-form.component.test.ts` y confirma que los signals `state`, `contentMessage` y `errorMessage` reaccionan correctamente a `onNameChange` y `setLocale`, incluida la transición a estado de error sin lanzar una excepción no controlada.
