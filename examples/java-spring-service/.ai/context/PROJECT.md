# Identidad del proyecto

## Propósito
Servicio de saludo con Spring Boot 3: adopción de referencia de la [extensión java-spring](../../../../extensions/java-spring/README.md), con arquitectura hexagonal mínima (dominio puro + controlador REST) y Gradle Wrapper autocontenido.

## Alcance
Incluido: dominio puro con validación de negocio, controlador REST con `/health` y `/greet`, pruebas unitarias (JUnit 5 + AssertJ) y de integración real (`@SpringBootTest` con puerto efímero). Excluido: persistencia, autenticación, contenedor Docker, CI propio más allá del gate del framework.

## Usuarios y actores
- Equipos que adoptan la extensión java-spring: lo usan como referencia de estructura y del patrón dominio/adaptador en Java.
- CI del framework: ejecuta `./gradlew test` como gate.

## Restricciones
- JDK 17 (fijado también en `build.gradle` vía toolchain).
- Gradle Wrapper 8.10.2 commiteado; nunca depender de un Gradle instalado globalmente (ver ADR-0001).
- Debe pasar los validadores del framework con `--root`.

## Criterios de éxito
- `./gradlew test` pasa en local y CI (15 pruebas: 11 de dominio, 4 de integración HTTP).
- `quality-gates.mjs --root . --skip-commands` sin errores.
- El contrato HTTP es idéntico en forma al de `minimal-service` y `typescript-node-service`.

## Estado
Mantenimiento.
