# ADR-0001: Python embebido sin instalador del sistema

- Estado: Aceptado
- Fecha: 2026-07-11
- Responsables: Equipo del ejemplo
- Alcance: instalación del intérprete, `pyproject.toml` (`pythonpath` en vez de instalación editable)

## Contexto

El entorno donde se construyó este ejemplo solo tenía el alias falso de Python de Microsoft Store (ver memoria del proyecto: "Python no existe en esta máquina"). El primer intento de instalar Python real usó el instalador oficial `.exe` en modo silencioso (`/quiet InstallAllUsers=0`), replicando el patrón que ya había funcionado para el SDK de .NET (ADR-0001 de `dotnet-greeting-service`). Falló dos veces con el mismo error (`0x80070003`, "Failed to install MSI package") en dos rutas de destino distintas — el subsistema de Windows Installer (MSI) parece restringido en este entorno, no es un problema de configuración puntual.

## Opciones consideradas

1. **Reintentar el instalador MSI con más variantes** (otros parámetros, reparar el `.exe` descargado): dos fallos con la misma firma de error en condiciones distintas apuntan a una restricción del entorno, no a un parámetro incorrecto — insistir tenía bajo valor esperado.
2. **Distribución embebida de Python** (`python-3.12.7-embed-amd64.zip`): un zip xcopy-deployable oficial de python.org, sin instalador, sin MSI, sin necesidad de privilegios. No incluye `pip` ni `site-packages` habilitado por defecto — hay que activarlos a mano.

## Decisión

Opción 2. Se extrajo el zip embebido a `~/.python-fw-example`, se habilitó `import site` en `python312._pth` (necesario para que `site-packages` funcione), y se instaló `pip` con el script oficial `get-pip.py`. A partir de ahí, `pip install` funciona con normalidad.

Con `pip` funcionando pero sin `setuptools` preinstalado, `pip install -e .` (modo editable) falla (`BackendUnavailable: Cannot import 'setuptools.build_meta'`). En vez de instalar `setuptools` solo para eso, se usa `[tool.pytest.ini_options] pythonpath = ["src"]` en `pyproject.toml`: pytest resuelve el paquete sin necesitar que esté instalado. Para ejecutar el servidor real (`uvicorn`), se fija `--working-directory src` (Python añade el directorio de trabajo a `sys.path` automáticamente al ejecutar `-m`).

## Consecuencias

- Positivas: instalación reversible (borrar `~/.python-fw-example` la deshace por completo); no depende de que el subsistema MSI funcione; mismo patrón de "runtime local al usuario, no al sistema" que ya se usó para .NET.
- Negativas: quien clone este ejemplo y quiera instalar el paquete en modo editable (por ejemplo, para exponer un `console_script`) necesitará instalar `setuptools` primero — no es el flujo por defecto documentado aquí.
- Deuda aceptada: ninguna nueva; es una limitación conocida de la distribución embebida, no del framework.

## Migración y rollback

Rollback de la instalación: borrar `~/.python-fw-example`. Si un proyecto real necesita un entorno Python completo (con `venv`, `setuptools`, etc.), la extensión python documenta `uv` como gestor recomendado — este ejemplo usa el camino más simple posible dado lo que había disponible, no el recomendado para producción.

## Validación

`python -m pytest -v` reporta 17 pruebas correctas usando exclusivamente el Python embebido, sin ningún Python del sistema. Verificado además con un smoke test manual: `uvicorn` levantando el servicio real y respondiendo a `/health` y `/greet` sobre HTTP.
