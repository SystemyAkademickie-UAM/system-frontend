import { useCallback, useLayoutEffect } from 'react';

const MIN_FONT_SIZE_PX = 10;
const FONT_SIZE_STEP_PX = 0.5;

/**
 * @returns {number}
 */
function readMaxFontSizePx() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--font-size-body').trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 14;
}

/**
 * @param {HTMLElement} nav
 * @returns {boolean}
 */
function hasOverflowingItems(nav) {
  const items = nav.querySelectorAll('.maq-sub-nav__item');
  return Array.from(items).some((item) => item.scrollWidth > item.clientWidth + 1);
}

/**
 * Dopasowuje font-size kontenera (em na elementach), gdy etykiety nie mieszczą się w zakładkach.
 *
 * @param {import('react').RefObject<HTMLElement | null>} navRef
 * @param {unknown[]} deps
 */
function isMobileSubNavLayout() {
  return window.matchMedia('(max-width: 639px)').matches;
}

export function useSubNavFitFontSize(navRef, deps = []) {
  const fitFontSize = useCallback(() => {
    const nav = navRef.current;
    if (!nav) {
      return;
    }

    if (!isMobileSubNavLayout()) {
      nav.style.fontSize = '';
      return;
    }

    const maxPx = readMaxFontSizePx();
    let size = maxPx;
    nav.style.fontSize = `${size}px`;

    while (size > MIN_FONT_SIZE_PX && hasOverflowingItems(nav)) {
      size -= FONT_SIZE_STEP_PX;
      nav.style.fontSize = `${size}px`;
    }
  }, [navRef]);

  useLayoutEffect(() => {
    fitFontSize();

    const nav = navRef.current;
    if (!nav) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      fitFontSize();
    });

    observer.observe(nav);
    window.addEventListener('resize', fitFontSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fitFontSize);
    };
  }, [fitFontSize, navRef, ...deps]);
}
