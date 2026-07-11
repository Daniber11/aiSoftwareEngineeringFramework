import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { matchModules, matchAdrs, resolveContext } from '../resolve-context.mjs';

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aisef-context-'));
  const write = (rel, content) => {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
  };
  write('FRAMEWORK.yaml', 'framework:\n  name: demo\n');
  write('.ai/context/CURRENT_CONTEXT.md', '# Contexto\n');
  write('.ai/governance/DECISION_POLICY.md', '# Política\n');
  write(
    '.ai/context/MODULES.md',
    [
      '# Índice de módulos',
      '',
      '| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |',
      '|---|---|---|---|---|---|',
      '| domain | Reglas de negocio | `src/domain/` | Funciones puras | `test/domain.test.ts` | Equipo A |',
      '| http | Adaptador HTTP | `src/server.ts` | Endpoints REST | `test/server.test.ts` | Equipo B |',
      '',
    ].join('\n'),
  );
  write(
    '.ai/decisions/adr/0000-template.md',
    '# ADR-0000: Título\n\n- Estado: Propuesto\n- Alcance: `plantilla/no-real`\n',
  );
  write(
    '.ai/decisions/adr/0001-validacion-en-el-dominio.md',
    '# ADR-0001: Validación en el dominio\n\n- Estado: Aceptado\n- Alcance: `src/domain/`\n',
  );
  return root;
}

test('matchModules: encuentra el módulo cuya ruta es prefijo del archivo dado', () => {
  const root = makeFixture();
  const matches = matchModules(root, 'src/domain/greeting.ts');
  assert.equal(matches.length, 1);
  assert.equal(matches[0].module, 'domain');
});

test('matchModules: coincidencia exacta de archivo', () => {
  const root = makeFixture();
  const matches = matchModules(root, 'src/server.ts');
  assert.equal(matches.length, 1);
  assert.equal(matches[0].module, 'http');
});

test('matchModules: sin coincidencia devuelve vacío, no lanza', () => {
  const root = makeFixture();
  assert.deepEqual(matchModules(root, 'docs/README.md'), []);
});

test('matchModules: no confunde prefijos parciales de nombre de carpeta', () => {
  const root = makeFixture();
  // "src/domain-extra" no debe matchear "src/domain/" (el matching exige '/' como separador).
  assert.deepEqual(matchModules(root, 'src/domain-extra/file.ts'), []);
});

test('matchAdrs: encuentra el ADR cuyo Alcance cubre la ruta, ignora la plantilla', () => {
  const root = makeFixture();
  const matches = matchAdrs(root, 'src/domain/greeting.ts');
  assert.equal(matches.length, 1);
  assert.equal(matches[0].file, '.ai/decisions/adr/0001-validacion-en-el-dominio.md');
  assert.equal(matches[0].state, 'Aceptado');
});

test('resolveContext: combina always_read, módulos y ADR en un solo resultado', () => {
  const root = makeFixture();
  const result = resolveContext(root, 'src/domain/greeting.ts');
  assert.ok(result.always_read.includes('FRAMEWORK.yaml'));
  assert.equal(result.modules.length, 1);
  assert.equal(result.adrs.length, 1);
  assert.equal(result.path, 'src/domain/greeting.ts');
});
