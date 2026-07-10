import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Reporter } from '../lib/core.mjs';
import { run as validateStructure } from '../validate-structure.mjs';
import { run as validateManifest } from '../validate-manifest.mjs';
import { run as validateLinks } from '../validate-links.mjs';
import { run as validateContext } from '../validate-context.mjs';
import { run as validateModules } from '../validate-modules.mjs';
import { run as checkPlaceholders } from '../check-placeholders.mjs';
import { createAdr } from '../new-adr.mjs';
import { initProject } from '../init-project.mjs';

function manifestFor(status) {
  return [
    'framework:',
    '  name: AI Software Engineering Framework',
    '  version: 1.1.0',
    '  specification_version: 1',
    '  mode: production-ready-by-default',
    '  model_agnostic: true',
    'project:',
    '  name: fixture-service',
    '  type: backend-service',
    '  maturity_target: production',
    '  risk_level: medium',
    '  repository_strategy: monorepo',
    `  status: ${status}`,
    'authority:',
    '  manifest: FRAMEWORK.yaml',
    '  governance: .ai/governance/DECISION_POLICY.md',
    '  active_context: .ai/context/CURRENT_CONTEXT.md',
    '  architecture: .ai/context/ARCHITECTURE.md',
    '  modules: .ai/context/MODULES.md',
    '  decisions: .ai/decisions/adr',
    'quality_gates:',
    '  formatting: required',
    '  linting: required',
    '  static_analysis: required',
    '  unit_tests: required',
    '  integration_tests: required',
    '  e2e_tests: risk_based',
    '  contract_tests: architecture_based',
    '  security_scanning: required',
    '  dependency_scanning: required',
    '  secret_scanning: required',
    '  build_reproducibility: required',
    '  documentation_validation: required',
    'ai:',
    '  default_autonomy: bounded',
    '  context_policy: minimum-necessary',
    '',
  ].join('\n');
}

const CONTEXT_OK = [
  '# Contexto activo',
  '',
  '## Objetivo actual',
  'Entregar el módulo de saludo.',
  '',
  '## Estado',
  'En construcción.',
  '',
  '## Decisiones vigentes relevantes',
  '- ADR-0001.',
  '',
  '## Archivos o módulos en alcance',
  '- `src/`',
  '',
  '## Riesgos y bloqueos',
  '- Ninguno registrado.',
  '',
  '## Próxima acción verificable',
  'Ejecutar pruebas unitarias.',
  '',
].join('\n');

const MODULES_OK = [
  '# Índice de módulos',
  '',
  '| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |',
  '|---|---|---|---|---|---|',
  '| core | Reglas de saludo | `src/` | API interna | `src/` | Equipo |',
  '',
].join('\n');

