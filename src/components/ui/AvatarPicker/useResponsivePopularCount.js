import { useEffect, useState } from 'react';

/**
 * Liczba awatarów w sekcji „Ostatnio najczęściej używane” — dopasowana do szerokości ekranu.
 *
 * @returns {number}
 */
export function useResponsivePopularCount() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setCount(2);
        return;
      }
      if (width < 600) {
        setCount(3);
        return;
      }
      setCount(4);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}
