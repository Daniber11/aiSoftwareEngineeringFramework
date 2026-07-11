import { useMemo, useState } from 'react';
import { buildGreeting, GreetingError, type Locale } from '../domain/greeting.js';

export type GreetingState =
  { kind: 'idle' } | { kind: 'content'; greeting: string } | { kind: 'error'; message: string };

export interface UseGreetingResult {
  name: string;
  locale: Locale;
  state: GreetingState;
  setName: (name: string) => void;
  setLocale: (locale: Locale) => void;
}

/**
 * Hook que envuelve el dominio puro. Estado derivado con `useMemo`, igual
 * en espíritu al `computed` de la extensión angular: nunca se guarda el
 * saludo o el error en `useState` por separado, para no poder desincronizarse
 * del nombre/idioma actuales.
 */
export function useGreeting(initialName = ''): UseGreetingResult {
  const [name, setName] = useState(initialName);
  const [locale, setLocale] = useState<Locale>('es');

  const state = useMemo<GreetingState>(() => {
    const trimmed = name.trim();
    if (!trimmed) return { kind: 'idle' };
    try {
      return { kind: 'content', greeting: buildGreeting(trimmed, locale) };
    } catch (e) {
      if (e instanceof GreetingError) return { kind: 'error', message: e.message };
      throw e;
    }
  }, [name, locale]);

  return { name, locale, state, setName, setLocale };
}
