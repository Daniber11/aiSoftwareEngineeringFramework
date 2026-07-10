# Extensión Infraestructura como Código

Adapta el Core a repositorios de infraestructura: Terraform/OpenTofu, contenedores y configuración de plataforma.

## 1. Arquitectura recomendada

Módulos pequeños y componibles con contratos explícitos (variables tipadas y outputs documentados), consumidos por composiciones raíz por ambiente. Estado remoto con bloqueo. Los ambientes difieren solo en variables, nunca en código duplicado.

## 2. Estructura de carpetas

```text
modules/
  red/                 # un módulo = una responsabilidad
    main.tf
    variables.tf       # tipadas, con description y validation
    outputs.tf
    README.md
envs/
  dev/
    main.tf            # composición: solo instancia módulos
    backend.tf         # estado remoto del ambiente
    terraform.tfvars
  prod/
policies/              # OPA/Sentinel si aplica
```

## 3. Convenciones

- Nombres de recursos con prefijo `proyecto-ambiente-recurso`; etiquetas obligatorias (propietario, ambiente, costo).
- Toda variable con `type`, `description` y `validation` cuando existan invariantes.
- Prohibido `terraform apply` manual contra ambientes compartidos: solo CI con plan aprobado.
- Versiones de providers y módulos fijadas (`required_version`, lockfile commiteado).
- Cambios destructivos (`destroy`/`replace` en el plan) requieren aprobación explícita y ADR si alteran arquitectura.

## 4. Herramientas de calidad

- Formato: `terraform fmt -check -recursive`.
- Validación: `terraform validate` + TFLint.
- Documentación de módulos generada con terraform-docs y verificada en CI.

## 5. Estrategia de pruebas

- Estático: fmt, validate, TFLint y políticas (OPA/conftest) como gate mínimo.
- Plan como prueba: todo PR publica el `terraform plan` del ambiente afectado para revisión.
- Integración: Terratest o `terraform test` sobre módulos críticos en cuentas efímeras.
- Smoke post-apply: verificar health de los recursos desplegados antes de promover.

## 6. Seguridad

- SAST de IaC: Checkov o tfsec como gate.
- Estado remoto cifrado y con acceso mínimo: el estado contiene secretos en claro.
- Sin credenciales estáticas en CI: OIDC hacia el proveedor de nube.
- Menor privilegio en los roles que ejecutan plan/apply (plan de solo lectura).
- Escaneo de imágenes de contenedor (Trivy) y firmas de artefactos cuando aplique.

## 7. Build y dependencias

- Artefacto = plan aprobado + código etiquetado; el apply consume exactamente ese plan (`terraform plan -out`).
- Lockfile de providers commiteado; actualizaciones de providers en PR aislados.
- Contenedores base mínimos, reconstruidos periódicamente por parches.

## 8. CI/CD

```yaml
jobs:
  framework:
    uses: ./.github/workflows/validate-framework.yml
  quality:
    uses: ./.github/workflows/quality.yml
    with:
      setup-command: curl -sLo- https://... # instalar terraform/tflint fijando versión
      format-command: terraform fmt -check -recursive
      lint-command: tflint --recursive
      static-analysis-command: terraform validate
  security:
    uses: ./.github/workflows/security.yml
    with:
      sast-command: checkov -d .
```

Flujo: PR → plan publicado → revisión y aprobación → apply en dev → smoke → promoción a prod con aprobación proporcional al riesgo. Rollback: aplicar la versión etiquetada anterior (el código es la fuente de verdad, no la consola).

## 9. Observabilidad

- La infraestructura crea la observabilidad de las cargas: alarmas, dashboards y log groups se declaran como código junto al recurso.
- Drift detection programada (`terraform plan` en cron) con alerta si el estado real divergió.
- Auditoría de cambios de plataforma (CloudTrail o equivalente) habilitada por defecto.

## 10. Comandos de desarrollo

```bash
terraform init                      # inicializar backend y providers
terraform fmt -recursive            # formatear
terraform validate && tflint        # validar
terraform plan -var-file=dev.tfvars # plan local de revisión
```

## 11. Ejemplo mínimo

```hcl
# modules/bucket/variables.tf
variable "name" {
  type        = string
  description = "Nombre del bucket, sin prefijo de ambiente."
  validation {
    condition     = can(regex("^[a-z0-9-]{3,40}$", var.name))
    error_message = "Solo minúsculas, dígitos y guiones (3-40 caracteres)."
  }
}

# modules/bucket/main.tf
resource "aws_s3_bucket" "this" {
  bucket = "${var.project}-${var.environment}-${var.name}"
  tags   = var.tags
}

# envs/dev/main.tf — composición
module "artefactos" {
  source      = "../../modules/bucket"
  project     = "demo"
  environment = "dev"
  name        = "artefactos"
  tags        = local.tags_obligatorias
}
```
