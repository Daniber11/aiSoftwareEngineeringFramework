terraform {
  required_version = ">= 1.5"
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

locals {
  # Mismo dominio que los demás ejemplos del framework (minimal-service,
  # java-spring-service, dotnet-greeting-service), expresado de forma
  # declarativa: la validación de forma vive en las variables (arriba),
  # la plantilla del saludo vive aquí.
  templates = {
    es = "Hola, ${trimspace(var.name)}."
    en = "Hello, ${trimspace(var.name)}."
  }
  greeting = local.templates[var.locale]
}

resource "local_file" "greeting" {
  filename = "${var.output_dir}/greeting.txt"
  content  = local.greeting
}
