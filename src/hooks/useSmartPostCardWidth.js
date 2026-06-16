import { useLayoutEffect, useState } from 'react';
import { countSentences, getPostWidthFraction } from '../utils/countSentences.js';

const MIN_TEXT_WIDTH = 96;
const LIST_SELECTORS = '.posts-islands, .group-main-posts__list';

function getListWidth(anchor) {
  const listElement = anchor.closest(LIST_SELECTORS);
  if (listElement) {
    return listElement.clientWidth;
  }

  return anchor.closest('.maq-textured-surface')?.parentElement?.clientWidth ?? 0;
}

/**
 * Szerokość kafelka wpisu: min. 4/8 … 8/8 maks. (cap = 3/5 listy).
 * Kafelek nie jest węższy niż tytuł.
 */
export function useSmartPostCardWidth({
  anchorRef,
  text,
  enabled = true,
}) {
  const [cardWidth, setCardWidth] = useState(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;

    if (!enabled || !anchor) {
      setCardWidth(null);
      return undefined;
    }

    const compute = () => {
      const listWidth = getListWidth(anchor);
      if (listWidth <= 0) {
        return;
      }

      const innerStyles = getComputedStyle(anchor);
      const paddingX = parseFloat(innerStyles.paddingLeft) + parseFloat(innerStyles.paddingRight);
      const gap = parseFloat(innerStyles.gap) || 0;
      const trailingElement = anchor.querySelector('[data-smart-post-trailing]');
      const trailingWidth = trailingElement?.getBoundingClientRect().width ?? 0;
      const maxContentWidth = Math.max(
        MIN_TEXT_WIDTH,
        listWidth - paddingX - trailingWidth - gap,
      );

      const sentenceCount = countSentences(text);
      const widthFraction = getPostWidthFraction(sentenceCount);
      let contentWidth = Math.max(MIN_TEXT_WIDTH, maxContentWidth * widthFraction);

      const titleElement = anchor.querySelector('[data-smart-post-title]');
      const titleWidth = titleElement?.scrollWidth ?? 0;
      const resolvedContentWidth = Math.max(contentWidth, titleWidth, MIN_TEXT_WIDTH);
      setCardWidth(resolvedContentWidth + paddingX + trailingWidth + gap);
    };

    compute();

    const listElement = anchor.closest(LIST_SELECTORS)
      ?? anchor.closest('.maq-textured-surface')?.parentElement;
    const observer = new ResizeObserver(compute);
    if (listElement) {
      observer.observe(listElement);
    }

    window.addEventListener('resize', compute);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [anchorRef, text, enabled]);

  return cardWidth;
}
