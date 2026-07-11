/**
 * Ejecuta los quality gates locales: todos los validadores del framework y,
 * después, los comandos declarados en la sección `commands` de FRAMEWORK.yaml
 * (pruebas, lint u otros gates propios del proyecto).
 *
 * Uso: node scripts/quality-gates.mjs [--root <ruta>] [--skip-commands] [--profile <nombre>]
 * Con --profile, los `commands` del perfil (FRAMEWORK.yaml: profiles.<nombre>.commands)
 * sobrescriben por clave a los `commands` base — ver ADR-0004.
 * Código de salida 0 solo si todos los gates pasan.
 */
import { execSync } from 'node:child_process';
import { Reporter, isMain, parseArgs, resolveRoot, readManifest, resolveProfile } from './lib/core.mjs';
import { CHECKS } from './lib/checks.mjs';

export function runGates(root, { skipCommands = false, profile = null, log = console.log } = {}) {
  let failed = 0;

  log('== Validadores del framework ==');
  for (const check of CHECKS) {
    const reporter = new Reporter();
    try {
      check.run(root, reporter);
    } catch (e) {
      reporter.error(`Excepción en validador: ${e.message}`);
    }
    const state = reporter.errors ? 'FAIL' : reporter.warnings ? 'WARN' : ' OK ';
    log(`[${state}] ${check.title} — ${reporter.errors} err, ${reporter.warnings} warn`);
    for (const item of reporter.items) {
      if (item.level === 'ok') continue;
      log(`        ${item.level === 'error' ? 'error' : 'aviso'}: ${item.msg}${item.file ? ` (${item.file})` : ''}`);
    }
    if (reporter.errors) failed++;
  }

  const manifest = profile ? resolveProfile(readManifest(root), profile) : readManifest(root);
  if (profile) log(`\nPerfil activo: ${profile}`);
  const commands = manifest.commands ?? {};
  const names = Object.keys(commands);
  if (!skipCommands && names.length > 0) {
    log('\n== Comandos del proyecto (FRAMEWORK.yaml: commands) ==');
    for (const name of names) {
      const cmd = commands[name];
      log(`[RUN ] ${name}: ${cmd}`);
      try {
        execSync(cmd, { cwd: root, stdio: 'inherit' });
        log(`[ OK ] ${name}`);
      } catch {
        log(`[FAIL] ${name}`);
        failed++;
      }
    }
  }

  return failed;
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const failed = runGates(resolveRoot(args.flags), {
    skipCommands: Boolean(args.flags['skip-commands']),
    profile: args.flags.profile ? String(args.flags.profile) : null,
  });
  console.log(failed === 0 ? '\nQuality gates: APROBADOS' : `\nQuality gates: ${failed} gate(s) FALLIDO(S)`);
  process.exit(failed === 0 ? 0 : 1);
}
