# Contexto activo

Mantén este archivo breve. Debe permitir reanudar trabajo sin releer el repositorio.

## Objetivo actual
Mantener el ejemplo como adopción de referencia de la extensión java-spring, sincronizado con la especificación 1.2.0.

## Estado
Estable. Dominio, controlador y pruebas completos y en verde (15 pruebas: 11 de dominio, 4 de integración HTTP real con `@SpringBootTest`). Smoke test manual con `bootRun` confirmó `/health` y `/greet` respondiendo.

## Decisiones vigentes relevantes
- ADR-0001: Gradle Wrapper autocontenido y commiteado; nunca depender de un Gradle instalado globalmente.

## Archivos o módulos en alcance
- `src/main/java/com/framework/example/domain/`
- `src/main/java/com/framework/example/web/`
- `src/test/java/`

## Riesgos y bloqueos
- Ninguno registrado.

## Próxima acción verificable
Ejecutar `./gradlew test --console=plain` tras cualquier cambio; debe terminar en `BUILD SUCCESSFUL`.
