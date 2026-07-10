/**
 * Registro único de validadores del framework, en orden de ejecución.
 * Consumido por health-score.mjs y quality-gates.mjs.
 */
import { run as structure } from '../validate-structure.mjs';
import { run as manifest } from '../validate-manifest.mjs';
import { run as links } from '../validate-links.mjs';
import { run as context } from '../validate-context.mjs';
import { run as modules } from '../validate-modules.mjs';
import { run as placeholders } from '../check-placeholders.mjs';

export const CHECKS = [
  { id: 'structure', title: 'Estructura de archivos obligatorios', weight: 20, run: structure },
  { id: 'manifest', title: 'Esquema de FRAMEWORK.yaml', weight: 20, run: manifest },
  { id: 'links', title: 'Enlaces e inventario', weight: 15, run: links },
  { id: 'context', title: 'Contexto activo', weight: 15, run: context },
  { id: 'modules', title: 'Índice de módulos', weight: 15, run: modules },
  { id: 'placeholders', title: 'Placeholders y pendientes', weight: 15, run: placeholders },
];
