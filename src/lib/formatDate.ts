/**
 * Formato legible: "día de mes de año" (ej. "1 de noviembre de 2025").
 * Acepta YYYY-MM o YYYY-MM-DD; para YYYY-MM usa el día 1.
 */
export function formatDateDayMonthYear(value: string): string {
  const iso = value.length === 7 ? `${value}-01` : value;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
