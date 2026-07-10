/**
 * Helpers compartidos por todos los validadores del framework.
 * Solo biblioteca estándar de Node.js (ver ADR-0001).
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/* ----------------------------- CLI ----------------------------- */

/** Determina si el módulo fue invocado directamente (`node script.mjs`). */
export function isMain(importMetaUrl) {
  if (!process.argv[1]) return false;
  const invoked = pathToFileURL(path.resolve(process.argv[1])).href;
  return invoked.toLowerCase() === importMetaUrl.toLowerCase();
}

/** Parseo mínimo de argumentos: posicionales + banderas `--clave[=valor]`. */
export function parseArgs(argv) {
  const args = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq >= 0) {
        args.flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        args.flags[a.slice(2)] = argv[++i];
      } else {
        args.flags[a.slice(2)] = true;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

/** Localiza la raíz del repositorio subiendo hasta encontrar FRAMEWORK.yaml. */
export function findRepoRoot(start = process.cwd()) {
  let dir = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(dir, 'FRAMEWORK.yaml'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/** Resuelve la raíz a usar: bandera --root o búsqueda ascendente. */
export function resolveRoot(flags = {}) {
  if (flags.root) {
    const root = path.resolve(String(flags.root));
    if (!fs.existsSync(path.join(root, 'FRAMEWORK.yaml'))) {
      throw new Error(`No existe FRAMEWORK.yaml en --root: ${root}`);
    }
    return root;
  }
  const root = findRepoRoot();
  if (!root) throw new Error('No se encontró FRAMEWORK.yaml hacia arriba desde el directorio actual.');
  return root;
}

/* --------------------------- Reporter --------------------------- */

export class Reporter {
  constructor() {
    this.items = [];
  }
  error(msg, file) { this.items.push({ level: 'error', msg, file }); }
  warn(msg, file) { this.items.push({ level: 'warn', msg, file }); }
  ok(msg) { this.items.push({ level: 'ok', msg }); }
  get errors() { return this.items.filter((i) => i.level === 'error').length; }
  get warnings() { return this.items.filter((i) => i.level === 'warn').length; }
  print({ okAlso = true } = {}) {
    const tag = { error: '[FAIL]', warn: '[WARN]', ok: '[ OK ]' };
    for (const item of this.items) {
      if (item.level === 'ok' && !okAlso) continue;
      const where = item.file ? ` (${item.file})` : '';
      console.log(`${tag[item.level]} ${item.msg}${where}`);
    }
  }
  summary(name) {
    return `${name}: ${this.errors} error(es), ${this.warnings} advertencia(s)`;
  }
}

/* ------------------------ YAML (subconjunto) ------------------------ */

function coerceScalar(raw) {
  const v = raw.trim();
  if (v === '' || v === '~' || v === 'null') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  if (/^-?\d+$/.test(v)) return Number.parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v)) return Number.parseFloat(v);
  return v;
}

function stripInlineComment(value) {
  // Solo elimina comentarios fuera de comillas; el manifiesto no usa '#' en valores.
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (c === "'" && !inDouble) inSingle = !inSingle;
    else if (c === '"' && !inSingle) inDouble = !inDouble;
    else if (c === '#' && !inSingle && !inDouble && (i === 0 || value[i - 1] === ' ')) {
      return value.slice(0, i);
    }
  }
  return value;
}

/**
 * Parser del subconjunto YAML permitido en FRAMEWORK.yaml (ver ADR-0001):
 * mapas anidados por indentación, escalares y listas simples de `- valor`.
 * No soporta anclas, alias, multilínea ni colecciones en línea.
 */
