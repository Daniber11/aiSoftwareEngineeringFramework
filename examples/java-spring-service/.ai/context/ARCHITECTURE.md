# Arquitectura

## Estilo seleccionado
Hexagonal mínima: dominio puro (`domain/`) sin dependencias de Spring, adaptador REST (`web/`) delgado. Un solo módulo Gradle: no hay más de un contexto delimitado que justifique módulos separados.

## Límites
- `src/main/java/.../domain/` — `Greeting` (reglas), `GreetingException` (error de negocio).
- `src/main/java/.../web/` — `GreetingController`, adaptador HTTP con logging JSON.
- `src/main/java/.../Application.java` — composición y arranque de Spring Boot.
- `src/test/java/` — espejo de `main`: pruebas de dominio (JUnit + AssertJ) y de integración (`@SpringBootTest`).

## Flujo de dependencias
`GreetingController → Greeting`. El dominio no conoce Spring; el controlador no reimplementa reglas de negocio.

## Contratos
API HTTP idéntica en forma a `examples/minimal-service`: `GET /health` y `GET /greet?name&locale`. Mismos mensajes de error que los demás ejemplos del framework.

## Datos
Sin persistencia. No se registra el nombre recibido en logs.

## Atributos de calidad
- Seguridad: validación de entrada en el controlador antes de tocar el dominio; sin SQL ni deserialización de datos externos.
- Reproducibilidad de build: Gradle Wrapper fija la versión exacta de Gradle (ver ADR-0001); `toolchain` fija JDK 17.
- Observabilidad: logs estructurados JSON con correlation ID, igual que los demás ejemplos.

## Diagramas
Innecesarios a este tamaño; el flujo de dependencias de arriba es el diagrama.

## Decisiones relacionadas
- [ADR-0001: Gradle Wrapper autocontenido, sin Gradle global](../decisions/adr/0001-gradle-wrapper-autocontenido.md)
