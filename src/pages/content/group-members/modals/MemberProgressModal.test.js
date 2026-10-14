import { describe, expect, it } from 'vitest';
import { formatProgressStages } from './MemberProgressModal.jsx';

describe('MemberProgressModal - formatProgressStages', () => {
  it('zachowuje kolejność etapów ustaloną na stronie /activities (nie odwraca ich po ID)', () => {
    // Etapy poukładane przez prowadzącego na /activities w niestandardowej kolejności
    const stagesFromBackend = [
      { id: 10, name: 'Etap C', activities: [] },
      { id: 2, name: 'Etap A', activities: [] },
      { id: 7, name: 'Etap B', activities: [] },
    ];

    const formatted = formatProgressStages(stagesFromBackend);

    expect(formatted.map((stage) => stage.id)).toEqual([10, 2, 7]);
    expect(formatted.map((stage) => stage.name)).toEqual(['Etap C', 'Etap A', 'Etap B']);
  });

  it('sortuje aktywności wewnątrz etapu w kolejności zgodnej z /activities (rosnąco po ID)', () => {
    const stageWithActivities = [
      {
        id: 1,
        name: 'Etap 1',
        activities: [
          { id: 30, name: 'Zadanie 3' },
          { id: 10, name: 'Zadanie 1' },
          { id: 20, name: 'Zadanie 2' },
        ],
      },
    ];

    const formatted = formatProgressStages(stageWithActivities);

    expect(formatted[0].activities.map((act) => act.id)).toEqual([10, 20, 30]);
  });
});