/** Crea un proyecto adoptante mínimo y válido en un directorio temporal. */
function makeFixture(status = 'active') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aisef-fixture-'));
  const write = (rel, content) => {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
  };
  write('FRAMEWORK.yaml', manifestFor(status));
  write('README.md', '# Fixture\n\nProyecto de prueba. Ver [contexto](.ai/context/CURRENT_CONTEXT.md).\n');
  write('.ai/AGENTS.md', '# Reglas para asistentes\n\nLee el manifiesto primero.\n');
  write('.ai/context/PROJECT.md', '# Identidad del proyecto\n\nServicio de ejemplo para pruebas.\n');
  write('.ai/context/ARCHITECTURE.md', '# Arquitectura\n\nMonolito modular.\n');
  write('.ai/context/MODULES.md', MODULES_OK);
  write('.ai/context/CURRENT_CONTEXT.md', CONTEXT_OK);
  write('.ai/governance/DECISION_POLICY.md', '# Política de decisiones\n\nCambios locales sin aprobación.\n');
  write('.ai/decisions/adr/0000-template.md', '# ADR-0000: Título\n\n- Estado: Propuesto\n- Fecha: YYYY-MM-DD\n\n## Contexto\n## Decisión\n');
  write('.ai/decisions/adr/0001-arquitectura-inicial.md', '# ADR-0001: Arquitectura inicial\n\n- Estado: Aceptado\n- Fecha: 2026-01-01\n\n## Decisión\nMonolito modular.\n');
  write('scripts/templates/CURRENT_CONTEXT.md', '# Contexto activo\n\n## Objetivo actual\nCHANGE_ME\n');
  write('scripts/templates/MODULES.md', '# Índice de módulos\n\n| Módulo |\n|---|\n| CHANGE_ME |\n');
  fs.mkdirSync(path.join(root, 'src'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src', '.gitkeep'), '');
  return root;
}

test('proyecto adoptante válido: todos los validadores pasan sin errores', () => {
  const root = makeFixture('active');
  for (const run of [validateStructure, validateManifest, validateLinks, validateContext, validateModules, checkPlaceholders]) {
    const r = run(root, new Reporter());
    assert.equal(r.errors, 0, `errores inesperados: ${JSON.stringify(r.items.filter((i) => i.level === 'error'))}`);
  }
});

test('validate-structure: detecta archivo obligatorio ausente', () => {
  const root = makeFixture();
  fs.rmSync(path.join(root, '.ai/governance/DECISION_POLICY.md'));
  const r = validateStructure(root, new Reporter());
  assert.ok(r.errors >= 1);
});

test('validate-manifest: rechaza status y gate inválidos', () => {
  const root = makeFixture();
  const file = path.join(root, 'FRAMEWORK.yaml');
  let text = fs.readFileSync(file, 'utf8')
    .replace('status: active', 'status: whatever')
    .replace('linting: required', 'linting: maybe');
  fs.writeFileSync(file, text);
  const r = validateManifest(root, new Reporter());
  assert.equal(r.errors, 2);
});

test('validate-links: detecta enlaces rotos e ignora URLs externas', () => {
  const root = makeFixture();
  fs.writeFileSync(path.join(root, 'README.md'), '[roto](docs/NO_EXISTE.md) [externo](https://example.com)\n');
  const r = validateLinks(root, new Reporter());
  assert.equal(r.errors, 1);
});

test('ADR-0002: CHANGE_ME es advertencia en bootstrap y error en active', () => {
  const bootstrapRoot = makeFixture('bootstrap');
  const activeRoot = makeFixture('active');
  for (const root of [bootstrapRoot, activeRoot]) {
    fs.writeFileSync(path.join(root, '.ai/context/CURRENT_CONTEXT.md'), CONTEXT_OK.replace('Entregar el módulo de saludo.', 'CHANGE_ME'));
  }
  const warned = validateContext(bootstrapRoot, new Reporter());
  assert.equal(warned.errors, 0);
  assert.ok(warned.warnings >= 1);
  const failed = validateContext(activeRoot, new Reporter());
  assert.ok(failed.errors >= 1);

  const scanWarn = checkPlaceholders(bootstrapRoot, new Reporter());
  assert.equal(scanWarn.errors, 0);
  const scanFail = checkPlaceholders(activeRoot, new Reporter());
  assert.ok(scanFail.errors >= 1);
});

test('check-placeholders: ignora código Markdown y rutas de plantilla', () => {
  const root = makeFixture('active');
  fs.appendFileSync(path.join(root, 'README.md'), '\nEl marcador `CHANGE_ME` se documenta aquí.\n');
  const r = checkPlaceholders(root, new Reporter());
  assert.equal(r.errors, 0);
});

test('validate-modules: detecta rutas inexistentes', () => {
  const root = makeFixture();
  fs.writeFileSync(path.join(root, '.ai/context/MODULES.md'), MODULES_OK.replace('`src/`', '`no/existe/`'));
  const r = validateModules(root, new Reporter());
  assert.ok(r.errors >= 1);
});

test('new-adr: numera consecutivamente y aplica fecha', () => {
  const root = makeFixture();
  const rel = createAdr(root, 'Estrategia de caché', new Date('2026-07-10T12:00:00Z'));
  assert.equal(rel, '.ai/decisions/adr/0002-estrategia-de-cache.md');
  const content = fs.readFileSync(path.join(root, rel), 'utf8');
  assert.match(content, /^# ADR-0002: Estrategia de caché/m);
  assert.match(content, /- Fecha: 2026-07-10/);
});

test('init-project: personaliza manifiesto y restaura contexto de plantilla', () => {
  const root = makeFixture('active');
  initProject(root, { name: 'nuevo-servicio', type: 'api', risk: 'high', force: true });
  const manifest = fs.readFileSync(path.join(root, 'FRAMEWORK.yaml'), 'utf8');
  assert.match(manifest, /name: nuevo-servicio/);
  assert.match(manifest, /type: api/);
  assert.match(manifest, /risk_level: high/);
  assert.match(manifest, /status: bootstrap/);
  assert.match(fs.readFileSync(path.join(root, '.ai/context/CURRENT_CONTEXT.md'), 'utf8'), /CHANGE_ME/);
  // Idempotencia: sin --force conserva contenido real.
  fs.writeFileSync(path.join(root, '.ai/context/CURRENT_CONTEXT.md'), CONTEXT_OK);
  initProject(root, { name: 'nuevo-servicio', type: 'api', risk: 'high' });
  assert.doesNotMatch(fs.readFileSync(path.join(root, '.ai/context/CURRENT_CONTEXT.md'), 'utf8'), /CHANGE_ME/);
});
