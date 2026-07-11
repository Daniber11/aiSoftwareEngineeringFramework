variable "name" {
  type        = string
  description = "Nombre a saludar, sin prefijo de ambiente."
  validation {
    condition     = can(regex("^[\\p{L}][\\p{L}' -]{0,79}$", var.name))
    error_message = "Solo letras, espacios, apóstrofos y guiones; entre 1 y 80 caracteres."
  }
}

variable "locale" {
  type        = string
  description = "Idioma del saludo: es o en."
  default     = "es"
  validation {
    condition     = contains(["es", "en"], var.locale)
    error_message = "Idioma no soportado: se admite es, en."
  }
}

variable "output_dir" {
  type        = string
  description = "Directorio donde se escribe el artefacto de saludo generado."
}
