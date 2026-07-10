# Identidad del proyecto

## Propósito
Servicio HTTP de saludo usado como adopción de referencia del AI Software Engineering Framework: demuestra la estructura documental, de calidad y de observabilidad mínima que todo proyecto debe tener antes de su primera funcionalidad real.

## Alcance
Incluido: endpoint de saludo con localización es/en, health check, logs estructurados, pruebas unitarias y de integración. Excluido explícitamente: persistencia, autenticación, despliegue productivo y cualquier dependencia externa.

## Usuarios y actores
- Equipos que adoptan el framework: leen este ejemplo como referencia (solo lectura).
- Asistentes de IA: lo usan como patrón de estructura esperada.
- CI del framework: ejecuta sus pruebas como gate.

## Restricciones
- Node.js ≥ 18, sin dependencias externas (coherente con ADR-0001 del framework).
- Debe pasar los validadores del framework con `--root`.
- Debe permanecer pequeño: si deja de leerse en una sesión corta, pierde su propósito.

## Criterios de éxito
- `node --test "test/**/*.test.mjs"` pasa en local y CI.
- `quality-gates.mjs --root . --skip-commands` sin errores.
- Un lector entiende la adopción completa en menos de 15 minutos.

## Estado
Mantenimiento.
