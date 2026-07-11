/**
 * Motor de políticas de gobernanza de IA: clasifica un conjunto de rutas
 * cambiadas contra las categorías de `.ai/governance/DECISION_POLICY.md`
 * ("puede ejecutar sin aprobación" vs "debe proponer antes de ejecutar"),
 * en vez de que el asistente se autoevalúe.
 *
 * Determinista, por reglas de ruta (y estado A/M/D opcional) — no interpreta
 * el texto libre de DECISION_POLICY.md con un modelo: sería exactamente la
 * coincidencia difusa que el ADR-0005 ya descartó por romper la
 * independencia de modelo de IA del framework. Cada regla cita
 * explícitamente a qué categoría de DECISION_POLICY.md corresponde.
 *
 * Uso: node scripts/classify-change.mjs <ruta>[:A|M|D] ... [--root <ruta>] [--json]
 * Sin sufijo de estado, se asume "M" (modificado).
 */
import { isMain, parseArgs, resolveRoot, readManifest } from './lib/core.mjs';
import { matchModules, matchAdrs } from './resolve-context.mjs';

/**
 * Reglas deterministas. Cada una cita la categoría literal de
 * DECISION_POLICY.md que justifica exigir aprobación.
 */
const RULES = [
  {
    id: 'dependency-manifest',
    test: (p) => /(^|\/)(package\.json|package-lock\.json|pyproject\.toml|requirements[^/]*\.txt|[^/]+\.csproj|build\.gradle|settings\.gradle|go\.mod|Cargo\.toml)$/i.test(p),
    policy: 'Nuevas dependencias estructurales',
    reason: 'Modifica un manifiesto de dependencias; puede añadir una dependencia estructural nueva.',
  },
  {
    id: 'ci-cd-pipeline',
    test: (p) => /^\.github\/workflows\//.test(p),
    policy: 'Cambios de infraestructura de producción',
    reason: 'Modifica un workflow de CI/CD; interpretación amplia de "infraestructura de producción" (ver ADR-0006).',
  },
  {
    id: 'destructive-migration',
    test: (p) => /(^|\/)migrations?\//i.test(p) || /\bmigration\b/i.test(p),
    policy: 'Migraciones destructivas',
    reason: 'La ruta sugiere una migración de datos o esquema.',
  },
  {
    id: 'security-policy',
    test: (p) => p === '.ai/governance/SECURITY_POLICY.md',
    policy: 'Cambios en seguridad, identidad o permisos',
    reason: 'Modifica la política de seguridad del proyecto directamente.',
  },
  {
    id: 'file-removed',
    test: (p, status) => status === 'D',
    policy: 'Eliminación de funcionalidades',
    reason: 'La ruta se elimina.',
  },
];

/** Clasifica una sola ruta (con estado opcional A/M/D). Determinista, sin IA. */
export function classifyPath(root, pathWithStatus) {
  const [rawPath, statusRaw] = pathWithStatus.split(':');
  const status = (statusRaw ?? 'M').toUpperCase();
  const path = rawPath.replace(/\\/g, '/');

  const triggered = RULES.filter((r) => r.test(path, status));
  const modules = matchModules(root, path);
  const adrs = matchAdrs(root, path).filter((a) => a.state === 'Aceptado');

  return {
    path,
    status,
    requires_approval: triggered.length > 0,
    matched_rules: triggered.map((r) => ({ id: r.id, policy: r.policy, reason: r.reason })),
    module: modules[0]?.module ?? null,
    related_accepted_adrs: adrs.map((a) => ({ file: a.file, title: a.title })),
  };
}

/** Clasifica un conjunto de rutas y produce un veredicto agregado. */
export function classifyChange(root, pathsWithStatus) {
  const items = pathsWithStatus.map((p) => classifyPath(root, p));
  const requiresApproval = items.some((i) => i.requires_approval);
  return {
    verdict: requiresApproval ? 'DEBE_PROPONER_ANTES_DE_EJECUTAR' : 'PUEDE_EJECUTAR_SIN_APROBACION',
    items,
  };
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  if (args._.length === 0) {
    console.error('[FAIL] Uso: node scripts/classify-change.mjs <ruta>[:A|M|D] ... [--root <ruta>] [--json]');
    process.exit(1);
  }
  try {
    const root = resolveRoot(args.flags);
    readManifest(root); // valida que root sea un proyecto real antes de clasificar
    const result = classifyChange(root, args._);
    if (args.flags.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`Veredicto: ${result.verdict}\n`);
      for (const item of result.items) {
        const tag = item.requires_approval ? '[APROBAR]' : '[ OK ]   ';
        console.log(`${tag} ${item.status} ${item.path}`);
        if (item.module) console.log(`          módulo: ${item.module}`);
        for (const adr of item.related_accepted_adrs) console.log(`          ADR: ${adr.file} — ${adr.title}`);
        for (const rule of item.matched_rules) console.log(`          política: "${rule.policy}" — ${rule.reason}`);
      }
    }
    process.exit(result.verdict === 'DEBE_PROPONER_ANTES_DE_EJECUTAR' ? 1 : 0);
  } catch (e) {
    console.error(`[FAIL] ${e.message}`);
    process.exit(1);
  }
}
