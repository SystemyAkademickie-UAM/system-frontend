import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { positionRowCenteredPreview } from '../../../../utils/ui/positionTooltipInViewport.js';

export function useRewardsTablePreview() {
  const bubbleRef = useRef(null);
  const triggerRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [layout, setLayout] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateLayout = useCallback(() => {
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) {
      return;
    }

    setLayout(positionRowCenteredPreview({
      triggerRect: trigger.getBoundingClientRect(),
      bubbleRect: bubble.getBoundingClientRect(),
    }));
  }, []);

  useLayoutEffect(() => {
    if (!previewVisible || menuOpen) {
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
  }, [previewVisible, menuOpen, updateLayout]);

  const showPreview = useCallback((element) => {
    if (menuOpen) {
      return;
    }

    triggerRef.current = element;
    setPreviewVisible(true);
  }, [menuOpen]);

  const hidePreview = useCallback(() => {
    setPreviewVisible(false);
    triggerRef.current = null;
  }, []);

  const handleMenuOpenChange = useCallback((open) => {
    setMenuOpen(open);

    if (open) {
      setPreviewVisible(false);
    }
  }, []);

  return {
    previewVisible: previewVisible && !menuOpen,
    layout,
    bubbleRef,
    showPreview,
    hidePreview,
    handleMenuOpenChange,
  };
}
