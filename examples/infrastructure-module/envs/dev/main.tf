terraform {
  required_version = ">= 1.5"
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

module "saludo" {
  source     = "../../modules/greeting-artifact"
  name       = var.name
  locale     = var.locale
  output_dir = path.module
}
