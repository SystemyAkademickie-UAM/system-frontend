import { useEffect, useState } from 'react';

function resolvePopularCount(width) {
  if (width < 400) {
    return 2;
  }
  if (width < 600) {
    return 3;
  }
  return 4;
}

/**
 * Liczba awatarów w sekcji „Ostatnio najczęściej używane” — dopasowana do szerokości ekranu.
 *
 * @returns {number}
 */
export function useResponsivePopularCount() {
  const [count, setCount] = useState(() => {
    if (typeof window === 'undefined') {
      return 4;
    }
    return resolvePopularCount(window.innerWidth);
  });

  useEffect(() => {
    const update = () => {
      setCount(resolvePopularCount(window.innerWidth));
    };

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}
