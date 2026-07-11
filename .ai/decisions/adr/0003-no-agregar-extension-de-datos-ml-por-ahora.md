# ADR-0003: No agregar una extensión de datos/ML por ahora

- Estado: Aceptado
- Fecha: 2026-07-11
- Responsables: Mantenedores del framework
- Alcance: `extensions/`, `ROADMAP.md`

## Contexto

El roadmap 1.3 dejó pendiente "decidir explícitamente si se agrega una extensión de datos/ML". La lista original de extensiones previstas (`extensions/README.md` desde la versión 1.0) nunca incluyó datos/ML — apareció como nota abierta durante la planificación de 1.2, sin que ningún adoptante real la haya pedido. Antes de escribirla, corresponde decidir si existe necesidad demostrable, tal como exige [ENGINEERING_PRINCIPLES.md](../../governance/ENGINEERING_PRINCIPLES.md) ("YAGNI: no construir extensibilidad hipotética") y `CODEX_BOOTSTRAP_PROMPT.md` ("No introduzcas tecnología, abstracciones o dependencias sin necesidad demostrable").

## Opciones consideradas

1. **Escribirla ahora, solo documental** (como las 8 extensiones originales antes de la 1.2): rompería la consistencia que el framework acaba de establecer en 1.2/1.3, donde cada extensión nueva o revisada se acompaña de un ejemplo ejecutable que la valida. No hay Python real disponible en el entorno de esta sesión (ver `.ai/context/CURRENT_CONTEXT.md`) para construir ese ejemplo, y los proyectos de datos/ML tienen preocupaciones genuinamente distintas de un backend o frontend (versionado de datos y modelos, seguimiento de experimentos, reproducibilidad de entrenamiento, calidad y *drift* de datos, separación notebook/código de producción) que una extensión superficial no cubriría con honestidad.
2. **Forzarla dentro de la extensión python existente**: técnicamente posible (Python es el runtime común), pero mezclaría dos perfiles de calidad distintos — un servicio backend y un pipeline de datos/ML no comparten la misma pirámide de pruebas ni los mismos gates (por ejemplo, "cobertura de líneas" no tiene el mismo significado en una función de entrenamiento estocástico). Forzarlo generaría una extensión confusa.
3. **No agregarla ahora; documentar la decisión y las condiciones que la reabrirían.**

## Decisión

Opción 3. El framework no incorpora una extensión de datos/ML en esta versión. `extensions/README.md` mantiene su alcance original de ocho extensiones. Esta decisión se revisa cuando se cumpla **cualquiera** de estas condiciones:

- Un proyecto real adopta el framework para trabajo de datos/ML y necesita la guía.
- Hay un entorno disponible con Python real (no el alias de Microsoft Store) para poder construir y verificar un ejemplo ejecutable, manteniendo la consistencia con el resto de `examples/`.
- Se decide relajar el requisito de "extensión nueva ⇒ ejemplo ejecutable" para casos documentales puros, mediante un ADR propio que lo justifique.

## Consecuencias

- Positivas: se evita documentación no verificada (el propio framework prohíbe "contenido ficticio" y "secciones vacías"); se mantiene la disciplina de que toda extensión nueva viene acompañada de prueba de que funciona.
- Negativas: un adoptante que trabaje en datos/ML hoy debe adaptar la extensión python o infrastructure por su cuenta, sin guía específica del framework.
- Deuda aceptada: ninguna — es una decisión de alcance, no una tarea pendiente oculta.

## Migración y rollback

No aplica: no hay estado que migrar. Reabrir esta decisión es tan simple como escribir un nuevo ADR que reemplace este cuando se cumpla alguna condición de la sección Decisión.

## Validación

`ROADMAP.md` marca este punto de 1.3 como resuelto (no como "hecho" en el sentido de "extensión creada"), enlazando este ADR como la resolución.
