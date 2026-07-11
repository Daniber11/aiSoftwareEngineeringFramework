# Índice de módulos

Usa este archivo para evitar explorar todo el repositorio.

| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |
|---|---|---|---|---|---|
| greeting-artifact | Módulo reutilizable: genera un archivo de saludo validado | `modules/greeting-artifact/` | Variables `name`, `locale`, `output_dir`; outputs `greeting`, `file_path` (ver su `README.md`) | `terraform validate` + `terraform plan` | Equipo del ejemplo |
| dev | Composición del ambiente de desarrollo | `envs/dev/` | Instancia `greeting-artifact` con valores por defecto | `terraform plan`/`apply`/`destroy` reales | Equipo del ejemplo |

Cada módulo debe tener una responsabilidad clara y enlaces directos a sus documentos y pruebas.
