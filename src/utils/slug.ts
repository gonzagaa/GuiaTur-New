const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugify(cityName: string, state: string): string {
  const cityPart = normalize(cityName);
  const statePart = normalize(state);
  if (!statePart) return cityPart;
  return `${cityPart}-${statePart}`;
}
