import { describe, expect, it } from 'vitest';
import { splitGroupStoryTitle } from './splitGroupStoryTitle.js';

describe('splitGroupStoryTitle', () => {
  it('splits explicit line breaks', () => {
    expect(splitGroupStoryTitle('Marchewkowa Gwardia\nanty-orkowa')).toEqual({
      primary: 'Marchewkowa Gwardia',
      accentLines: ['anty-orkowa'],
    });
  });

  it('splits hyphenated tagline on one line', () => {
    expect(splitGroupStoryTitle('Marchewkowa Gwardia anty-orkowa')).toEqual({
      primary: 'Marchewkowa Gwardia',
      accentLines: ['anty-orkowa'],
    });
  });

  it('keeps two-word proper names single-colored', () => {
    expect(splitGroupStoryTitle('Marchewkowa Gwardia')).toEqual({
      primary: 'Marchewkowa Gwardia',
      accentLines: [],
    });
  });

  it('splits on dash delimiter', () => {
    expect(splitGroupStoryTitle('Marchewkowa Gwardia - anty-orkowa')).toEqual({
      primary: 'Marchewkowa Gwardia',
      accentLines: ['anty-orkowa'],
    });
  });
});
