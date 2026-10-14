import { describe, expect, it } from 'vitest';
import {
  filterShopItems,
  paginateShopItems,
  SHOP_SORT,
  sortShopItems,
} from './shopModel.js';

describe('shopModel', () => {
  const sampleItems = [
    { id: '2', name: 'Zbroja płytowa', priceAmount: 100, isExtraLife: false },
    { id: '4', name: 'Produkt 10', priceAmount: 50, isExtraLife: false },
    { id: '1', name: 'Dodatkowe życie', priceAmount: 200, isExtraLife: true },
    { id: '3', name: 'Produkt 2', priceAmount: 50, isExtraLife: false },
  ];

  describe('sortShopItems', () => {
    it('zawsze umieszcza Dodatkowe życie (isExtraLife: true) na 1. miejscu', () => {
      const sorted = sortShopItems(sampleItems, SHOP_SORT.nameAsc);
      expect(sorted[0].isExtraLife).toBe(true);
      expect(sorted[0].name).toBe('Dodatkowe życie');
    });

    it('sortuje naturalnie po nazwie (Produkt 2 przed Produkt 10)', () => {
      const sorted = sortShopItems(sampleItems, SHOP_SORT.nameAsc);
      const names = sorted.map((item) => item.name);
      expect(names).toEqual([
        'Dodatkowe życie',
        'Produkt 2',
        'Produkt 10',
        'Zbroja płytowa',
      ]);
    });

    it('sortuje domyślnie według pozycji (stos/kolejność), zachowując Dodatkowe życie na początku', () => {
      const itemsWithPositions = [
        { id: '2', name: 'Zbroja', position: 2, isExtraLife: false },
        { id: '4', name: 'Eliksir', position: 4, isExtraLife: false },
        { id: '1', name: 'Dodatkowe życie', position: 1, isExtraLife: true },
        { id: '3', name: 'Amulet', position: 3, isExtraLife: false },
      ];
      const sorted = sortShopItems(itemsWithPositions, SHOP_SORT.default);
      expect(sorted.map((it) => it.position)).toEqual([1, 2, 3, 4]);
      expect(sorted.map((it) => it.name)).toEqual(['Dodatkowe życie', 'Zbroja', 'Amulet', 'Eliksir']);
    });

    it('sortuje po cenie rosnąco z tie-breakerem po nazwie i ID', () => {
      const sorted = sortShopItems(sampleItems, SHOP_SORT.priceAsc);
      // Dodatkowe życie na początku
      expect(sorted[0].name).toBe('Dodatkowe życie');

      // Dla produktów po 50 zł: "Produkt 2" (id 3) vs "Produkt 10" (id 4)
      expect(sorted[1].name).toBe('Produkt 2');
      expect(sorted[2].name).toBe('Produkt 10');
      expect(sorted[3].name).toBe('Zbroja płytowa');
    });

    it('sortuje po cenie malejąco', () => {
      const sorted = sortShopItems(sampleItems, SHOP_SORT.priceDesc);
      expect(sorted[0].name).toBe('Dodatkowe życie');
      expect(sorted[1].name).toBe('Zbroja płytowa');
    });

    it('jest odporny na brakujące właściwości i nie zwraca NaN', () => {
      const edgeItems = [
        { id: '1', name: null, priceAmount: null },
        { id: '2', name: 'Miecz', priceAmount: 25 },
        { id: '3', name: undefined, priceAmount: undefined },
      ];

      expect(() => sortShopItems(edgeItems, SHOP_SORT.nameAsc)).not.toThrow();
      expect(() => sortShopItems(edgeItems, SHOP_SORT.priceAsc)).not.toThrow();
    });
  });

  describe('filterShopItems', () => {
    it('filtruje po zapytaniu tekstowym', () => {
      const results = filterShopItems(sampleItems, { searchQuery: 'zbroja' });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Zbroja płytowa');
    });

    it('filtruje po kategorii', () => {
      const itemsWithCategories = [
        { id: '1', name: 'A', categories: ['potions'] },
        { id: '2', name: 'B', categories: ['weapons'] },
      ];
      const filtered = filterShopItems(itemsWithCategories, { categoryFilter: 'weapons' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });
  });

  describe('paginateShopItems', () => {
    it('dzieli elementy na strony', () => {
      const { page, totalPages, pageItems } = paginateShopItems(sampleItems, 1, 2);
      expect(page).toBe(1);
      expect(totalPages).toBe(2);
      expect(pageItems).toHaveLength(2);
    });
  });
});
