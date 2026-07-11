# ADR-0001: src/ y test/ como proyectos hermanos; SDK de .NET instalado localmente

- Estado: Aceptado
- Fecha: 2026-07-10
- Responsables: Equipo del ejemplo
- Alcance: estructura de directorios, instalación del SDK

## Contexto

El entorno donde se construyó este ejemplo no tenía SDK de .NET instalado (solo el *muxer* `dotnet.exe` sin ningún SDK resuelto). Además, el primer intento de estructura puso `GreetingService.csproj` y `Program.cs` en la raíz del proyecto, con `test/` como subcarpeta — el build falló porque un `.csproj` de SDK style (`Microsoft.NET.Sdk.Web`) incluye implícitamente todos los `.cs` bajo su propio árbol de directorios, así que el proyecto principal intentó compilar también los archivos de prueba sin tener referenciado xUnit.

## Opciones consideradas

**Sobre la instalación del SDK:**
1. Instalar el SDK a nivel de sistema (requiere privilegios de administrador y modifica el PATH global): más invasivo de lo necesario para un ejemplo de referencia.
2. Instalar el SDK en una carpeta local del usuario con el script oficial de Microsoft (`dotnet-install.ps1 -InstallDir <carpeta> -NoPath`): xcopy-deployable, no requiere administrador, no modifica el PATH del sistema. Es el mecanismo que Microsoft documenta explícitamente para CI y entornos aislados.

**Sobre la estructura de directorios:**
1. `test/` anidado dentro de la carpeta del proyecto principal: falla, como se describe arriba, porque el glob implícito de `Microsoft.NET.Sdk.Web` no se puede acotar sin añadir exclusiones manuales (`<Compile Remove="test/**/*.cs" />`), una solución frágil que hay que recordar mantener.
2. `src/` y `test/` como carpetas hermanas, cada una con su propio `.csproj`: es el layout estándar de cualquier solución .NET real; cada proyecto solo ve su propio árbol, sin necesidad de exclusiones manuales.

## Decisión

Se instaló el SDK de .NET 8 (LTS) en `~/.dotnet-fw-example` con `dotnet-install.ps1 -Channel 8.0 -NoPath`, sin tocar el PATH del sistema ni requerir privilegios elevados. La estructura del proyecto se organizó como `src/GreetingService.csproj` + `test/GreetingService.Tests.csproj`, hermanos, con `test/*.csproj` referenciando `../src/GreetingService.csproj` vía `<ProjectReference>`.

## Consecuencias

- Positivas: instalación reversible (borrar la carpeta `~/.dotnet-fw-example` la deshace por completo); estructura de proyecto sin exclusiones manuales frágiles; `dotnet test` desde `test/` nunca arrastra accidentalmente el código de producción como si fuera parte del proyecto de pruebas, ni viceversa.
- Negativas: quien clona el repositorio debe tener el SDK de .NET en el PATH (o pasar `--project` explícito) — no hay wrapper autocontenido como en `java-spring-service`, porque .NET no tiene un mecanismo equivalente al Gradle Wrapper de uso tan extendido.
- Deuda aceptada: ninguna nueva.

## Migración y rollback

Rollback de la instalación: borrar `~/.dotnet-fw-example` (o el path elegido). La estructura `src/`+`test/` no requiere migración si se sigue desde el inicio de cualquier ejemplo .NET nuevo del framework.

## Validación

`dotnet test test/GreetingService.Tests.csproj` reporta 15 pruebas correctas (0 con error) usando exclusivamente el SDK instalado localmente, sin ningún SDK de .NET preexistente en el sistema. Verificado además con un smoke test manual: `dotnet run --project src/GreetingService.csproj` seguido de peticiones HTTP reales a `/health` y `/greet`.
