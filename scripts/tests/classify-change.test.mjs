import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { classifyPath, classifyChange } from '../classify-change.mjs';

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aisef-policy-'));
  const write = (rel, content) => {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
  };
  write('FRAMEWORK.yaml', 'framework:\n  name: demo\n');
  write(
    '.ai/context/MODULES.md',
    [
      '# Índice de módulos',
      '',
      '| Módulo | Responsabilidad | Rutas | Contratos | Pruebas | Propietario |',
      '|---|---|---|---|---|---|',
      '| domain | Reglas de negocio | `src/domain/` | N/A | N/A | Equipo A |',
      '',
    ].join('\n'),
  );
  write(
    '.ai/decisions/adr/0001-decision-de-dominio.md',
    '# ADR-0001: Decisión de dominio\n\n- Estado: Aceptado\n- Alcance: `src/domain/`\n',
  );
  return root;
}

test('classifyPath: un archivo de dominio ordinario no requiere aprobación', () => {
  const root = makeFixture();
  const result = classifyPath(root, 'src/domain/greeting.ts');
  assert.equal(result.requires_approval, false);
  assert.equal(result.module, 'domain');
  assert.equal(result.related_accepted_adrs.length, 1);
});

test('classifyPath: package.json requiere aprobación (dependencia estructural)', () => {
  const root = makeFixture();
  const result = classifyPath(root, 'package.json');
  assert.equal(result.requires_approval, true);
  assert.equal(result.matched_rules[0].id, 'dependency-manifest');
});

test('classifyPath: pyproject.toml y build.gradle también son manifiestos de dependencias', () => {
  const root = makeFixture();
  assert.equal(classifyPath(root, 'examples/x/pyproject.toml').requires_approval, true);
  assert.equal(classifyPath(root, 'examples/x/build.gradle').requires_approval, true);
});

test('classifyPath: un workflow de GitHub Actions requiere aprobación', () => {
  const root = makeFixture();
  const result = classifyPath(root, '.github/workflows/release.yml');
  assert.equal(result.requires_approval, true);
  assert.equal(result.matched_rules[0].policy, 'Cambios de infraestructura de producción');
});

test('classifyPath: eliminar un archivo requiere aprobación por estado D', () => {
  const root = makeFixture();
  const result = classifyPath(root, 'src/domain/greeting.ts:D');
  assert.equal(result.requires_approval, true);
  assert.equal(result.matched_rules[0].id, 'file-removed');
});

test('classifyPath: modificar (M, por defecto) el mismo archivo no dispara la regla de eliminación', () => {
  const root = makeFixture();
  const result = classifyPath(root, 'src/domain/greeting.ts');
  assert.equal(result.status, 'M');
  assert.ok(!result.matched_rules.some((r) => r.id === 'file-removed'));
});

test('classifyPath: una ruta con "migrations/" requiere aprobación', () => {
  const root = makeFixture();
  const result = classifyPath(root, 'db/migrations/0007_add_column.sql');
  assert.equal(result.requires_approval, true);
  assert.equal(result.matched_rules[0].id, 'destructive-migration');
});

test('classifyChange: el veredicto agregado es el peor caso del conjunto', () => {
  const root = makeFixture();
  const onlyClean = classifyChange(root, ['src/domain/a.ts', 'src/domain/b.ts']);
  assert.equal(onlyClean.verdict, 'PUEDE_EJECUTAR_SIN_APROBACION');

  const mixed = classifyChange(root, ['src/domain/a.ts', 'package.json']);
  assert.equal(mixed.verdict, 'DEBE_PROPONER_ANTES_DE_EJECUTAR');
  assert.equal(mixed.items.length, 2);
});
