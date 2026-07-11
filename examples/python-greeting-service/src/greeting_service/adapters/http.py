"""Adaptador HTTP: FastAPI valida la forma en el borde (Query), el
dominio valida las reglas de negocio. Mismo contrato observable que los
demás ejemplos del framework, para que sean comparables.
"""

from __future__ import annotations

import json
import logging
import sys
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, Query, Request
from fastapi.responses import JSONResponse

from greeting_service.domain.greeting import GreetingError, build_greeting

VERSION = "1.0.0"

logger = logging.getLogger("greeting_service")
logger.setLevel(logging.INFO)
_handler = logging.StreamHandler(sys.stdout)
_handler.setFormatter(logging.Formatter("%(message)s"))
logger.addHandler(_handler)

app = FastAPI(title="greeting-service")


def _log(correlation_id: str, status: int) -> None:
    # Nunca registrar el nombre recibido: puede ser dato personal.
    logger.info(
        json.dumps(
            {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "level": "info",
                "service": "python-greeting-service",
                "version": VERSION,
                "correlationId": correlation_id,
                "status": status,
            }
        )
    )


@app.get("/health")
def health(request: Request):
    correlation_id = request.headers.get("x-correlation-id", str(uuid.uuid4()))
    return JSONResponse(
        content={"status": "ok", "version": VERSION},
        headers={"x-correlation-id": correlation_id},
    )


@app.get("/greet")
def greet(request: Request, name: str | None = Query(default=None), locale: str = Query(default="es")):
    correlation_id = request.headers.get("x-correlation-id", str(uuid.uuid4()))
    try:
        greeting = build_greeting(name, locale)
    except GreetingError as exc:
        _log(correlation_id, 400)
        return JSONResponse(status_code=400, content={"error": str(exc)}, headers={"x-correlation-id": correlation_id})
    _log(correlation_id, 200)
    return JSONResponse(content={"greeting": greeting}, headers={"x-correlation-id": correlation_id})
