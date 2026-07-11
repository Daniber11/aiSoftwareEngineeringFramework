# Política de decisiones — angular-greeting-app

Aplica la política general del framework. Específico de este ejemplo:

## Puede ejecutar sin aprobación

- Correcciones de bugs con prueba de regresión.
- Mejoras de documentación y de mensajes de error.
- Nuevos casos de prueba.

## Debe proponer antes de ejecutar

- Introducir Angular CLI, `angular.json` o un empaquetador (cambiaría el alcance cero-build documentado en `PROJECT.md`).
- Añadir enrutamiento, HTTP real o `NgModule`.
- Bajar la versión de `@angular/core` por debajo de 19.2.26 (reintroduciría vulnerabilidades conocidas).
- Añadir `TestBed` u otro mecanismo de pruebas que reemplace el patrón del ADR-0001.

Toda decisión estructural se registra como ADR en `.ai/decisions/adr/`.
