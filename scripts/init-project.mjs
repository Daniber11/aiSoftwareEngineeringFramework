/**
 * Inicializa un proyecto que adopta el framework (idempotente).
 * Uso: node scripts/init-project.mjs --name mi-servicio --type backend-service [--risk medium] [--force]
 *
 * - Personaliza los campos project.* de FRAMEWORK.yaml y deja status: bootstrap.
 * - Restaura CURRENT_CONTEXT.md y MODULES.md desde las plantillas pristinas,
 *   solo si aún contienen contenido de plantilla (o con --force).
 */
import fs from 'node:fs';
import path from 'node:path';
import { isMain, parseArgs, resolveRoot } from './lib/core.mjs';

const RISKS = ['low', 'medium', 'high', 'critical'];

function setProjectField(manifestText, field, value) {
  const lines = manifestText.split(/\r?\n/);
  let inProject = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^project:\s*$/.test(lines[i])) { inProject = true; continue; }
    if (inProject && /^\S/.test(lines[i]) && lines[i].trim() !== '') inProject = false;
    if (inProject) {
      const m = lines[i].match(new RegExp(`^(\\s+${field}:)\\s*.*$`));
      if (m) { lines[i] = `${m[1]} ${value}`; return lines.join('\n'); }
    }
  }
  throw new Error(`No se encontró project.${field} en FRAMEWORK.yaml`);
}

export function initProject(root, { name, type, risk = 'medium', force = false }) {
  if (!name || !type) throw new Error('Uso: node scripts/init-project.mjs --name <nombre> --type <tipo> [--risk low|medium|high|critical]');
  if (!RISKS.includes(risk)) throw new Error(`--risk inválido: ${risk} (permitido: ${RISKS.join('|')})`);

  const actions = [];
  const manifestPath = path.join(root, 'FRAMEWORK.yaml');
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  manifest = setProjectField(manifest, 'name', name);
  manifest = setProjectField(manifest, 'type', type);
  manifest = setProjectField(manifest, 'risk_level', risk);
  manifest = setProjectField(manifest, 'status', 'bootstrap');
  fs.writeFileSync(manifestPath, manifest, 'utf8');
  actions.push(`FRAMEWORK.yaml: project = { name: ${name}, type: ${type}, risk_level: ${risk}, status: bootstrap }`);

  const templates = [
    ['scripts/templates/CURRENT_CONTEXT.md', '.ai/context/CURRENT_CONTEXT.md'],
    ['scripts/templates/MODULES.md', '.ai/context/MODULES.md'],
  ];
  for (const [from, to] of templates) {
    const src = path.join(root, from);
    const dst = path.join(root, to);
    const existing = fs.existsSync(dst) ? fs.readFileSync(dst, 'utf8') : '';
    if (!fs.existsSync(src)) throw new Error(`Plantilla ausente: ${from}`);
    if (force || !existing || existing.includes('CHANGE_ME') || existing === fs.readFileSync(src, 'utf8')) {
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
      actions.push(`${to} restaurado desde plantilla`);
    } else {
      actions.push(`${to} conservado (tiene contenido real; usa --force para sobrescribir)`);
    }
  }
  return actions;
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  try {
    const actions = initProject(resolveRoot(args.flags), {
      name: args.flags.name,
      type: args.flags.type,
      risk: args.flags.risk ?? 'medium',
      force: Boolean(args.flags.force),
    });
    for (const a of actions) console.log(`[ OK ] ${a}`);
    console.log(`
Siguientes pasos:
  1. Completa .ai/context/PROJECT.md, ARCHITECTURE.md, DOMAIN.md y QUALITY_ATTRIBUTES.md.
  2. Llena CURRENT_CONTEXT.md y MODULES.md; registra el primer ADR con: node scripts/new-adr.mjs "Decisión inicial de arquitectura"
  3. Cambia project.status a "active" en FRAMEWORK.yaml para endurecer las validaciones.
  4. Ejecuta: node scripts/quality-gates.mjs`);
  } catch (e) {
    console.error(`[FAIL] ${e.message}`);
    process.exit(1);
  }
}
