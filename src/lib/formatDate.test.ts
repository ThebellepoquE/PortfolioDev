import { describe, it, expect } from 'vitest';
import { formatDateDayMonthYear } from './formatDate';

describe('formatDateDayMonthYear', () => {
  it('formatea fecha completa YYYY-MM-DD en español', () => {
    const result = formatDateDayMonthYear('2025-11-01');
    expect(result).toBe('1 de noviembre de 2025');
  });

  it('formatea fecha corta YYYY-MM asumiendo día 1', () => {
    const result = formatDateDayMonthYear('2025-11');
    expect(result).toBe('1 de noviembre de 2025');
  });

  it('devuelve el valor original si la fecha es inválida', () => {
    const result = formatDateDayMonthYear('not-a-date');
    expect(result).toBe('not-a-date');
  });

  it('formatea correctamente diciembre (borde)', () => {
    const result = formatDateDayMonthYear('2025-12-31');
    expect(result).toBe('31 de diciembre de 2025');
  });
});
