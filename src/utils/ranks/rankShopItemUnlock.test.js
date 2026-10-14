import { describe, it, expect } from 'vitest';
import {
  getRankShopItemIds,
  findRankOwningShopItem,
  buildShopItemOwnerMap,
  normalizeShopItemId,
} from './rankShopItemUnlock.js';

describe('rankShopItemUnlock', () => {
  describe('normalizeShopItemId', () => {
    it('normalizuje id do stringa i trimuje', () => {
      expect(normalizeShopItemId(123)).toBe('123');
      expect(normalizeShopItemId(' 456 ')).toBe('456');
    });
  });

  describe('getRankShopItemIds', () => {
    it('zwraca pustą tablicę dla pustych danych', () => {
      expect(getRankShopItemIds(null)).toEqual([]);
      expect(getRankShopItemIds(undefined)).toEqual([]);
      expect(getRankShopItemIds({})).toEqual([]);
    });

    it('obsługuje shopItems', () => {
      const rank = { shopItems: ['1', '2', 3] };
      expect(getRankShopItemIds(rank)).toEqual(['1', '2', '3']);
    });

    it('obsługuje uniqueStoreItems z backendu', () => {
      const rank = { uniqueStoreItems: ['10', 20] };
      expect(getRankShopItemIds(rank)).toEqual(['10', '20']);
    });
  });

  describe('buildShopItemOwnerMap', () => {
    it('tworzy mapę itemId -> rank dla frontendowych rang z shopItems', () => {
      const ranks = [
        { dbId: 1, name: 'Nowicjusz', icon: '🌱', shopItems: ['item-1', 'item-2'] },
        { dbId: 2, name: 'Mistrz', icon: '👑', shopItems: ['item-3'] },
      ];
      const map = buildShopItemOwnerMap(ranks);

      expect(map.get('item-1')?.name).toBe('Nowicjusz');
      expect(map.get('item-2')?.icon).toBe('🌱');
      expect(map.get('item-3')?.name).toBe('Mistrz');
      expect(map.get('item-non-existent')).toBeUndefined();
    });

    it('tworzy mapę itemId -> rank dla surowych rang z backendu (uniqueStoreItems i id)', () => {
      const ranks = [
        { id: 101, name: 'Adept', icon: '⭐', uniqueStoreItems: ['50', '51'] },
      ];
      const map = buildShopItemOwnerMap(ranks);

      expect(map.get('50')?.name).toBe('Adept');
      expect(map.get('51')?.icon).toBe('⭐');
    });

    it('pomija wykluczoną rangę przy excludeRankDbId', () => {
      const ranks = [
        { dbId: 1, name: 'Ranga 1', shopItems: ['item-1'] },
        { id: 2, name: 'Ranga 2', uniqueStoreItems: ['item-2'] },
      ];
      const map = buildShopItemOwnerMap(ranks, 1);
      expect(map.get('item-1')).toBeUndefined();
      expect(map.get('item-2')?.name).toBe('Ranga 2');
    });
  });

  describe('findRankOwningShopItem', () => {
    it('znajduje rangę odblokowującą przedmiot', () => {
      const ranks = [
        { dbId: 1, name: 'Nowicjusz', shopItems: ['100'] },
        { dbId: 2, name: 'Rycerz', shopItems: ['200'] },
      ];
      expect(findRankOwningShopItem(100, ranks)?.name).toBe('Nowicjusz');
      expect(findRankOwningShopItem('200', ranks)?.name).toBe('Rycerz');
      expect(findRankOwningShopItem(999, ranks)).toBeNull();
    });
  });
});
