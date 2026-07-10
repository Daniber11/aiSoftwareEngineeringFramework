import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseYamlSubset, stripCodeSegments, extractMarkdownLinks } from '../lib/core.mjs';
import { slugify } from '../new-adr.mjs';

test('parseYamlSubset: mapas anidados, escalares y comentarios', () => {
  const doc = [
    '# comentario inicial',
    'framework:',
    '  name: AI Software Engineering Framework',
    '  version: 1.1.0',
    '  specification_version: 1',
    '  model_agnostic: true',
    'project:',
    '  name: demo',
    '  empty_value:',
    '    nested: "texto entre comillas"',
    'nivel: medium # comentario en línea',
  ].join('\n');
  const parsed = parseYamlSubset(doc);
  assert.equal(parsed.framework.name, 'AI Software Engineering Framework');
  assert.equal(parsed.framework.version, '1.1.0');
  assert.equal(parsed.framework.specification_version, 1);
  assert.equal(parsed.framework.model_agnostic, true);
  assert.equal(parsed.project.empty_value.nested, 'texto entre comillas');
  assert.equal(parsed.nivel, 'medium');
});

test('parseYamlSubset: listas simples', () => {
  const parsed = parseYamlSubset('items:\n  - uno\n  - 2\n  - true\n');
  assert.deepEqual(parsed.items, ['uno', 2, true]);
});

test('parseYamlSubset: rechaza líneas sin clave', () => {
  assert.throws(() => parseYamlSubset('esto no es yaml valido\n'), /clave: valor/);
});

test('stripCodeSegments: elimina bloques cercados y spans preservando líneas', () => {
  const md = 'texto CHANGE_VISIBLE\n```\nCHANGE_OCULTO\n```\ninline `CHANGE_OCULTO` fin\n';
  const out = stripCodeSegments(md);
  assert.match(out, /CHANGE_VISIBLE/);
  assert.doesNotMatch(out, /CHANGE_OCULTO/);
  assert.equal(out.split('\n').length, md.split('\n').length);
});

test('extractMarkdownLinks: solo enlaces locales', () => {
  const md = [
    '[local](docs/GUIA.md) y [externo](https://example.com) y [ancla](#seccion)',
    '[correo](mailto:a@b.c) y [otro local](../FRAMEWORK.yaml#authority)',
    '`[en codigo](no/existe.md)`',
  ].join('\n');
  const links = extractMarkdownLinks(md).map((l) => l.target);
  assert.deepEqual(links, ['docs/GUIA.md', '../FRAMEWORK.yaml#authority']);
});

test('slugify: minúsculas, sin acentos ni símbolos', () => {
  assert.equal(slugify('Decisión de Autenticación (v2)'), 'decision-de-autenticacion-v2');
});
