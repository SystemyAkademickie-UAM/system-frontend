import { describe, expect, it } from 'vitest';
import {
  countSentences,
  getPostWidthFraction,
  POST_CARD_MAX_CONTENT_FRACTION,
  POST_CARD_MIN_WIDTH_STEP,
  POST_CARD_WIDTH_STEPS,
} from './countSentences.js';

const minFraction = (POST_CARD_MIN_WIDTH_STEP / POST_CARD_WIDTH_STEPS) * POST_CARD_MAX_CONTENT_FRACTION;
const stepFraction = (step) => (step / POST_CARD_WIDTH_STEPS) * POST_CARD_MAX_CONTENT_FRACTION;

describe('countSentences', () => {
  it('returns 0 for empty text', () => {
    expect(countSentences('')).toBe(0);
    expect(countSentences('   ')).toBe(0);
  });

  it('counts a single sentence without ending punctuation', () => {
    expect(countSentences('Krótki opis')).toBe(1);
  });

  it('counts sentences separated by periods', () => {
    expect(countSentences('Pierwsze zdanie. Drugie zdanie.')).toBe(2);
    expect(countSentences('A. B. C. D.')).toBe(4);
  });

  it('counts five or more sentences', () => {
    expect(countSentences('1. 2. 3. 4. 5.')).toBe(5);
    expect(countSentences('1. 2. 3. 4. 5. 6.')).toBe(6);
  });
});

describe('getPostWidthFraction', () => {
  it('clamps short posts to the 4-sentence minimum width', () => {
    expect(getPostWidthFraction(0)).toBeCloseTo(minFraction);
    expect(getPostWidthFraction(1)).toBeCloseTo(minFraction);
    expect(getPostWidthFraction(3)).toBeCloseTo(minFraction);
    expect(getPostWidthFraction(4)).toBeCloseTo(stepFraction(4));
  });

  it('maps longer posts from 5/8 up to the capped max width', () => {
    expect(getPostWidthFraction(5)).toBeCloseTo(stepFraction(5));
    expect(getPostWidthFraction(8)).toBeCloseTo(POST_CARD_MAX_CONTENT_FRACTION);
    expect(getPostWidthFraction(12)).toBeCloseTo(POST_CARD_MAX_CONTENT_FRACTION);
  });
});
