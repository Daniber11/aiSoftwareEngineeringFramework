# Extensiones

Las extensiones adaptan el Core a un stack concreto sin modificar sus principios: el Core define **qué** debe cumplirse (gates, gobernanza, contexto, seguridad, observabilidad); cada extensión define **cómo** se cumple con las herramientas de su ecosistema.

## Extensiones disponibles

| Extensión | Stack objetivo |
|---|---|
| [java-spring](java-spring/README.md) | Servicios backend con Java 21+ y Spring Boot 3 |
| [typescript-node](typescript-node/README.md) | Servicios backend con TypeScript y Node.js |
| [python](python/README.md) | Servicios y herramientas con Python 3.12+ |
| [dotnet](dotnet/README.md) | Servicios backend con .NET 8+ |
| [react](react/README.md) | Frontend SPA con React |
| [angular](angular/README.md) | Frontend empresarial con Angular |
| [mobile](mobile/README.md) | Aplicaciones móviles (nativas y multiplataforma) |
| [infrastructure](infrastructure/README.md) | Infraestructura como código (Terraform/OpenTofu, contenedores) |

## Contrato de toda extensión

Cada extensión cubre estas once secciones, en este orden:

1. Arquitectura recomendada.
2. Estructura de carpetas.
3. Convenciones.
4. Herramientas de calidad.
5. Estrategia de pruebas.
6. Seguridad.
7. Build y dependencias.
8. CI/CD.
9. Observabilidad.
10. Comandos de desarrollo.
11. Ejemplo mínimo.

## Reglas

- Una extensión nunca relaja un gate del Core; solo lo instrumenta. Si un gate no aplica (p. ej. E2E en una librería), se marca `risk_based` u `optional` en `FRAMEWORK.yaml` del proyecto, no en la extensión.
- Las versiones de herramientas son recomendaciones de partida; el proyecto las fija en su propio manifiesto de dependencias.
- La sección CI/CD de cada extensión mapea sus comandos a los [workflows reutilizables](../.github/workflows/README.md) del framework.
- Añadir una extensión nueva no requiere tocar el Core: crear el directorio, cubrir las once secciones y enlazarla en la tabla de arriba.
