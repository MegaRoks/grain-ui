/** Склеивает имена классов, отбрасывая falsy-значения. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
