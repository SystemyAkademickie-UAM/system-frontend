import { useLayoutEffect, useState } from 'react';

/**
 * Śledzi szerokość elementu (offsetWidth) przez ResizeObserver.
 *
 * @param {import('react').RefObject<HTMLElement | null>} elementRef
 * @param {unknown[]} [deps=[]]
 * @returns {number | null}
 */
export function useMeasuredWidth(elementRef, deps = []) {
  const [width, setWidth] = useState(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) {
      setWidth(null);
      return undefined;
    }

    const update = () => {
      setWidth(element.offsetWidth);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, ...deps]);

  return width;
}
