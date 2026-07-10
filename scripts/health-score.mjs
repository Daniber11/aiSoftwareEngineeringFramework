/**
 * Calcula el health score del repositorio (0-100) ejecutando todos los
 * validadores. Cada área pondera su peso: errores la anulan, advertencias
 * la reducen a la mitad.
 *
 * Uso: node scripts/health-score.mjs [--root <ruta>] [--json] [--out <archivo>]
 */
import fs from 'node:fs';
import { Reporter, isMain, parseArgs, resolveRoot } from './lib/core.mjs';
import { CHECKS } from './lib/checks.mjs';

export function computeHealth(root) {
  const areas = [];
  for (const check of CHECKS) {
    const reporter = new Reporter();
    try {
      check.run(root, reporter);
    } catch (e) {
      reporter.error(`Excepción en validador: ${e.message}`);
    }
    const ratio = reporter.errors > 0 ? 0 : reporter.warnings > 0 ? 0.5 : 1;
    areas.push({
      id: check.id,
      title: check.title,
      weight: check.weight,
      errors: reporter.errors,
      warnings: reporter.warnings,
      score: Math.round(check.weight * ratio),
      findings: reporter.items.filter((i) => i.level !== 'ok').map((i) => ({ level: i.level, msg: i.msg, file: i.file ?? null })),
    });
  }
  const total = areas.reduce((s, a) => s + a.score, 0);
  const level = total >= 90 ? 'saludable' : total >= 70 ? 'aceptable' : total >= 50 ? 'insuficiente' : 'crítico';
  return { generated_at: new Date().toISOString(), root, total, level, areas };
}

export function printHealth(report) {
  console.log('Health score del framework');
  console.log('--------------------------');
  for (const a of report.areas) {
    const state = a.errors ? 'FAIL' : a.warnings ? 'WARN' : ' OK ';
    console.log(`[${state}] ${a.title.padEnd(38)} ${String(a.score).padStart(3)}/${a.weight}  (${a.errors} err, ${a.warnings} warn)`);
    for (const f of a.findings.slice(0, 10)) {
      console.log(`        - ${f.level === 'error' ? 'error' : 'aviso'}: ${f.msg}${f.file ? ` (${f.file})` : ''}`);
    }
    if (a.findings.length > 10) console.log(`        - ... y ${a.findings.length - 10} hallazgos más`);
  }
  console.log('--------------------------');
  console.log(`Total: ${report.total}/100 — ${report.level}`);
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const report = computeHealth(resolveRoot(args.flags));
  if (args.flags.out) fs.writeFileSync(String(args.flags.out), JSON.stringify(report, null, 2), 'utf8');
  if (args.flags.json) console.log(JSON.stringify(report, null, 2));
  else printHealth(report);
  process.exit(report.total >= 70 ? 0 : 1);
}
