import { Injectable } from '@angular/core';
import {
  buildGreeting,
  GreetingError,
  type Locale,
  SUPPORTED_LOCALES,
} from '../domain/greeting.js';

/**
 * Envuelve el dominio puro en un servicio inyectable de Angular.
 * No hace I/O: la extensión angular documenta HttpClient para casos con
 * backend real (ver README de la extensión); este ejemplo mantiene el
 * mismo alcance cero-red que minimal-service y typescript-node-service.
 */
@Injectable({ providedIn: 'root' })
export class GreetingService {
  readonly supportedLocales: readonly Locale[] = SUPPORTED_LOCALES;

  greet(name: string, locale: string): string {
    return buildGreeting(name, locale);
  }
}

export { GreetingError };
