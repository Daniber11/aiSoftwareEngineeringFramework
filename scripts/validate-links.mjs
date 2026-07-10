/**
 * Verifica que todos los enlaces Markdown relativos del repositorio resuelvan
 * a archivos o directorios existentes, y que framework-inventory.json (si existe)
 * tenga metadatos consistentes con el árbol real.
 */
import fs from 'node:fs';
import path from 'node:path';
import { Reporter, isMain, parseArgs, resolveRoot, walkFiles, extractMarkdownLinks } from './lib/core.mjs';

export function run(root, reporter = new Reporter()) {
  const mdFiles = walkFiles(root, { exts: ['.md'] });
  let checked = 0;

  for (const rel of mdFiles) {
    const abs = path.join(root, rel);
    const links = extractMarkdownLinks(fs.readFileSync(abs, 'utf8'));
    for (const { target, line } of links) {
      checked++;
      const clean = decodeURIComponent(target.split('#')[0]);
      if (!clean) continue;
      const resolved = path.resolve(path.dirname(abs), clean);
      if (!fs.existsSync(resolved)) {
        reporter.error(`Enlace roto "${target}" (línea ${line})`, rel);
      }
    }
  }

  const inventoryPath = path.join(root, 'framework-inventory.json');
  if (fs.existsSync(inventoryPath)) {
    let inv;
    try {
      inv = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
    } catch (e) {
      reporter.error(`framework-inventory.json no es JSON válido: ${e.message}`, 'framework-inventory.json');
      inv = null;
    }
    if (inv) {
      for (const entry of inv.entrypoints ?? []) {
        if (!fs.existsSync(path.join(root, entry))) {
          reporter.error(`Entrypoint del inventario inexistente: ${entry}`, 'framework-inventory.json');
        }
      }
      const actual = walkFiles(root).length;
      if (inv.file_count !== actual) {
        reporter.error(
          `file_count desactualizado: inventario=${inv.file_count}, real=${actual}. Ejecuta "node scripts/prepare-release.mjs --sync-inventory".`,
          'framework-inventory.json',
        );
      }
    }
  }

  if (reporter.errors === 0) reporter.ok(`Enlaces verificados: ${checked} en ${mdFiles.length} archivos Markdown.`);
  return reporter;
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const reporter = run(resolveRoot(args.flags));
  reporter.print();
  process.exit(reporter.errors ? 1 : 0);
}
