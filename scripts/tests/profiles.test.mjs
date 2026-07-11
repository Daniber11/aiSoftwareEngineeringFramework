import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Reporter, resolveProfile } from '../lib/core.mjs';
import { run as validateManifest } from '../validate-manifest.mjs';
import { runGates } from '../quality-gates.mjs';

const BASE_MANIFEST = {
  framework: { name: 'AI Software Engineering Framework', version: '1.3.0', specification_version: 1, model_agnostic: true },
  project: { name: 'demo', type: 'backend-service', status: 'active', risk_level: 'medium' },
  quality_gates: {
    formatting: 'required', linting: 'required', static_analysis: 'required', unit_tests: 'required',
    integration_tests: 'required', e2e_tests: 'risk_based', contract_tests: 'architecture_based',
    security_scanning: 'required', dependency_scanning: 'required', secret_scanning: 'required',
    build_reproducibility: 'required', documentation_validation: 'required',
  },
  ai: { default_autonomy: 'bounded', context_policy: 'minimum-necessary' },
  commands: { tests: 'echo base' },
};

test('resolveProfile: sin nombre de perfil devuelve el manifiesto sin cambios', () => {
  const resolved = resolveProfile(BASE_MANIFEST, null);
  assert.equal(resolved, BASE_MANIFEST);
});

test('resolveProfile: superpone por clave, no reemplaza la sección completa', () => {
  const manifest = {
    ...BASE_MANIFEST,
    profiles: {
      dev: {
        quality_gates: { e2e_tests: 'optional' },
        ai: { default_autonomy: 'full' },
        commands: { tests: 'echo dev' },
      },
    },
  };
  const resolved = resolveProfile(manifest, 'dev');
  // Sobrescrita:
  assert.equal(resolved.quality_gates.e2e_tests, 'optional');
  assert.equal(resolved.ai.default_autonomy, 'full');
  assert.equal(resolved.commands.tests, 'echo dev');
  // Heredado del manifiesto base (no declarado en el perfil):
  assert.equal(resolved.quality_gates.formatting, 'required');
  assert.equal(resolved.ai.context_policy, 'minimum-necessary');
  // Secciones no sobrescribibles quedan intactas:
  assert.deepEqual(resolved.project, manifest.project);
});

test('resolveProfile: perfil desconocido lanza con la lista de perfiles disponibles', () => {
  const manifest = { ...BASE_MANIFEST, profiles: { dev: {}, release: {} } };
  assert.throws(() => resolveProfile(manifest, 'staging'), /dev, release/);
});

test('resolveProfile: manifiesto sin sección profiles y perfil pedido lanza con lista vacía', () => {
  assert.throws(() => resolveProfile(BASE_MANIFEST, 'dev'), /\(ninguno\)/);
});

/** Crea un proyecto adoptante mínimo con la sección `profiles` dada, para probar el validador y quality-gates end-to-end. */
function makeFixtureWithProfiles(profilesYaml) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aisef-profiles-'));
  const write = (rel, content) => {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
  };
  write(
    'FRAMEWORK.yaml',
    [
      'framework:',
      '  name: AI Software Engineering Framework',
      '  version: 1.3.0',
      '  specification_version: 1',
      '  mode: production-ready-by-default',
      '  model_agnostic: true',
      'project:',
      '  name: fixture-service',
      '  type: backend-service',
      '  maturity_target: production',
      '  risk_level: medium',
      '  repository_strategy: monorepo',
      '  status: active',
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
      'commands:',
      '  tests: node --test',
      'ai:',
      '  default_autonomy: bounded',
      '  context_policy: minimum-necessary',
      profilesYaml,
      '',
    ].join('\n'),
  );
  write('README.md', '# Fixture\n\nProyecto de prueba.\n');
  write('.ai/AGENTS.md', '# Reglas para asistentes\n\nLee el manifiesto primero.\n');
  write('.ai/context/PROJECT.md', '# Identidad del proyecto\n\nServicio de ejemplo para pruebas.\n');
  write('.ai/context/ARCHITECTURE.md', '# Arquitectura\n\nMonolito modular.\n');
  write(
    '.ai/context/MODULES.md',
    '# Índice de módulos\n\n| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |\n|---|---|---|---|---|---|\n| core | Núcleo | `README.md` | N/A | N/A | Equipo |\n',
  );
  write(
    '.ai/context/CURRENT_CONTEXT.md',
    [
      '# Contexto activo', '', '## Objetivo actual', 'Probar perfiles.', '',
      '## Estado', 'En construcción.', '',
      '## Decisiones vigentes relevantes', '- Ninguna.', '',
      '## Archivos o módulos en alcance', '- N/A', '',
      '## Riesgos y bloqueos', '- Ninguno registrado.', '',
      '## Próxima acción verificable', 'Ninguna.', '',
    ].join('\n'),
  );
  write('.ai/governance/DECISION_POLICY.md', '# Política de decisiones\n\nCambios locales sin aprobación.\n');
  write('.ai/decisions/adr/0000-template.md', '# ADR-0000: Título\n\n- Estado: Propuesto\n');
  return root;
}

test('validate-manifest: acepta un perfil válido con overrides parciales', () => {
  const root = makeFixtureWithProfiles(
    ['profiles:', '  dev:', '    quality_gates:', '      e2e_tests: optional', '    ai:', '      default_autonomy: full'].join('\n'),
  );
  const r = validateManifest(root, new Reporter());
  assert.equal(r.errors, 0);
});

test('validate-manifest: rechaza una clave de gate inexistente y un valor de autonomía inválido dentro de un perfil', () => {
  const root = makeFixtureWithProfiles(
    [
      'profiles:',
      '  dev:',
      '    quality_gates:',
      '      no_existe: required',
      '    ai:',
      '      default_autonomy: yolo',
    ].join('\n'),
  );
  const r = validateManifest(root, new Reporter());
  assert.equal(r.errors, 2);
});

test('quality-gates --profile: usa los commands del perfil, no los base', () => {
  const root = makeFixtureWithProfiles(
    ['profiles:', '  dev:', '    commands:', '      tests: node --version'].join('\n'),
  );
  const logs = [];
  const failed = runGates(root, { profile: 'dev', log: (m) => logs.push(m) });
  assert.equal(failed, 0);
  assert.ok(logs.some((l) => l.includes('node --version')));
  assert.ok(logs.some((l) => l.includes('Perfil activo: dev')));
});
