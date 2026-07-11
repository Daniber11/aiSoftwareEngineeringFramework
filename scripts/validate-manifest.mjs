/**
 * Valida FRAMEWORK.yaml contra el esquema del framework:
 * claves obligatorias, valores permitidos y rutas de autoridad existentes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { Reporter, isMain, parseArgs, resolveRoot, readManifest, isBootstrap } from './lib/core.mjs';

const GATE_VALUES = ['required', 'risk_based', 'architecture_based', 'optional', 'disabled'];
const GATE_KEYS = [
  'formatting', 'linting', 'static_analysis', 'unit_tests', 'integration_tests',
  'e2e_tests', 'contract_tests', 'security_scanning', 'dependency_scanning',
  'secret_scanning', 'build_reproducibility', 'documentation_validation',
];
const STATUS_VALUES = ['bootstrap', 'active', 'production', 'maintenance'];
const RISK_VALUES = ['low', 'medium', 'high', 'critical'];
const AUTONOMY_VALUES = ['none', 'bounded', 'full'];
const SEMVER = /^\d+\.\d+\.\d+$/;

export function run(root, reporter = new Reporter()) {
  let m;
  try {
    m = readManifest(root);
  } catch (e) {
    reporter.error(`FRAMEWORK.yaml no parseable: ${e.message}`, 'FRAMEWORK.yaml');
    return reporter;
  }

  const req = (section, key, pred, expected) => {
    const value = m?.[section]?.[key];
    if (value === undefined || value === null || value === '') {
      reporter.error(`Falta ${section}.${key}`, 'FRAMEWORK.yaml');
    } else if (pred && !pred(value)) {
      reporter.error(`${section}.${key} inválido: "${value}" (esperado: ${expected})`, 'FRAMEWORK.yaml');
    }
  };

  req('framework', 'name', (v) => typeof v === 'string', 'texto');
  req('framework', 'version', (v) => SEMVER.test(String(v)), 'semver X.Y.Z');
  req('framework', 'specification_version', (v) => Number.isInteger(v), 'entero');
  req('framework', 'model_agnostic', (v) => typeof v === 'boolean', 'true|false');

  req('project', 'name', (v) => typeof v === 'string', 'texto');
  req('project', 'type', (v) => typeof v === 'string', 'texto');
  req('project', 'status', (v) => STATUS_VALUES.includes(v), STATUS_VALUES.join('|'));
  req('project', 'risk_level', (v) => RISK_VALUES.includes(v), RISK_VALUES.join('|'));

  for (const field of ['name', 'type']) {
    if (String(m?.project?.[field] ?? '').includes('CHANGE_ME')) {
      const msg = `project.${field} sigue en CHANGE_ME`;
      if (isBootstrap(m)) reporter.warn(`${msg} (permitido en bootstrap)`, 'FRAMEWORK.yaml');
      else reporter.error(msg, 'FRAMEWORK.yaml');
    }
  }

  if (!m.authority || typeof m.authority !== 'object') {
    reporter.error('Falta la sección authority', 'FRAMEWORK.yaml');
  } else {
    for (const [key, rel] of Object.entries(m.authority)) {
      if (typeof rel !== 'string' || !fs.existsSync(path.join(root, rel))) {
        reporter.error(`authority.${key} apunta a una ruta inexistente: ${rel}`, 'FRAMEWORK.yaml');
      }
    }
  }

  if (!m.quality_gates || typeof m.quality_gates !== 'object') {
    reporter.error('Falta la sección quality_gates', 'FRAMEWORK.yaml');
  } else {
    for (const key of GATE_KEYS) {
      const value = m.quality_gates[key];
      if (value === undefined) reporter.error(`Falta quality_gates.${key}`, 'FRAMEWORK.yaml');
      else if (!GATE_VALUES.includes(value)) {
        reporter.error(`quality_gates.${key} inválido: "${value}" (esperado: ${GATE_VALUES.join('|')})`, 'FRAMEWORK.yaml');
      }
    }
  }

  req('ai', 'default_autonomy', (v) => AUTONOMY_VALUES.includes(v), AUTONOMY_VALUES.join('|'));
  req('ai', 'context_policy', (v) => typeof v === 'string', 'texto');

  if (m.commands) {
    for (const [name, cmd] of Object.entries(m.commands)) {
      if (typeof cmd !== 'string' || !cmd.trim()) {
        reporter.error(`commands.${name} debe ser un comando no vacío`, 'FRAMEWORK.yaml');
      }
    }
  }

  if (m.profiles) {
    if (typeof m.profiles !== 'object' || Array.isArray(m.profiles)) {
      reporter.error('profiles debe ser un mapa de nombre de perfil a overrides', 'FRAMEWORK.yaml');
    } else {
      for (const [profileName, profile] of Object.entries(m.profiles)) {
        if (typeof profile !== 'object' || profile === null || Array.isArray(profile)) {
          reporter.error(`profiles.${profileName} debe ser un mapa`, 'FRAMEWORK.yaml');
          continue;
        }
        if (profile.quality_gates) {
          for (const [key, value] of Object.entries(profile.quality_gates)) {
            if (!GATE_KEYS.includes(key)) {
              reporter.error(`profiles.${profileName}.quality_gates.${key} no es una clave de gate válida`, 'FRAMEWORK.yaml');
            } else if (!GATE_VALUES.includes(value)) {
              reporter.error(
                `profiles.${profileName}.quality_gates.${key} inválido: "${value}" (esperado: ${GATE_VALUES.join('|')})`,
                'FRAMEWORK.yaml',
              );
            }
          }
        }
        if (profile.ai) {
          if (profile.ai.default_autonomy !== undefined && !AUTONOMY_VALUES.includes(profile.ai.default_autonomy)) {
            reporter.error(
              `profiles.${profileName}.ai.default_autonomy inválido: "${profile.ai.default_autonomy}" (esperado: ${AUTONOMY_VALUES.join('|')})`,
              'FRAMEWORK.yaml',
            );
          }
        }
        if (profile.commands) {
          for (const [name, cmd] of Object.entries(profile.commands)) {
            if (typeof cmd !== 'string' || !cmd.trim()) {
              reporter.error(`profiles.${profileName}.commands.${name} debe ser un comando no vacío`, 'FRAMEWORK.yaml');
            }
          }
        }
      }
    }
  }

  if (reporter.errors === 0) reporter.ok('Manifiesto válido según el esquema del framework.');
  return reporter;
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const reporter = run(resolveRoot(args.flags));
  reporter.print();
  process.exit(reporter.errors ? 1 : 0);
}
