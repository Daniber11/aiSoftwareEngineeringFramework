# ADR-0001: Gradle Wrapper autocontenido, sin Gradle global

- Estado: Aceptado
- Fecha: 2026-07-10
- Responsables: Equipo del ejemplo
- Alcance: `gradlew`, `gradlew.bat`, `gradle/wrapper/`

## Contexto

El entorno donde se construyó este ejemplo tenía JDK 17 instalado pero ningún Gradle ni Maven. Los demás ejemplos ejecutables del framework (`typescript-node-service`, `angular-greeting-app`, `react-greeting-app`) resuelven su toolchain con `npm install` contra un lockfile commiteado — determinista y sin instalación global. Java necesitaba el equivalente: una forma de construir y probar el proyecto sin depender de que quien lo clone tenga Gradle preinstalado con la versión correcta.

## Opciones consideradas

1. **Exigir Gradle o Maven instalado globalmente**: rompe la reproducibilidad — la versión de Gradle/Maven de quien clona el repo puede no coincidir con la usada al escribirlo, y el framework no puede exigir una instalación previa sin romper su propio principio de "instalación cero" que ya aplica a `scripts/` (ADR-0001 del framework).
2. **Gradle Wrapper (`gradlew`/`gradlew.bat` + `gradle-wrapper.jar` commiteados)**: es el mecanismo oficial de Gradle para exactamente este problema. El wrapper (un `.jar` de ~44 KB) descarga automáticamente la distribución completa de Gradle (~130 MB) la primera vez que se ejecuta, la cachea en `~/.gradle/wrapper/dists`, y todas las ejecuciones posteriores la reutilizan. Es el equivalente de Java a lo que `package-lock.json` + `npm ci` son para los ejemplos de Node.

## Decisión

Opción 2. Se generó el wrapper apuntando a Gradle 8.10.2 (LTS-compatible con JDK 17 y Spring Boot 3.3.x) con un Gradle temporal descargado solo para ese propósito (no commiteado, no instalado en el sistema). Los cuatro archivos resultantes (`gradlew`, `gradlew.bat`, `gradle/wrapper/gradle-wrapper.jar`, `gradle/wrapper/gradle-wrapper.properties`) sí se commitean, como es estándar en cualquier proyecto Gradle real.

`.ai/AGENTS.md` de este ejemplo instruye usar siempre `./gradlew`, nunca un `gradle` del PATH: así se garantiza la misma versión de build para cualquiera que clone el repositorio, sin pedirle que instale nada más allá del JDK.

## Consecuencias

- Positivas: `git clone` + `./gradlew test` es suficiente para construir y probar, sin pasos de instalación manual; la versión de Gradle queda fijada y auditable en `gradle-wrapper.properties`.
- Negativas: la primera ejecución de `./gradlew` en una máquina nueva descarga ~130 MB; ejecuciones posteriores son rápidas por el caché.
- Deuda aceptada: ninguna. Es el patrón estándar de la comunidad Java, no una solución ad hoc del framework.

## Migración y rollback

Actualizar la versión de Gradle es un cambio de una línea en `gradle-wrapper.properties` (`distributionUrl`), seguido de `./gradlew wrapper --gradle-version <nueva>` para regenerar el `.jar`; requiere reverificar el build completo antes de commitear.

## Validación

`./gradlew test --console=plain` termina en `BUILD SUCCESSFUL` con 15 pruebas (11 de dominio, 4 de integración HTTP), ejecutado en una máquina limpia (sin Gradle preinstalado, solo JDK 17) como prueba de que el wrapper resuelve el toolchain por sí solo.
