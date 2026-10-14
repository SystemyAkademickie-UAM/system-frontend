import { describe, expect, it } from 'vitest';
import {
  compareRowsByColumn,
  compareSortValues,
  cycleSortRule,
  sortRows,
} from './dataTableSort.js';

describe('dataTableSort', () => {
  describe('compareSortValues', () => {
    it('sortuje liczby poprawnie i bezpiecznie radzi sobie z null / undefined / NaN / pustym ciągiem', () => {
      expect(compareSortValues(10, 20, 'number')).toBeLessThan(0);
      expect(compareSortValues(20, 10, 'number')).toBeGreaterThan(0);
      expect(compareSortValues(15, 15, 'number')).toBe(0);

      // Puste wartości powinny iść na koniec, a nie zwracać NaN
      expect(compareSortValues(null, 10, 'number')).toBe(1);
      expect(compareSortValues(10, null, 'number')).toBe(-1);
      expect(compareSortValues(undefined, 10, 'number')).toBe(1);
      expect(compareSortValues('nieliczba', 10, 'number')).toBe(1);
      expect(compareSortValues(null, undefined, 'number')).toBe(0);
      expect(Number.isNaN(compareSortValues(null, 10, 'number'))).toBe(false);
    });

    it('sortuje tekst naturalnie (z uwzględnieniem liczb) i jest odporny na null / undefined', () => {
      // Naturalne sortowanie: "Produkt 2" powinien być PRZED "Produkt 10"
      expect(compareSortValues('Produkt 2', 'Produkt 10', 'text')).toBeLessThan(0);
      expect(compareSortValues('Produkt 10', 'Produkt 2', 'text')).toBeGreaterThan(0);

      // Bezpieczeństwo null / undefined
      expect(compareSortValues(null, 'A', 'text')).toBe(1);
      expect(compareSortValues('A', null, 'text')).toBe(-1);
      expect(compareSortValues(null, undefined, 'text')).toBe(0);
    });

    it('obsługuje sortowanie niestandardowe (custom)', () => {
      const customSort = { type: 'custom', order: ['low', 'medium', 'high'] };
      expect(compareSortValues('low', 'high', customSort)).toBeLessThan(0);
      expect(compareSortValues('high', 'low', customSort)).toBeGreaterThan(0);
      expect(compareSortValues('medium', 'medium', customSort)).toBe(0);
    });
  });

  describe('cycleSortRule', () => {
    it('pojedyncze kliknięcie (isMulti=false) cyklicznie przełącza: asc -> desc -> brak', () => {
      let rules = [];

      rules = cycleSortRule(rules, 'name', false);
      expect(rules).toEqual([{ key: 'name', direction: 'asc' }]);

      rules = cycleSortRule(rules, 'name', false);
      expect(rules).toEqual([{ key: 'name', direction: 'desc' }]);

      rules = cycleSortRule(rules, 'name', false);
      expect(rules).toEqual([]);
    });

    it('pojedyncze kliknięcie w INNĄ kolumnę ZASTĘPUJE poprzednie sortowanie, zamiast doklejać je w tle', () => {
      let rules = [{ key: 'name', direction: 'asc' }];

      // Użytkownik posortował po nazwie, a teraz klika CENA
      rules = cycleSortRule(rules, 'price', false);
      expect(rules).toEqual([{ key: 'price', direction: 'asc' }]);

      // Kolejne kliknięcie w CENA przełącza na malejąco
      rules = cycleSortRule(rules, 'price', false);
      expect(rules).toEqual([{ key: 'price', direction: 'desc' }]);
    });

    it('kliknięcie z Shift (isMulti=true) pozwala na wielopoziomowy multi-sort', () => {
      let rules = [{ key: 'category', direction: 'asc' }];

      // Shift+Click na price dodaje drugą regułę
      rules = cycleSortRule(rules, 'price', true);
      expect(rules).toEqual([
        { key: 'category', direction: 'asc' },
        { key: 'price', direction: 'asc' },
      ]);

      // Shift+Click na price przełącza drugą regułę na desc
      rules = cycleSortRule(rules, 'price', true);
      expect(rules).toEqual([
        { key: 'category', direction: 'asc' },
        { key: 'price', direction: 'desc' },
      ]);

      // Shift+Click na price usuwa drugą regułę
      rules = cycleSortRule(rules, 'price', true);
      expect(rules).toEqual([{ key: 'category', direction: 'asc' }]);
    });
  });

  describe('sortRows', () => {
    const columns = [
      { key: 'id', sort: 'number' },
      { key: 'name', sort: 'text' },
      { key: 'price', sort: 'number' },
    ];

    const rows = [
      { id: 1, name: 'Topór', price: 50 },
      { id: 2, name: 'Miecz', price: 20 },
      { id: 3, name: 'Tarcza', price: 20 },
      { id: 4, name: 'Eliksir', price: 10 },
    ];

    it('sortuje po pojedynczej kolumnie rosnąco i malejąco', () => {
      const sortedByPriceAsc = sortRows(rows, [{ key: 'price', direction: 'asc' }], columns, 'id');
      expect(sortedByPriceAsc.map((r) => r.id)).toEqual([4, 2, 3, 1]);

      const sortedByPriceDesc = sortRows(rows, [{ key: 'price', direction: 'desc' }], columns, 'id');
      expect(sortedByPriceDesc[0].id).toBe(1);
      expect(sortedByPriceDesc[3].id).toBe(4);
    });

    it('rozstrzyga remisy tie-breakerem', () => {
      const sorted = sortRows(rows, [{ key: 'price', direction: 'asc' }], columns, 'name');
      // Dla ceny 20 zł: Miecz vs Tarcza -> Miecz przed Tarcza
      expect(sorted[1].name).toBe('Miecz');
      expect(sorted[2].name).toBe('Tarcza');
    });
  });
});
