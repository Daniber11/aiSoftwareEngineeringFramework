# ADR-0004: Perfiles de configuración por ambiente

- Estado: Aceptado
- Fecha: 2026-07-11
- Responsables: Mantenedores del framework
- Alcance: `FRAMEWORK.yaml` (nueva sección `profiles`), `scripts/lib/core.mjs`, `scripts/validate-manifest.mjs`, `scripts/quality-gates.mjs`, `scripts/resolve-profile.mjs`

## Contexto

`FRAMEWORK.yaml` declara un único conjunto de `quality_gates`, `ai` y `commands`, válido para todo el ciclo de vida del proyecto. En la práctica, un proyecto real necesita comportarse distinto según el ambiente: en desarrollo local, un equipo puede querer autonomía de IA más amplia y saltarse escaneos lentos para iterar rápido; antes de un release, exactamente lo contrario. Hoy la única forma de expresar esa diferencia es fuera del manifiesto (convención no escrita, o un segundo `FRAMEWORK.yaml` copiado a mano) — exactamente el tipo de conocimiento tribal que el framework existe para evitar.

Esta es la primera pieza de la fase 2.0 del roadmap ("orquestación de perfiles, políticas y resolución automática de contexto"). Se decide explícitamente el alcance concreto de "perfiles" antes de construir nada más de 2.0, para no inventar una arquitectura de la que solo hay una frase de descripción.

## Opciones consideradas

1. **Múltiples archivos `FRAMEWORK.<perfil>.yaml`**: cada perfil sería un manifiesto completo aparte. Duplica la mayoría del contenido (identidad, autoridad, todos los gates) por cada perfil, con alto riesgo de que diverjan por descuido.
2. **Una sola sección `profiles` en `FRAMEWORK.yaml` con overrides parciales por clave**: cada perfil declara solo lo que cambia respecto al manifiesto base; todo lo no declarado se hereda. Un único archivo, sin duplicación, con el mismo parser YAML ya existente (no requiere extenderlo: `profiles.<nombre>.quality_gates.<clave>` es simplemente otro nivel de anidación, que el parser recursivo ya soporta).
3. **Un motor de políticas que interprete `DECISION_POLICY.md` en tiempo real**: mucho más ambicioso (NLP o reglas sobre texto libre), sin relación directa con "perfiles por ambiente", y sin demanda concreta demostrada — se descarta por ahora, coherente con YAGNI.

## Decisión

Opción 2. Se añade una sección opcional `profiles` al manifiesto:

```yaml
profiles:
  <nombre>:
    quality_gates: { <clave>: <valor>, ... }   # opcional, subconjunto de las 12 claves
    ai: { default_autonomy: ..., context_policy: ... }  # opcional
    commands: { <nombre>: <comando>, ... }     # opcional, añade o sobrescribe comandos
```

Resolución (`resolveProfile(manifest, nombre)` en `scripts/lib/core.mjs`): superpone por clave (no reemplaza la sección completa) `quality_gates`, `ai` y `commands` sobre el manifiesto base. Sin `profiles` o sin pedir un perfil, el comportamiento es idéntico al actual — compatibilidad hacia atrás total, ningún proyecto existente se ve afectado.

`scripts/validate-manifest.mjs` valida cada perfil declarado con las mismas reglas que la sección base (claves de gate válidas, valores de autonomía válidos, comandos no vacíos), sin exigir que un perfil declare las 12 claves — son overrides parciales por diseño.

`node scripts/resolve-profile.mjs <perfil>` es una herramienta de inspección: imprime la configuración efectiva resuelta (para que un humano o el pipeline de CI de un proyecto adoptante decidan qué aplicar). `node scripts/quality-gates.mjs --profile <perfil>` usa los `commands` resueltos del perfil al ejecutar el gate — es la única sección con efecto operativo directo hoy, porque es la única que ya se ejecuta (a diferencia de `quality_gates`/`ai`, que son declarativos en todo el framework, no solo en perfiles: ver el resto de `scripts/`).

Este propio repositorio declara dos perfiles como ejemplo real (no solo documentación): `contributor` (autonomía `full`, escaneos de dependencias/secretos `optional` para iteración local rápida) y `release` (añade el comando `release_check` que corre `prepare-release.mjs`).

## Consecuencias

- Positivas: un solo archivo de verdad; cambiar de ambiente es una bandera (`--profile`), no editar el manifiesto a mano; compatibilidad hacia atrás total.
- Negativas: `quality_gates` y `ai` dentro de un perfil siguen siendo declarativos (documentan intención, no la fuerzan automáticamente) — igual que ya ocurría con la sección base antes de esta decisión. Un proyecto real que quiera que su CI *realmente* cambie de comportamiento debe leer `resolve-profile.mjs --json` y actuar en consecuencia, tal como ya hace con `commands`.
- Deuda aceptada: ninguna nueva; el alcance queda deliberadamente acotado a "qué overrides son válidos y cómo se resuelven", no a "hacer cumplir automáticamente cada gate" — eso requeriría rediseñar cómo cada validador consume `quality_gates`, fuera del alcance de esta decisión.

## Migración y rollback

Aditivo puro: ningún manifiesto existente sin `profiles` cambia de comportamiento. Rollback = eliminar la sección `profiles` y las banderas `--profile`; el resto del framework sigue funcionando igual.

## Validación

`scripts/tests/profiles.test.mjs`: `resolveProfile` superpone por clave y preserva lo no declarado (probado explícitamente, no solo "no lanza error"); perfil desconocido lanza con la lista de perfiles disponibles; `validate-manifest.mjs` acepta overrides parciales válidos y rechaza claves de gate inexistentes y valores de autonomía inválidos dentro de un perfil; `quality-gates --profile` ejecuta de verdad los `commands` del perfil (no los base) — verificado corriendo `node --version` desde un perfil de prueba y confirmando que aparece en el log, no el comando base.
