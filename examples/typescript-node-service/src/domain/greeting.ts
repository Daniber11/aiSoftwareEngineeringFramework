/**
 * Dominio de saludo: puro, sin I/O y sin dependencias de framework.
 * Refleja la misma regla que examples/minimal-service, en TypeScript
 * estricto, para demostrar el patrón de la extensión typescript-node.
 */

export class GreetingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GreetingError';
  }
}

const TEMPLATES = {
  es: (name: string) => `Hola, ${name}.`,
  en: (name: string) => `Hello, ${name}.`,
} as const;

export type Locale = keyof typeof TEMPLATES;
export const SUPPORTED_LOCALES = Object.keys(TEMPLATES) as Locale[];

const MAX_NAME_LENGTH = 80;
const VALID_NAME = /^[\p{L}][\p{L}' -]*$/u;

function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as string[]).includes(value);
}

export function buildGreeting(name: string, locale: string = 'es'): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new GreetingError('El nombre es obligatorio.');
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new GreetingError(`El nombre supera ${MAX_NAME_LENGTH} caracteres.`);
  }
  if (!VALID_NAME.test(trimmed)) {
    throw new GreetingError('El nombre contiene caracteres no permitidos.');
  }
  if (!isSupportedLocale(locale)) {
    throw new GreetingError(`Idioma no soportado: se admite ${SUPPORTED_LOCALES.join(', ')}.`);
  }
  return TEMPLATES[locale](trimmed);
}
