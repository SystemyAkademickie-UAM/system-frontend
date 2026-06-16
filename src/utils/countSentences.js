/** Wykrywa zdania zakończone . ! ? … lub ostatni fragment bez interpunkcji końcowej. */
const SENTENCE_PATTERN = /[^.!?…]+[.!?…]+(?:\s+|$)|[^.!?…]+$/g;

/** Liczba stopni szerokości kafelka wpisu (1/8 … 8/8). */
export const POST_CARD_WIDTH_STEPS = 8;

/**
 * Maks. szerokość treści kafelka — jak dawniej przy 3 zdaniach (3/5 szerokości listy).
 */
export const POST_CARD_MAX_CONTENT_FRACTION = 3 / 5;

/** Dolny stopień szerokości — jak przy 4 zdaniach (4/8 maksimum). */
export const POST_CARD_MIN_WIDTH_STEP = 4;

/**
 * Liczy zdania w treści wpisu.
 *
 * @param {string} text
 * @returns {number}
 */
export function countSentences(text) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed) {
    return 0;
  }

  const matches = trimmed.match(SENTENCE_PATTERN);
  return matches ? matches.length : 1;
}

/**
 * Ułamek szerokości listy dla kafelka (min. 4/8 … 8+→8/8 maksymalnej szerokości).
 *
 * @param {number} sentenceCount
 * @returns {number}
 */
export function getPostWidthFraction(sentenceCount) {
  const rawStep = sentenceCount <= 0 ? 1 : sentenceCount;
  const step = Math.min(
    POST_CARD_WIDTH_STEPS,
    Math.max(POST_CARD_MIN_WIDTH_STEP, rawStep),
  );

  return (step / POST_CARD_WIDTH_STEPS) * POST_CARD_MAX_CONTENT_FRACTION;
}
