import { describe, expect, it } from 'vitest';
import { getStudentProgressPx, getStudentProgressRatio, sortAndMapRanks } from './rankPathModel.js';

describe('rankPathModel', () => {
  it('sorts ranks by required points ascending', () => {
    const ranks = sortAndMapRanks([
      { id: 2, name: 'Łowca', requiredPoints: 200 },
      { id: 1, name: 'Uczeń', requiredPoints: 100 },
    ]);

    expect(ranks.map((rank) => rank.costAmount)).toEqual([100, 200]);
  });

  it('places student halfway between two rank thresholds', () => {
    const ranks = sortAndMapRanks([
      { id: 1, name: 'Uczeń', requiredPoints: 100 },
      { id: 2, name: 'Łowca', requiredPoints: 200 },
    ]);

    expect(getStudentProgressRatio(ranks, 150)).toBeCloseTo(0.5, 5);
  });

  it('aligns student progress with rank threshold dots', () => {
    const ranks = sortAndMapRanks([
      { id: 1, name: 'Uczeń', requiredPoints: 100 },
      { id: 2, name: 'Łowca', requiredPoints: 200 },
      { id: 3, name: 'Mistrz', requiredPoints: 300 },
    ]);
    const rowCenters = [80, 240, 400];

    expect(getStudentProgressPx(rowCenters, ranks, 100)).toBe(80);
    expect(getStudentProgressPx(rowCenters, ranks, 200)).toBe(240);
    expect(getStudentProgressPx(rowCenters, ranks, 150)).toBe(160);
  });
});
