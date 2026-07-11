# Política de decisiones — dotnet-greeting-service

Aplica la política general del framework. Específico de este ejemplo:

## Puede ejecutar sin aprobación
- Correcciones de bugs con prueba de regresión.
- Mejoras de documentación y de mensajes de error.
- Nuevos casos de prueba.

## Debe proponer antes de ejecutar
- Añadir dependencias de producción nuevas.
- Cambiar el contrato HTTP de forma incompatible con `minimal-service`.
- Anidar `test/` dentro de `src/` (reintroduciría el conflicto de glob del ADR-0001).
- Añadir persistencia, autenticación u otro alcance excluido en `PROJECT.md`.

Toda decisión estructural se registra como ADR en `.ai/decisions/adr/`.
