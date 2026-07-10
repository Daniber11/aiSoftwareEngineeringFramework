/**
 * Prepara y verifica un release del framework:
 * - La versión del manifiesto tiene entrada en CHANGELOG.md.
 * - framework-inventory.json está sincronizado (versión, file_count, entrypoints).
 * - Todos los quality gates pasan.
 *
 * Uso:
 *   node scripts/prepare-release.mjs                  # verificación completa
 *   node scripts/prepare-release.mjs --sync-inventory # regenera el inventario y termina
 */
import fs from 'node:fs';
import path from 'node:path';
import { isMain, parseArgs, resolveRoot, readManifest, walkFiles } from './lib/core.mjs';
import { runGates } from './quality-gates.mjs';

const ENTRYPOINTS = ['README.md', 'CODEX_BOOTSTRAP_PROMPT.md', 'FRAMEWORK.yaml', '.ai/AGENTS.md'];

export function buildInventory(root) {
  const manifest = readManifest(root);
  return {
    name: manifest.framework?.name ?? 'AI Software Engineering Framework',
    version: String(manifest.framework?.version ?? '0.0.0'),
    file_count: walkFiles(root).length,
    entrypoints: ENTRYPOINTS.filter((e) => fs.existsSync(path.join(root, e))),
  };
}

export function syncInventory(root) {
  const inventory = buildInventory(root);
  fs.writeFileSync(path.join(root, 'framework-inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
  return inventory;
}

export function verifyRelease(root, log = console.log) {
  let failed = 0;
  const manifest = readManifest(root);
  const version = String(manifest.framework?.version ?? '');

  const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
  if (new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\]`, 'm').test(changelog)) {
    log(`[ OK ] CHANGELOG.md contiene la entrada [${version}]`);
  } else {
    log(`[FAIL] CHANGELOG.md no tiene entrada para la versión ${version} del manifiesto`);
    failed++;
  }

  const invPath = path.join(root, 'framework-inventory.json');
  const inv = JSON.parse(fs.readFileSync(invPath, 'utf8'));
  const expected = buildInventory(root);
  if (inv.version === expected.version && inv.file_count === expected.file_count) {
    log(`[ OK ] Inventario sincronizado (versión ${inv.version}, ${inv.file_count} archivos)`);
  } else {
    log(`[FAIL] Inventario desincronizado: tiene v${inv.version}/${inv.file_count} archivos, esperado v${expected.version}/${expected.file_count}. Ejecuta --sync-inventory.`);
    failed++;
  }

  log('');
  failed += runGates(root, { log });
  return failed;
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const root = resolveRoot(args.flags);
  if (args.flags['sync-inventory']) {
    const inv = syncInventory(root);
    console.log(`[ OK ] framework-inventory.json regenerado: v${inv.version}, ${inv.file_count} archivos.`);
    process.exit(0);
  }
  const failed = verifyRelease(root);
  console.log(failed === 0 ? '\nRelease: LISTO' : `\nRelease: BLOQUEADO (${failed} verificación(es) fallida(s))`);
  process.exit(failed === 0 ? 0 : 1);
}
