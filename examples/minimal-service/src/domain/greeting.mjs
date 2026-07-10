/**
 * Dominio de saludo: puro, sin I/O y sin conocimiento del transporte.
 * La validación vive aquí porque es una regla del dominio; el adaptador
 * decide cómo traducir los errores al protocolo.
 */

export class GreetingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GreetingError';
  }
}

const TEMPLATES = {
  es: (name) => `Hola, ${name}.`,
  en: (name) => `Hello, ${name}.`,
};

export const SUPPORTED_LOCALES = Object.keys(TEMPLATES);

const MAX_NAME_LENGTH = 80;
// Letras (incluye acentos vía \p{L}), espacios, apóstrofos y guiones.
const VALID_NAME = /^[\p{L}][\p{L}' -]*$/u;

export function buildGreeting(name, locale = 'es') {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new GreetingError('El nombre es obligatorio.');
  }
  const trimmed = name.trim();
  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new GreetingError(`El nombre supera ${MAX_NAME_LENGTH} caracteres.`);
  }
  if (!VALID_NAME.test(trimmed)) {
    throw new GreetingError('El nombre contiene caracteres no permitidos.');
  }
  const template = TEMPLATES[locale];
  if (!template) {
    throw new GreetingError(`Idioma no soportado: se admite ${SUPPORTED_LOCALES.join(', ')}.`);
  }
  return template(trimmed);
}
