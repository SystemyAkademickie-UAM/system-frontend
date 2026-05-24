import { useCallback, useState } from 'react';

const VIEWPORT_MARGIN = 16;

export function useRewardsTablePreview({
  previewWidth = 360,
  previewHeight = 260,
} = {}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

  const updatePreviewPosition = useCallback((element) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();

    const left = Math.max(
      VIEWPORT_MARGIN,
      (window.innerWidth - previewWidth) / 2,
    );

    let top = rect.top;
    top = Math.max(
      VIEWPORT_MARGIN,
      Math.min(top, window.innerHeight - previewHeight - VIEWPORT_MARGIN),
    );

    setPreviewPos({ x: left, y: top });
  }, [previewWidth, previewHeight]);

  const showPreview = useCallback((element) => {
    if (menuOpen) return;

    updatePreviewPosition(element);
    setPreviewVisible(true);
  }, [menuOpen, updatePreviewPosition]);

  const hidePreview = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  const handleMenuOpenChange = useCallback((open) => {
    setMenuOpen(open);

    if (open) {
      setPreviewVisible(false);
    }
  }, []);

  return {
    previewVisible: previewVisible && !menuOpen,
    previewPos,
    showPreview,
    hidePreview,
    handleMenuOpenChange,
  };
}
