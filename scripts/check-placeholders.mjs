/**
 * Detecta contenido de plantilla y trabajo pendiente en la documentación:
 * - CHANGE_ME: error (advertencia en fase bootstrap, ADR-0002).
 * - TODO / FIXME / TBD / HACK: advertencia siempre.
 * Excluye rutas de plantilla y código dentro de Markdown (bloques y spans).
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  Reporter, isMain, parseArgs, resolveRoot, walkFiles, readManifest,
  isBootstrap, stripCodeSegments, isPlaceholderExcluded,
} from './lib/core.mjs';

const SCANNED_EXTS = ['.md', '.yaml', '.yml', '.json', '.txt'];
const FATAL = /\bCHANGE_ME\b/;
const PENDING = /\b(TODO|FIXME|TBD|HACK)\b/;

export function run(root, reporter = new Reporter()) {
  const bootstrap = isBootstrap(readManifest(root));
  const files = walkFiles(root, { exts: SCANNED_EXTS });
  let fatalCount = 0;
  let pendingCount = 0;

  for (const rel of files) {
    if (isPlaceholderExcluded(rel)) continue;
    let text = fs.readFileSync(path.join(root, rel), 'utf8');
    if (rel.endsWith('.md')) text = stripCodeSegments(text);

    text.split('\n').forEach((line, idx) => {
      if (FATAL.test(line)) {
        fatalCount++;
        const msg = `CHANGE_ME en línea ${idx + 1}`;
        if (bootstrap) reporter.warn(`${msg} (permitido en bootstrap)`, rel);
        else reporter.error(msg, rel);
      }
      const pending = line.match(PENDING);
      if (pending) {
        pendingCount++;
        reporter.warn(`${pending[1]} en línea ${idx + 1}`, rel);
      }
    });
  }

  if (reporter.errors === 0) {
    reporter.ok(
      fatalCount || pendingCount
        ? `Sin placeholders bloqueantes (${fatalCount} de plantilla en bootstrap, ${pendingCount} pendientes).`
        : `Sin placeholders en ${files.length} archivos escaneados.`,
    );
  }
  return reporter;
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const reporter = run(resolveRoot(args.flags));
  reporter.print();
  process.exit(reporter.errors ? 1 : 0);
}
