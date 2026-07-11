output "greeting" {
  description = "Texto del saludo generado."
  value       = local.greeting
}

output "file_path" {
  description = "Ruta del archivo generado."
  value       = local_file.greeting.filename
}
