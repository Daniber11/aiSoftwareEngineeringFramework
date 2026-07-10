/**
 * Valida el contexto activo (.ai/context/CURRENT_CONTEXT.md):
 * secciones obligatorias presentes y con contenido, brevedad, y ausencia de
 * placeholders fuera de la fase bootstrap (ADR-0002).
 */
import fs from 'node:fs';
import path from 'node:path';
import { Reporter, isMain, parseArgs, resolveRoot, readManifest, isBootstrap } from './lib/core.mjs';

export const REQUIRED_SECTIONS = [
  'Objetivo actual',
  'Estado',
  'Decisiones vigentes relevantes',
  'Archivos o módulos en alcance',
  'Riesgos y bloqueos',
  'Próxima acción verificable',
];

const MAX_LINES = 60;

export function run(root, reporter = new Reporter()) {
  const rel = '.ai/context/CURRENT_CONTEXT.md';
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    reporter.error('Contexto activo ausente.', rel);
    return reporter;
  }
  const manifest = readManifest(root);
  const bootstrap = isBootstrap(manifest);
  const text = fs.readFileSync(abs, 'utf8');
  const lines = text.split(/\r?\n/);

  // Divide el documento por encabezados de nivel 2.
  const sections = {};
  let current = null;
  for (const line of lines) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      current = h[1];
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }

  for (const name of REQUIRED_SECTIONS) {
    if (!(name in sections)) {
      reporter.error(`Sección obligatoria ausente: "## ${name}"`, rel);
      continue;
    }
    const body = sections[name].join('\n').trim();
    if (!body) {
      reporter.error(`Sección "## ${name}" vacía`, rel);
    } else if (body.includes('CHANGE_ME')) {
      const msg = `Sección "## ${name}" contiene CHANGE_ME`;
      if (bootstrap) reporter.warn(`${msg} (permitido en bootstrap)`, rel);
      else reporter.error(msg, rel);
    }
  }

  if (lines.length > MAX_LINES) {
    reporter.warn(`El contexto activo tiene ${lines.length} líneas (máximo recomendado: ${MAX_LINES}). Mueve el conocimiento estable a documentos permanentes.`, rel);
  }

  if (reporter.errors === 0) reporter.ok('Contexto activo completo y dentro del límite de brevedad.');
  return reporter;
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const reporter = run(resolveRoot(args.flags));
  reporter.print();
  process.exit(reporter.errors ? 1 : 0);
}
