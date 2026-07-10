/**
 * Valida que existan (y no estén vacíos) los archivos obligatorios.
 * Perfil `project`: mínimo exigible a un proyecto que adopta el framework.
 * Perfil `framework`: este repositorio completo (se autodetecta por el manifiesto).
 */
import fs from 'node:fs';
import path from 'node:path';
import { Reporter, isMain, parseArgs, resolveRoot, readManifest, isFrameworkRepo } from './lib/core.mjs';

export const PROJECT_REQUIRED_FILES = [
  'FRAMEWORK.yaml',
  'README.md',
  '.ai/AGENTS.md',
  '.ai/context/PROJECT.md',
  '.ai/context/ARCHITECTURE.md',
  '.ai/context/MODULES.md',
  '.ai/context/CURRENT_CONTEXT.md',
  '.ai/governance/DECISION_POLICY.md',
];

export const FRAMEWORK_REQUIRED_FILES = [
  ...PROJECT_REQUIRED_FILES,
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'ROADMAP.md',
  'CODEX_BOOTSTRAP_PROMPT.md',
  'framework-inventory.json',
  '.ai/context/DOMAIN.md',
  '.ai/context/QUALITY_ATTRIBUTES.md',
  '.ai/governance/DEFINITION_OF_DONE.md',
  '.ai/governance/ENGINEERING_PRINCIPLES.md',
  '.ai/governance/PERFORMANCE_AND_CACHE.md',
  '.ai/governance/SECURITY_POLICY.md',
  '.ai/governance/TEST_STRATEGY.md',
  '.ai/checklists/AI_TASK.md',
  '.ai/checklists/PROJECT_BOOTSTRAP.md',
  '.ai/checklists/RELEASE.md',
  '.ai/memory/AI_MEMORY.md',
  '.ai/decisions/adr/0000-template.md',
  'docs/CI_CD_STANDARD.md',
  'docs/CONTEXT_EFFICIENCY.md',
  'docs/MATURITY_MODEL.md',
  'docs/OBSERVABILITY_STANDARD.md',
  'scripts/README.md',
  'scripts/lib/core.mjs',
  'scripts/templates/CURRENT_CONTEXT.md',
  'scripts/templates/MODULES.md',
  '.github/workflows/README.md',
  '.github/workflows/validate-framework.yml',
  '.github/workflows/quality.yml',
  '.github/workflows/security.yml',
  '.github/workflows/test.yml',
  '.github/workflows/release.yml',
  'extensions/README.md',
];

export function run(root, reporter = new Reporter()) {
  let manifest;
  try {
    manifest = readManifest(root);
  } catch (e) {
    reporter.error(`FRAMEWORK.yaml ilegible: ${e.message}`);
    return reporter;
  }
  const required = isFrameworkRepo(manifest) ? FRAMEWORK_REQUIRED_FILES : PROJECT_REQUIRED_FILES;

  for (const rel of required) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) {
      reporter.error(`Archivo obligatorio ausente: ${rel}`);
    } else if (fs.statSync(abs).size === 0) {
      reporter.error(`Archivo obligatorio vacío: ${rel}`);
    }
  }

  const adrDir = path.join(root, '.ai/decisions/adr');
  if (!fs.existsSync(adrDir)) {
    reporter.error('Directorio de ADR ausente: .ai/decisions/adr');
  } else {
    const adrs = fs.readdirSync(adrDir).filter((f) => /^\d{4}-.+\.md$/.test(f) && f !== '0000-template.md');
    if (adrs.length === 0) {
      reporter.warn('No hay ADR registrados además de la plantilla; registra al menos la decisión de arquitectura inicial.');
    }
  }

  if (reporter.errors === 0) reporter.ok(`Estructura completa (${required.length} rutas obligatorias).`);
  return reporter;
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const reporter = run(resolveRoot(args.flags));
  reporter.print();
  process.exit(reporter.errors ? 1 : 0);
}
