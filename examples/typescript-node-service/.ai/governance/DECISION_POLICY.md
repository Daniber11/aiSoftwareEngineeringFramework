# Política de decisiones — typescript-node-service

Aplica la política general del framework. Específico de este ejemplo:

## Puede ejecutar sin aprobación

- Correcciones de bugs con prueba de regresión.
- Mejoras de documentación y de mensajes de error.
- Nuevos casos de prueba.

## Debe proponer antes de ejecutar

- Añadir dependencias de producción nuevas (cada una amplía la superficie auditada).
- Cambiar el contrato HTTP de forma incompatible con `minimal-service`.
- Añadir ESLint u otra herramienta de lint (decisión pendiente, documentada en `PROJECT.md`).
- Añadir persistencia, autenticación u otro alcance excluido en `PROJECT.md`.

Toda decisión estructural se registra como ADR en `.ai/decisions/adr/`.
