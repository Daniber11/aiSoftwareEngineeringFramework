/**
 * Valida el índice de módulos (.ai/context/MODULES.md):
 * tabla presente, sin filas de plantilla fuera de bootstrap, y rutas
 * referenciadas en la columna "Rutas" existentes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { Reporter, isMain, parseArgs, resolveRoot, readManifest, isBootstrap } from './lib/core.mjs';

/** Extrae las filas de la primera tabla Markdown: array de arrays de celdas. */
export function parseTableRows(markdown) {
  const rows = [];
  for (const line of markdown.split(/\r?\n/)) {
    const t = line.trim();
    if (!t.startsWith('|')) continue;
    if (/^\|[\s|:-]+\|$/.test(t)) continue; // separador de encabezado
    const cells = t.slice(1, t.endsWith('|') ? -1 : undefined).split('|').map((c) => c.trim());
    rows.push(cells);
  }
  return rows;
}

export function run(root, reporter = new Reporter()) {
  const rel = '.ai/context/MODULES.md';
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    reporter.error('Índice de módulos ausente.', rel);
    return reporter;
  }
  const bootstrap = isBootstrap(readManifest(root));
  const rows = parseTableRows(fs.readFileSync(abs, 'utf8'));

  if (rows.length < 2) {
    reporter.error('MODULES.md no contiene una tabla de módulos.', rel);
    return reporter;
  }
  const header = rows[0].map((h) => h.toLowerCase());
  const routesIdx = header.findIndex((h) => h.includes('ruta'));
  if (routesIdx < 0) {
    reporter.error('La tabla de módulos no tiene columna "Rutas".', rel);
    return reporter;
  }

  const dataRows = rows.slice(1);
  let modules = 0;
  for (const cells of dataRows) {
    const moduleName = cells[0] ?? '';
    if (cells.some((c) => c.includes('CHANGE_ME'))) {
      const msg = `Fila de módulo con CHANGE_ME: "${moduleName}"`;
      if (bootstrap) reporter.warn(`${msg} (permitido en bootstrap)`, rel);
      else reporter.error(msg, rel);
      continue;
    }
    modules++;
    const routesCell = cells[routesIdx] ?? '';
    const refs = [...routesCell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (!fs.existsSync(path.join(root, ref))) {
        reporter.error(`Módulo "${moduleName}": la ruta ${ref} no existe`, rel);
      }
    }
  }

  if (modules === 0 && !bootstrap) {
    reporter.error('El índice de módulos no documenta ningún módulo real.', rel);
  }
  if (reporter.errors === 0) reporter.ok(`Índice de módulos válido (${modules} módulo(s) documentado(s)).`);
  return reporter;
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const reporter = run(resolveRoot(args.flags));
  reporter.print();
  process.exit(reporter.errors ? 1 : 0);
}
