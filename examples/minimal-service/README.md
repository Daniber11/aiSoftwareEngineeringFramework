# minimal-service

Servicio de saludo mínimo que adopta el AI Software Engineering Framework. Sirve como referencia de la estructura que todo proyecto adoptante debe tener antes de escribir su primera funcionalidad.

## Qué incluye

- [FRAMEWORK.yaml](FRAMEWORK.yaml) lleno (sin placeholders, `status: active`).
- Contexto de IA completo: [PROJECT.md](.ai/context/PROJECT.md), [ARCHITECTURE.md](.ai/context/ARCHITECTURE.md), [MODULES.md](.ai/context/MODULES.md), [CURRENT_CONTEXT.md](.ai/context/CURRENT_CONTEXT.md).
- Una decisión registrada: [ADR-0001](.ai/decisions/adr/0001-monolito-modular-sin-dependencias.md).
- Dominio puro con validación de entradas en el límite de confianza: [src/domain/greeting.mjs](src/domain/greeting.mjs).
- Adaptador HTTP con `/health`, logs estructurados JSON y correlation ID: [src/server.mjs](src/server.mjs).
- Pruebas unitarias y de integración: [test/](test/).

## Comandos

```bash
# Pruebas (unitarias + integración HTTP)
node --test "test/**/*.test.mjs"

# Ejecutar el servicio
node src/server.mjs            # PORT=3000 por defecto

# Validar la adopción del framework (desde la raíz del repositorio del framework)
node ../../scripts/quality-gates.mjs --root . --skip-commands
```

## Endpoints

| Método y ruta | Respuesta |
|---|---|
| `GET /health` | `200 {"status":"ok","version":"1.0.0"}` |
| `GET /greet?name=Ada&locale=es` | `200 {"greeting":"Hola, Ada."}` |
| `GET /greet` sin `name` válido | `400 {"error":"..."}` sin filtrar detalles internos |
