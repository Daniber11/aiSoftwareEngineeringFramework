import { useGreeting } from './useGreeting.js';

/**
 * Componente delgado: toda la lógica vive en el hook. Sigue el patrón de
 * la extensión react (estado de servidor/cliente fuera del componente,
 * componente enfocado en presentación).
 */
export function GreetingForm() {
  const { name, state, setName } = useGreeting();

  return (
    <form>
      <label>
        Nombre
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      {state.kind === 'content' && <p>{state.greeting}</p>}
      {state.kind === 'error' && <p role="alert">{state.message}</p>}
      {state.kind === 'idle' && <p role="status">Escribe un nombre.</p>}
    </form>
  );
}
