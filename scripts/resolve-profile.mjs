/**
 * Resuelve y muestra la configuración efectiva de un perfil declarado en
 * FRAMEWORK.yaml (sección `profiles`). No modifica nada: es una herramienta
 * de inspección para que un humano o el CI de un proyecto adoptante decidan
 * qué gates y comandos aplicar según el ambiente activo.
 *
 * Uso: node scripts/resolve-profile.mjs <perfil> [--root <ruta>] [--json]
 */
import { isMain, parseArgs, resolveRoot, readManifest, resolveProfile } from './lib/core.mjs';

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const profileName = args._[0];
  if (!profileName) {
    console.error('[FAIL] Uso: node scripts/resolve-profile.mjs <perfil> [--root <ruta>] [--json]');
    process.exit(1);
  }
  try {
    const root = resolveRoot(args.flags);
    const manifest = readManifest(root);
    const resolved = resolveProfile(manifest, profileName);
    const summary = {
      profile: profileName,
      quality_gates: resolved.quality_gates,
      ai: resolved.ai,
      commands: resolved.commands,
    };
    if (args.flags.json) {
      console.log(JSON.stringify(summary, null, 2));
    } else {
      console.log(`Perfil resuelto: ${profileName}`);
      console.log('\nquality_gates:');
      for (const [k, v] of Object.entries(summary.quality_gates ?? {})) console.log(`  ${k}: ${v}`);
      console.log('\nai:');
      for (const [k, v] of Object.entries(summary.ai ?? {})) console.log(`  ${k}: ${v}`);
      console.log('\ncommands:');
      for (const [k, v] of Object.entries(summary.commands ?? {})) console.log(`  ${k}: ${v}`);
    }
  } catch (e) {
    console.error(`[FAIL] ${e.message}`);
    process.exit(1);
  }
}
