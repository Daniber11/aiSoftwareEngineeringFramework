# infrastructure-module

Módulo de Terraform que adopta la [extensión infrastructure](../../extensions/infrastructure/README.md) del framework: variables tipadas y validadas, outputs documentados, composición por ambiente — verificable de punta a punta sin ninguna cuenta de nube.

## Qué incluye

- [FRAMEWORK.yaml](FRAMEWORK.yaml) lleno.
- Contexto de IA completo en `.ai/context/`.
- Una decisión registrada: [ADR-0001](.ai/decisions/adr/0001-proveedor-local-sin-nube.md) — por qué el proveedor `local` en vez de AWS/GCP/Azure.
- Módulo reutilizable: [modules/greeting-artifact/](modules/greeting-artifact/README.md).
- Composición del ambiente de desarrollo: [envs/dev/](envs/dev/).

## Comandos

```bash
terraform fmt -check -recursive -diff        # formato
terraform -chdir=envs/dev init               # descarga el proveedor local (real, sin credenciales)
terraform -chdir=envs/dev validate           # validación estática
terraform -chdir=envs/dev plan               # plan real
terraform -chdir=envs/dev apply              # aplica de verdad: crea envs/dev/greeting.txt
terraform -chdir=envs/dev destroy            # revierte
```

## Verificación de la validación de variables

```bash
terraform -chdir=envs/dev plan -var 'name=<script>'
# Error: Invalid value for variable — "Solo letras, espacios, apóstrofos y guiones; entre 1 y 80 caracteres."
```

Terraform rechaza la entrada inválida antes de tocar ningún recurso, igual que el dominio de saludo en los demás ejemplos del framework.
