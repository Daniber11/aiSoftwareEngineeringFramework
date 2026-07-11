/**
 * Resolución automática de contexto: dada una ruta tocada por una tarea,
 * calcula qué documentos leer antes de tocar código — en vez de que un
 * asistente de IA descubra manualmente qué es "estrictamente relacionado"
 * (paso 4 de `.ai/AGENTS.md`).
 *
 * Determinista, sin heurística difusa: cruza la ruta dada contra
 * - la columna "Rutas" de `.ai/context/MODULES.md` (ya mantenida por el equipo), y
 * - el campo "Alcance:" de cada ADR en `.ai/decisions/adr/` (ya obligatorio en la plantilla).
 * No inventa metadatos nuevos que mantener por separado.
 *
 * Uso: node scripts/resolve-context.mjs <ruta> [--root <ruta-del-repo>] [--json]
 */
import fs from 'node:fs';
import path from 'node:path';
import { isMain, parseArgs, resolveRoot } from './lib/core.mjs';
import { parseTableRows } from './validate-modules.mjs';

const ALWAYS_READ = [
  'FRAMEWORK.yaml',
  '.ai/context/CURRENT_CONTEXT.md',
  '.ai/governance/DECISION_POLICY.md',
  '.ai/context/MODULES.md',
];

function normalize(p) {
  return p.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '');
}

/** true si `target` cae dentro de (o es exactamente) `ref`, ambos ya normalizados. */
function pathMatches(target, ref) {
  if (!ref) return false;
  if (target === ref) return true;
  return target.startsWith(`${ref}/`);
}

/** Lee la tabla de MODULES.md y devuelve las filas cuya columna Rutas cubre `targetPath`. */
export function matchModules(root, targetPath) {
  const file = path.join(root, '.ai/context/MODULES.md');
  if (!fs.existsSync(file)) return [];
  const rows = parseTableRows(fs.readFileSync(file, 'utf8'));
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.toLowerCase());
  const idx = {
    module: 0,
    responsibility: header.findIndex((h) => h.includes('responsabilidad')),
    routes: header.findIndex((h) => h.includes('ruta')),
    contracts: header.findIndex((h) => h.includes('contrato')),
    tests: header.findIndex((h) => h.includes('prueba')),
    owner: header.findIndex((h) => h.includes('propietario')),
  };
  const target = normalize(targetPath);
  const matches = [];
  for (const cells of rows.slice(1)) {
    const refs = [...(cells[idx.routes] ?? '').matchAll(/`([^`]+)`/g)].map((m) => normalize(m[1]));
    if (refs.some((ref) => pathMatches(target, ref))) {
      matches.push({
        module: cells[idx.module] ?? '',
        responsibility: cells[idx.responsibility] ?? '',
        routes: refs,
        contracts: cells[idx.contracts] ?? '',
        tests: cells[idx.tests] ?? '',
        owner: cells[idx.owner] ?? '',
      });
    }
  }
  return matches;
}

/** Lee cada ADR y devuelve los que declaran `targetPath` dentro de su "- Alcance:". */
export function matchAdrs(root, targetPath) {
  const dir = path.join(root, '.ai/decisions/adr');
  if (!fs.existsSync(dir)) return [];
  const target = normalize(targetPath);
  const matches = [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (name === '0000-template.md' || !name.endsWith('.md')) continue;
    const text = fs.readFileSync(path.join(dir, name), 'utf8');
    const titleMatch = text.match(/^#\s*(.+)$/m);
    const scopeLine = text.split(/\r?\n/).find((l) => /^-\s*Alcance:/i.test(l.trim()));
    const stateLine = text.split(/\r?\n/).find((l) => /^-\s*Estado:/i.test(l.trim()));
    if (!scopeLine) continue;
    const refs = [...scopeLine.matchAll(/`([^`]+)`/g)].map((m) => normalize(m[1]));
    if (refs.some((ref) => pathMatches(target, ref))) {
      matches.push({
        file: `.ai/decisions/adr/${name}`,
        title: titleMatch ? titleMatch[1].trim() : name,
        state: stateLine ? stateLine.replace(/^-\s*Estado:\s*/i, '').trim() : null,
        scope: refs,
      });
    }
  }
  return matches;
}

/** Resuelve el conjunto de contexto recomendado para una ruta dada. */
export function resolveContext(root, targetPath) {
  return {
    path: normalize(targetPath),
    always_read: ALWAYS_READ.filter((f) => fs.existsSync(path.join(root, f))),
    modules: matchModules(root, targetPath),
    adrs: matchAdrs(root, targetPath),
  };
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const targetPath = args._[0];
  if (!targetPath) {
    console.error('[FAIL] Uso: node scripts/resolve-context.mjs <ruta> [--root <ruta>] [--json]');
    process.exit(1);
  }
  try {
    const root = resolveRoot(args.flags);
    const result = resolveContext(root, targetPath);
    if (args.flags.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`Contexto para: ${result.path}\n`);
      console.log('Leer siempre:');
      for (const f of result.always_read) console.log(`  - ${f}`);
      if (result.modules.length) {
        console.log('\nMódulo(s) relacionado(s) (.ai/context/MODULES.md):');
        for (const m of result.modules) {
          console.log(`  - ${m.module}: ${m.responsibility}`);
          console.log(`      contratos: ${m.contracts}`);
          console.log(`      pruebas: ${m.tests}`);
        }
      } else {
        console.log('\nNingún módulo de MODULES.md cubre esta ruta.');
      }
      if (result.adrs.length) {
        console.log('\nADR relacionados:');
        for (const a of result.adrs) console.log(`  - ${a.file}: ${a.title} [${a.state}]`);
      } else {
        console.log('\nNingún ADR declara esta ruta en su Alcance.');
      }
    }
  } catch (e) {
    console.error(`[FAIL] ${e.message}`);
    process.exit(1);
  }
}
