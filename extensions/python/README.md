# Extensión Python

Adapta el Core a servicios y herramientas con Python 3.12+.

## 1. Arquitectura recomendada

Monolito modular con capas explícitas: dominio puro (dataclasses/funciones), casos de uso, y adaptadores (FastAPI para HTTP, SQLAlchemy para persistencia). El dominio no importa frameworks. DDD táctico solo si el dominio lo justifica por ADR.

## 2. Estructura de carpetas

```text
src/servicio/
  domain/            # entidades, reglas puras, excepciones de negocio
  application/       # casos de uso, puertos (Protocol)
  adapters/
    http/            # routers FastAPI, esquemas Pydantic, errores
    persistence/     # repositorios concretos
  config.py          # settings tipadas (pydantic-settings), fail fast
tests/
  unit/
  integration/
pyproject.toml
```

## 3. Convenciones

- Type hints obligatorios en todo código nuevo; `mypy --strict` (o pyright) como gate.
- Pydantic solo en los bordes; el dominio usa dataclasses/tipos propios.
- Excepciones de negocio propias, mapeadas a HTTP en un exception handler único.
- Configuración solo por variables de entorno validadas al arranque.
- Layout `src/` para evitar imports accidentales del directorio de trabajo.

## 4. Herramientas de calidad

- Formato y lint: Ruff (`ruff format --check`, `ruff check`).
- Tipado estático: mypy en modo estricto.
- Cobertura: `pytest --cov` con umbral acordado en el proyecto.

## 5. Estrategia de pruebas

- Unitarias: pytest sobre dominio y casos de uso; fixtures mínimas, sin mocks de detalles internos.
- Integración: adaptadores contra dependencias reales (Testcontainers, `httpx.ASGITransport` para la app).
- Contrato: Pact o schemathesis (a partir de OpenAPI) cuando existan consumidores independientes.
- Determinismo: congelar reloj y semillas (`freezegun`, `random.seed`) en pruebas sensibles.

## 6. Seguridad

- `pip-audit` como gate de dependencias; Bandit como SAST.
- Validación estricta de entradas con Pydantic en el borde; nunca `eval`/`pickle` sobre datos externos.
- Secretos por variables de entorno o gestor de secretos; `detect-secrets`/Gitleaks en CI.
- Consultas parametrizadas siempre; ORM sin SQL crudo interpolado.

## 7. Build y dependencias

- `pyproject.toml` + lockfile (uv o pip-tools); instalación reproducible con `uv sync --frozen`.
- Artefacto: wheel versionado o imagen de contenedor multi-stage con usuario no root.
- Migraciones con Alembic, versionadas y reversibles.

## 8. CI/CD

```yaml
jobs:
  framework:
    uses: ./.github/workflows/validate-framework.yml
  quality:
    uses: ./.github/workflows/quality.yml
    with:
      setup-command: pip install uv && uv sync --frozen
      format-command: uv run ruff format --check .
      lint-command: uv run ruff check .
      static-analysis-command: uv run mypy src
  test:
    uses: ./.github/workflows/test.yml
    with:
      setup-command: pip install uv && uv sync --frozen
      unit-command: uv run pytest tests/unit
      integration-command: uv run pytest tests/integration
      coverage-path: htmlcov/
  security:
    uses: ./.github/workflows/security.yml
    with:
      setup-command: pip install uv && uv sync --frozen
      sast-command: uv run bandit -r src
      dependency-audit-command: uv run pip-audit
```

## 9. Observabilidad

- Logs JSON con `structlog`; correlation ID por request vía middleware y `contextvars`.
- Métricas RED con `prometheus-client`; `/health` y `/ready` separados.
- OpenTelemetry para trazas en flujos distribuidos.

## 10. Comandos de desarrollo

```bash
uv run fastapi dev src/servicio/adapters/http/app.py   # servidor local
uv run pytest                                          # todas las pruebas
uv run ruff format . && uv run ruff check --fix .      # formato y lint
uv run mypy src                                        # tipado
```

## 11. Ejemplo mínimo

```python
# src/servicio/domain/greeting.py — puro
class GreetingError(Exception):
    pass

def build_greeting(name: str) -> str:
    trimmed = name.strip()
    if not trimmed:
        raise GreetingError("El nombre es obligatorio.")
    if len(trimmed) > 80:
        raise GreetingError("Nombre demasiado largo.")
    return f"Hola, {trimmed}."

# src/servicio/adapters/http/app.py — borde
from fastapi import FastAPI, HTTPException, Query

app = FastAPI()

@app.get("/greet")
def greet(name: str = Query(min_length=1, max_length=80)) -> dict[str, str]:
    try:
        return {"greeting": build_greeting(name)}
    except GreetingError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

El [ejemplo python-greeting-service](../../examples/python-greeting-service/README.md) implementa este mismo patrón de forma ejecutable y probada — ver su ADR-0001 sobre cómo se instaló Python real sin instalador del sistema.
