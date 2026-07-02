import { useCallback, useLayoutEffect, useState } from 'react';

/**
 * Pozycjonowanie panelu w portalu względem triggera z dopasowaniem do viewportu.
 *
 * @param {Object} options
 * @param {boolean} options.open
 * @param {import('react').RefObject<HTMLElement | null>} options.triggerRef
 * @param {import('react').RefObject<HTMLElement | null>} options.panelRef
 * @param {(args: { triggerRect: DOMRect, panelRect: DOMRect }) => Record<string, unknown>} options.getLayout
 * @param {unknown[]} [options.deps]
 * @returns {Record<string, unknown> | null}
 */
export function useFloatingPanelPosition({
  open,
  triggerRef,
  panelRef,
  getLayout,
  deps = [],
}) {
  const [layout, setLayout] = useState(null);

  const updateLayout = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) {
      return;
    }

    setLayout(getLayout({
      triggerRect: trigger.getBoundingClientRect(),
      panelRect: panel.getBoundingClientRect(),
    }));
  }, [triggerRef, panelRef, getLayout]);

  useLayoutEffect(() => {
    if (!open) {
      setLayout(null);
      return undefined;
    }

    updateLayout();
    const rafId = window.requestAnimationFrame(updateLayout);

    window.addEventListener('resize', updateLayout);
    window.addEventListener('scroll', updateLayout, true);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('scroll', updateLayout, true);
    };
  }, [open, updateLayout, ...deps]);

  return layout;
}
