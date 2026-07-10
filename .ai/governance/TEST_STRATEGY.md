# Estrategia de pruebas

## Pirámide

- Muchas pruebas unitarias rápidas para reglas y componentes.
- Pruebas de integración para límites reales: base de datos, colas, filesystem, APIs.
- Pruebas de contrato para integraciones versionadas.
- Pocas pruebas E2E, enfocadas en recorridos críticos.
- Pruebas de rendimiento y seguridad basadas en riesgo.

## Reglas

- Evitar mocks de detalles internos.
- Preferir pruebas deterministas.
- Controlar reloj, aleatoriedad y concurrencia.
- Mantener datos de prueba mínimos.
- No depender de orden de ejecución.
- Definir estrategia de cuarentena y corrección para pruebas inestables.
- Verificar comportamiento y contratos, no implementación accidental.
