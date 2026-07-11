# Política de decisiones — java-spring-service

Aplica la política general del framework. Específico de este ejemplo:

## Puede ejecutar sin aprobación
- Correcciones de bugs con prueba de regresión.
- Mejoras de documentación y de mensajes de error.
- Nuevos casos de prueba.

## Debe proponer antes de ejecutar
- Añadir dependencias de producción nuevas (más allá de `spring-boot-starter-web`).
- Cambiar el contrato HTTP de forma incompatible con `minimal-service`.
- Actualizar la versión de Gradle del wrapper (requiere regenerar `gradle-wrapper.jar`/`.properties` y volver a verificar el build completo).
- Añadir persistencia, autenticación u otro alcance excluido en `PROJECT.md`.

Toda decisión estructural se registra como ADR en `.ai/decisions/adr/`.
