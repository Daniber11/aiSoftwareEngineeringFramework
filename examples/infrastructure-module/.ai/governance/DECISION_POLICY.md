# Política de decisiones — infrastructure-module

Aplica la política general del framework. Específico de este ejemplo:

## Puede ejecutar sin aprobación
- Correcciones de formato y documentación.
- Nuevas variables con su `validation` correspondiente.

## Debe proponer antes de ejecutar
- Cambiar el proveedor `local` por uno de nube real (reintroduciría la necesidad de credenciales, rompiendo la verificabilidad del ejemplo — ver ADR-0001).
- Añadir un backend remoto de estado.
- Añadir un segundo ambiente (`envs/prod/`) sin una razón real que lo justifique.

Toda decisión estructural se registra como ADR en `.ai/decisions/adr/`.
