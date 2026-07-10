# Extensión Java / Spring Boot

Adapta el Core a servicios backend con Java 21+ y Spring Boot 3.

## 1. Arquitectura recomendada

Arquitectura hexagonal por paquete de dominio: el dominio y los casos de uso no dependen de Spring; los adaptadores (web, persistencia, mensajería) sí. Para dominios simples basta un monolito modular por paquetes; introducir módulos Maven/Gradle separados solo cuando exista más de un contexto real.

## 2. Estructura de carpetas

```text
src/main/java/com/empresa/servicio/
  dominio/            # entidades, value objects, reglas puras
  aplicacion/         # casos de uso, puertos (interfaces)
  adaptadores/
    web/              # controladores REST, DTO, mapeo de errores
    persistencia/     # repositorios JPA/JDBC, entidades de BD
  configuracion/      # beans, propiedades tipadas
src/main/resources/   # application.yaml por perfil, migraciones
src/test/java/        # espejo de main
```

## 3. Convenciones

- Constructor injection siempre; sin `@Autowired` en campos.
- Propiedades tipadas con `@ConfigurationProperties`; nada de `@Value` disperso.
- DTO de API separados de entidades de dominio y de persistencia.
- Errores de negocio como excepciones propias mapeadas en un `@ControllerAdvice` único.
- Records para value objects y DTO inmutables.

## 4. Herramientas de calidad

- Formato: Spotless con google-java-format.
- Lint/estático: Error Prone + Checkstyle; SpotBugs para bytecode.
- Cobertura: JaCoCo con umbral acordado en `FRAMEWORK.yaml` (no como fin en sí mismo).

## 5. Estrategia de pruebas

- Unitarias: JUnit 5 + AssertJ sobre dominio y casos de uso, sin contexto de Spring.
- Integración: `@SpringBootTest` acotado por slice (`@WebMvcTest`, `@DataJpaTest`) y Testcontainers para base de datos real.
- Contrato: Spring Cloud Contract o Pact cuando existan consumidores independientes.
- E2E: solo recorridos críticos, contra entorno efímero.

## 6. Seguridad

- Spring Security con autorización en servidor; método `@PreAuthorize` sobre casos de uso sensibles.
- Validación de entradas con Jakarta Validation en el borde web.
- Dependencias: OWASP Dependency-Check o `gradle dependencyCheckAnalyze` en CI.
- Secretos por variables de entorno o vault; nunca en `application.yaml` versionado.

## 7. Build y dependencias

- Gradle (Kotlin DSL) o Maven con wrapper versionado; build reproducible con versiones fijadas (locking de dependencias activado).
- Imagen de contenedor con Jib o buildpacks; usuario no root, JRE mínima.
- Migraciones de esquema con Flyway, versionadas y con rollback documentado.

## 8. CI/CD

```yaml
jobs:
  framework:
    uses: ./.github/workflows/validate-framework.yml
  quality:
    uses: ./.github/workflows/quality.yml
    with:
      format-command: ./gradlew spotlessCheck
      lint-command: ./gradlew checkstyleMain spotbugsMain
      static-analysis-command: ./gradlew compileJava -Werror
  test:
    uses: ./.github/workflows/test.yml
    with:
      unit-command: ./gradlew test
      integration-command: ./gradlew integrationTest
      coverage-path: build/reports/jacoco/
  security:
    uses: ./.github/workflows/security.yml
    with:
      dependency-audit-command: ./gradlew dependencyCheckAnalyze
```

## 9. Observabilidad

- Micrometer + Actuator: `/actuator/health` (liveness/readiness separados), métricas RED exportadas a Prometheus.
- Logs JSON con Logback encoder; correlation ID vía filtro MDC.
- Trazas con OpenTelemetry solo si hay más de un servicio en el flujo.

## 10. Comandos de desarrollo

```bash
./gradlew bootRun                 # ejecutar en local
./gradlew test integrationTest    # pruebas
./gradlew spotlessApply           # formatear
./gradlew build                   # build completo con gates
```

## 11. Ejemplo mínimo

Caso de uso puro y adaptador delgado:

```java
// aplicacion/SaludarUsuario.java — sin dependencias de Spring
public class SaludarUsuario {
  public String ejecutar(String nombre) {
    if (nombre == null || nombre.isBlank()) {
      throw new NombreInvalidoException("El nombre es obligatorio.");
    }
    return "Hola, " + nombre.strip() + ".";
  }
}

// adaptadores/web/SaludoController.java
@RestController
class SaludoController {
  private final SaludarUsuario saludar;
  SaludoController(SaludarUsuario saludar) { this.saludar = saludar; }

  @GetMapping("/greet")
  Map<String, String> greet(@RequestParam @NotBlank String name) {
    return Map.of("greeting", saludar.ejecutar(name));
  }
}
```
