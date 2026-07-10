# Estándar CI/CD

El pipeline recomendado contiene:

1. Validación de estructura y documentación.
2. Formato y lint.
3. Análisis estático.
4. Pruebas unitarias.
5. Pruebas de integración.
6. Construcción de artefactos.
7. SBOM y escaneos.
8. Pruebas E2E o de contrato según riesgo.
9. Publicación inmutable.
10. Despliegue por ambiente con aprobación proporcional al riesgo.
11. Smoke tests.
12. Rollback automatizable.

Los jobs deben ser paralelos cuando sea seguro, cachear dependencias de forma confiable y cancelar ejecuciones obsoletas.
