# Módulo: greeting-artifact

Genera un archivo de texto con un saludo, usando el proveedor `local` (sin credenciales de nube). Sirve como referencia mínima de módulo con variables tipadas y validadas, siguiendo la [extensión infrastructure](../../../../extensions/infrastructure/README.md).

## Variables

| Nombre | Tipo | Obligatoria | Descripción |
|---|---|---|---|
| `name` | `string` | Sí | Nombre a saludar; validado con la misma regla de forma que los demás ejemplos del framework. |
| `locale` | `string` | No (`es`) | Idioma del saludo: `es` o `en`. |
| `output_dir` | `string` | Sí | Directorio donde se escribe `greeting.txt`. |

## Outputs

| Nombre | Descripción |
|---|---|
| `greeting` | Texto del saludo generado. |
| `file_path` | Ruta del archivo escrito. |
