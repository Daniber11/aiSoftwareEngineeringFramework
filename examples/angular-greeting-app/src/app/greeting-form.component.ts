import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GreetingError, GreetingService } from './greeting.service.js';

type GreetingState =
  { kind: 'idle' } | { kind: 'content'; greeting: string } | { kind: 'error'; message: string };

/**
 * Standalone, OnPush, estado por signals — el patrón recomendado por la
 * extensión angular. Sin plantilla externa: la vista vive inline para que
 * este ejemplo no necesite empaquetador ni Angular CLI para ejecutarse,
 * solo tsx/tsc (ver ADR-0001 de este ejemplo).
 */
@Component({
  selector: 'app-greeting-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label>
      Nombre
      <input [value]="name()" (input)="onNameChange($event)" />
    </label>
    @switch (state().kind) {
      @case ('content') {
        <p>{{ contentMessage() }}</p>
      }
      @case ('error') {
        <p role="alert">{{ errorMessage() }}</p>
      }
      @default {
        <p role="status">Escribe un nombre.</p>
      }
    }
  `,
})
export class GreetingFormComponent {
  private readonly greetingService = inject(GreetingService);

  readonly name = signal('');
  readonly locale = signal<string>('es');

  readonly state = computed<GreetingState>(() => {
    const trimmed = this.name().trim();
    if (!trimmed) return { kind: 'idle' };
    try {
      return { kind: 'content', greeting: this.greetingService.greet(trimmed, this.locale()) };
    } catch (e) {
      if (e instanceof GreetingError) return { kind: 'error', message: e.message };
      throw e;
    }
  });

  readonly contentMessage = computed(() => {
    const s = this.state();
    return s.kind === 'content' ? s.greeting : '';
  });

  readonly errorMessage = computed(() => {
    const s = this.state();
    return s.kind === 'error' ? s.message : '';
  });

  onNameChange(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }

  setLocale(locale: string): void {
    this.locale.set(locale);
  }
}
