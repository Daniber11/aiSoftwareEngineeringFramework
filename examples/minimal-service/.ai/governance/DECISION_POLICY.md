# Política de decisiones — minimal-service

Aplica la política general del framework. Específico de este ejemplo:

## Puede ejecutar sin aprobación
- Correcciones de bugs con prueba de regresión.
- Mejoras de documentación y de mensajes de error.
- Nuevos casos de prueba.

## Debe proponer antes de ejecutar
- Añadir cualquier dependencia externa (rompería el ADR-0001).
- Cambiar el contrato HTTP de forma incompatible.
- Añadir persistencia, autenticación u otro alcance excluido en PROJECT.md.
- Crecer el ejemplo más allá de lo legible en una sesión corta.

Toda decisión estructural se registra como ADR en `.ai/decisions/adr/`.
