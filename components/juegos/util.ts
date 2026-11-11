// Ayudas compartidas por los juegos.

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// El récord se guarda en el navegador de cada alumno. Si el navegador no deja
// (modo incógnito, etc.), el juego sigue andando igual, solo que sin récord.
export function readBest(key: string): number | null {
  try {
    const v = localStorage.getItem(key);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}

export function saveBest(key: string, value: number, lowerIsBetter = false): boolean {
  const prev = readBest(key);
  const isRecord = prev === null || (lowerIsBetter ? value < prev : value > prev);
  if (isRecord) {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      /* sin récord, no pasa nada */
    }
  }
  return isRecord;
}