export function parseYamlSubset(text) {
  const root = {};
  // Cada nivel: { indent, node, attach(nuevoNodo) } para poder convertir {} en [].
  const stack = [{ indent: -1, node: root, attach: null }];
  const lines = text.split(/\r?\n/);

  for (let n = 0; n < lines.length; n++) {
    const rawLine = lines[n];
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;
    const indent = rawLine.length - rawLine.trimStart().length;
    const line = stripInlineComment(rawLine.trim()).trim();
    if (!line) continue;

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const top = stack[stack.length - 1];

    if (line.startsWith('- ') || line === '-') {
      if (!Array.isArray(top.node)) {
        if (typeof top.node === 'object' && top.node !== null && Object.keys(top.node).length === 0 && top.attach) {
          const arr = [];
          top.attach(arr);
          top.node = arr;
        } else {
          throw new Error(`Línea ${n + 1}: lista en posición inválida.`);
        }
      }
      top.node.push(coerceScalar(line === '-' ? '' : line.slice(2)));
      continue;
    }

    const sep = line.indexOf(':');
    if (sep < 0) throw new Error(`Línea ${n + 1}: se esperaba "clave: valor" y se encontró "${line}".`);
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();

    if (Array.isArray(top.node)) throw new Error(`Línea ${n + 1}: clave dentro de una lista simple.`);

    if (value === '') {
      const child = {};
      top.node[key] = child;
      const container = top.node;
      stack.push({ indent, node: child, attach: (replacement) => { container[key] = replacement; } });
    } else {
      top.node[key] = coerceScalar(value);
    }
  }
  return root;
}

/** Lee y parsea FRAMEWORK.yaml de la raíz dada. Lanza si no existe o es inválido. */
export function readManifest(root) {
  const file = path.join(root, 'FRAMEWORK.yaml');
  return parseYamlSubset(fs.readFileSync(file, 'utf8'));
}

/** true si el proyecto está en fase bootstrap (validación relajada, ADR-0002). */
export function isBootstrap(manifest) {
  return manifest?.project?.status === 'bootstrap';
}

/** true si la raíz es el propio repositorio del framework (perfil completo). */
export function isFrameworkRepo(manifest) {
  return manifest?.project?.type === 'methodology-template';
}

/* -------------------------- Archivos -------------------------- */

export const DEFAULT_EXCLUDED_DIRS = new Set(['.git', 'node_modules', '.idea', '.vscode', 'dist', 'build', 'coverage']);

/** Recorre archivos bajo root, devolviendo rutas relativas con separador '/'. */
export function walkFiles(root, { exts = null, excludeDirs = DEFAULT_EXCLUDED_DIRS } = {}) {
  const out = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!excludeDirs.has(entry.name)) visit(abs);
      } else if (entry.isFile()) {
        if (!exts || exts.includes(path.extname(entry.name).toLowerCase())) {
          out.push(path.relative(root, abs).split(path.sep).join('/'));
        }
      }
    }
  };
  visit(root);
  return out.sort();
}

/* -------------------------- Markdown -------------------------- */

/** Reemplaza bloques cercados y spans de código por espacios, preservando líneas. */
export function stripCodeSegments(markdown) {
  const lines = markdown.split('\n');
  let inFence = false;
  const out = lines.map((line) => {
    const fence = /^\s*(```|~~~)/.test(line);
    if (fence) {
      inFence = !inFence;
      return '';
    }
    if (inFence) return '';
    return line.replace(/`[^`]*`/g, (m) => ' '.repeat(m.length));
  });
  return out.join('\n');
}

/**
 * Extrae enlaces Markdown locales `[texto](destino)`.
 * Ignora URLs absolutas, mailto y anclas puras.
 */
export function extractMarkdownLinks(markdown) {
  const links = [];
  const noCode = stripCodeSegments(markdown);
  const lines = noCode.split('\n');
  const re = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  lines.forEach((line, idx) => {
    let m;
    while ((m = re.exec(line)) !== null) {
      const target = m[1];
      if (/^(https?:|mailto:|#)/i.test(target)) continue;
      links.push({ target, line: idx + 1 });
    }
  });
  return links;
}

/* ------------------------ Placeholders ------------------------ */

/** Rutas (relativas, con '/') siempre excluidas del escaneo de placeholders. */
export const PLACEHOLDER_EXCLUDED_PATHS = [
  'scripts/templates/',
  '.ai/templates/',
  '.ai/decisions/adr/0000-template.md',
];

export function isPlaceholderExcluded(relPath) {
  return PLACEHOLDER_EXCLUDED_PATHS.some((p) => (p.endsWith('/') ? relPath.startsWith(p) : relPath === p));
}
