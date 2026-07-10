/**
 * Crea un nuevo ADR numerado a partir de la plantilla 0000.
 * Uso: node scripts/new-adr.mjs "Título de la decisión"
 */
import fs from 'node:fs';
import path from 'node:path';
import { isMain, parseArgs, resolveRoot } from './lib/core.mjs';

export function slugify(title) {
  const noDiacritics = [...title.toLowerCase().normalize('NFD')]
    .filter((c) => c.codePointAt(0) < 0x0300 || c.codePointAt(0) > 0x036f)
    .join('');
  return noDiacritics.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function createAdr(root, title, today = new Date()) {
  if (!title || !title.trim()) throw new Error('Falta el título: node scripts/new-adr.mjs "Título de la decisión"');
  const adrDir = path.join(root, '.ai', 'decisions', 'adr');
  const templatePath = path.join(adrDir, '0000-template.md');
  if (!fs.existsSync(templatePath)) throw new Error(`No existe la plantilla ${templatePath}`);

  const numbers = fs.readdirSync(adrDir)
    .map((f) => f.match(/^(\d{4})-.+\.md$/))
    .filter(Boolean)
    .map((m) => Number.parseInt(m[1], 10));
  const next = String(Math.max(...numbers, 0) + 1).padStart(4, '0');

  const date = today.toISOString().slice(0, 10);
  const content = fs.readFileSync(templatePath, 'utf8')
    .replace(/^# ADR-0000: Título/m, `# ADR-${next}: ${title.trim()}`)
    .replace(/^- Estado: Propuesto/m, '- Estado: Propuesto')
    .replace(/^- Fecha: YYYY-MM-DD/m, `- Fecha: ${date}`);

  const file = path.join(adrDir, `${next}-${slugify(title)}.md`);
  if (fs.existsSync(file)) throw new Error(`Ya existe ${file}`);
  fs.writeFileSync(file, content, 'utf8');
  return path.relative(root, file).split(path.sep).join('/');
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  try {
    const rel = createAdr(resolveRoot(args.flags), args._.join(' '));
    console.log(`[ OK ] ADR creado: ${rel}`);
    console.log('Completa Contexto, Opciones, Decisión, Consecuencias, Migración y Validación antes de marcarlo Aceptado.');
  } catch (e) {
    console.error(`[FAIL] ${e.message}`);
    process.exit(1);
  }
}
