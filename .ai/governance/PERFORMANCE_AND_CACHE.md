# Rendimiento y caché

Antes de optimizar:

1. Define presupuesto de rendimiento.
2. Mide la línea base.
3. Identifica el cuello de botella.
4. Implementa el cambio más pequeño.
5. Compara resultados.
6. Vigila regresiones.

Antes de introducir caché, documenta:

- Dato cacheado.
- Clave y granularidad.
- TTL.
- Estrategia de invalidación.
- Consistencia aceptable.
- Comportamiento ante fallo.
- Límites de memoria.
- Riesgo de stampede.
- Métricas de hit ratio y latencia.
