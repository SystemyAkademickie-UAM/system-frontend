import { describe, expect, it } from 'vitest';
import { mapBackendShopItems } from './shopItemMapper.js';

describe('shopItemMapper', () => {
  it('mapuje i przypisuje pozycje jak na stosie: Dodatkowe życie na początku, reszta wg kolejności dodania (ID)', () => {
    // Symulacja produktów pobranych z bazy danych
    const backendItems = [
      { id: 2, name: 'Złoty miecz', listing: { basePrice: 100 } },
      { id: 4, name: 'Amulet siły', listing: { basePrice: 50 } },
      { id: 1, name: 'Dodatkowe życie', isExtraLife: true, listing: { basePrice: 200 } },
      { id: 3, name: 'Buteleczka many', listing: { basePrice: 25 } },
    ];

    const mapped = mapBackendShopItems(backendItems);

    expect(mapped).toHaveLength(4);
    // Dodatkowe życie zawsze pierwsze
    expect(mapped[0].isExtraLife).toBe(true);
    expect(mapped[0].name).toBe('Dodatkowe życie');
    expect(mapped[0].position).toBe(1);

    // Pozostałe ułożone w porządku dodawania (rosnąco po ID bazy danych):
    // id 2 -> pozycja 2
    expect(mapped[1].name).toBe('Złoty miecz');
    expect(mapped[1].position).toBe(2);

    // id 3 -> pozycja 3
    expect(mapped[2].name).toBe('Buteleczka many');
    expect(mapped[2].position).toBe(3);

    // id 4 -> pozycja 4
    expect(mapped[3].name).toBe('Amulet siły');
    expect(mapped[3].position).toBe(4);
  });

  it('dodanie kolejnego produktu nadaje mu kolejny numer na końcu stosu', () => {
    const backendItems = [
      { id: 1, name: 'Produkt 1', listing: { basePrice: 10 } },
      { id: 2, name: 'Produkt 2', listing: { basePrice: 20 } },
      { id: 3, name: 'Produkt 3', listing: { basePrice: 30 } },
      { id: 4, name: 'Produkt 4', listing: { basePrice: 40 } },
      // Nowo dodany piąty produkt o nazwie alfabetycznie "wcześniejszej" niż pozostałe
      { id: 5, name: 'Amulet nowy', listing: { basePrice: 50 } },
    ];

    const mapped = mapBackendShopItems(backendItems);

    // Nowy produkt ma nr 5 na końcu, a nie nr 1 lub 3
    expect(mapped[4].name).toBe('Amulet nowy');
    expect(mapped[4].position).toBe(5);
  });

  it('zwraca pustą tablicę dla pustych lub niepoprawnych danych', () => {
    expect(mapBackendShopItems(null)).toEqual([]);
    expect(mapBackendShopItems(undefined)).toEqual([]);
    expect(mapBackendShopItems([])).toEqual([]);
  });
});
