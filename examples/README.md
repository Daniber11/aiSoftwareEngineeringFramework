# Ejemplos

Adopciones de referencia del framework, completas y validables de punta a punta.

| Ejemplo | Qué demuestra |
|---|---|
| [minimal-service](minimal-service/README.md) | La adopción mínima real: manifiesto lleno, contexto activo, índice de módulos, un ADR, dominio puro con validación de entradas, servidor HTTP con health check, logs estructurados con correlation ID y pruebas unitarias y de integración con `node:test`. |

Cada ejemplo debe pasar los validadores del framework:

```bash
node scripts/quality-gates.mjs --root examples/minimal-service --skip-commands
node --test "examples/minimal-service/test/**/*.test.mjs"
```

Los ejemplos usan Node.js solo porque es el runtime ya exigido por el tooling (ADR-0001); la estructura documental que demuestran es idéntica para cualquier stack.
