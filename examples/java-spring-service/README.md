# java-spring-service

Servicio de saludo con Spring Boot 3 que adopta la [extensión java-spring](../../extensions/java-spring/README.md) del framework: dominio puro, controlador REST delgado, y Gradle Wrapper autocontenido para que el build sea reproducible sin instalar Gradle globalmente.

## Qué incluye

- [FRAMEWORK.yaml](FRAMEWORK.yaml) lleno.
- Contexto de IA completo en `.ai/context/`.
- Una decisión registrada: [ADR-0001](.ai/decisions/adr/0001-gradle-wrapper-autocontenido.md) — por qué el wrapper de Gradle, no una instalación global.
- Dominio puro en Java: [Greeting.java](src/main/java/com/framework/example/domain/Greeting.java).
- Controlador REST con health check y logs JSON: [GreetingController.java](src/main/java/com/framework/example/web/GreetingController.java).
- 15 pruebas: 11 unitarias de dominio (JUnit 5 + AssertJ) y 4 de integración HTTP real (`@SpringBootTest`, puerto efímero).

## Comandos

```bash
./gradlew test --console=plain    # todas las pruebas (Windows: gradlew.bat)
./gradlew bootRun                 # ejecutar el servicio (puerto 8080)
```

La primera ejecución de `./gradlew` descarga la distribución de Gradle (~130 MB, una sola vez, cacheada) y las dependencias de Spring desde Maven Central — igual en espíritu a `npm install`, solo que Java no tiene un gestor de paquetes separado del build tool.

## Endpoints

Mismo contrato que `minimal-service` y `typescript-node-service`:

| Método y ruta | Respuesta |
|---|---|
| `GET /health` | `200 {"status":"ok","version":"1.0.0"}` |
| `GET /greet?name=Ada&locale=en` | `200 {"greeting":"Hello, Ada."}` |
| `GET /greet` sin `name` válido | `400 {"error":"..."}` |
