export const VIEWPORT_EDGE_MARGIN = 8;
export const TOOLTIP_GAP = 8;

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * @param {number} left
 * @param {number} top
 * @param {number} width
 * @param {number} height
 * @param {number} [margin=VIEWPORT_EDGE_MARGIN]
 * @returns {{ left: number, top: number }}
 */
export function clampRectToViewport(left, top, width, height, margin = VIEWPORT_EDGE_MARGIN) {
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const maxTop = Math.max(margin, window.innerHeight - height - margin);

  return {
    left: clamp(left, margin, maxLeft),
    top: clamp(top, margin, maxTop),
  };
}

/**
 * Tooltip wyśrodkowany względem triggera (InfoTooltip).
 *
 * @param {Object} options
 * @param {DOMRect} options.triggerRect
 * @param {DOMRect} options.bubbleRect
 * @param {number} [options.margin]
 * @param {number} [options.gap]
 * @returns {{ left: number, top: number, placement: 'top' | 'bottom', arrowLeft: number }}
 */
export function positionCenteredTooltip({
  triggerRect,
  bubbleRect,
  margin = VIEWPORT_EDGE_MARGIN,
  gap = TOOLTIP_GAP,
}) {
  const centerX = triggerRect.left + triggerRect.width / 2;
  let placement = 'top';
  let top = triggerRect.top - gap - bubbleRect.height;

  if (top < margin) {
    placement = 'bottom';
    top = triggerRect.bottom + gap;
  }

  if (placement === 'bottom' && top + bubbleRect.height > window.innerHeight - margin) {
    placement = 'top';
    top = triggerRect.top - gap - bubbleRect.height;
  }

  let left = centerX - bubbleRect.width / 2;
  ({ left, top } = clampRectToViewport(left, top, bubbleRect.width, bubbleRect.height, margin));

  const arrowLeft = clamp(centerX - left, 12, bubbleRect.width - 12);

  return { left, top, placement, arrowLeft };
}

/**
 * Tooltip zakotwiczony lewym górnym rogiem przy triggerze (listy overflow).
 *
 * @param {Object} options
 * @param {DOMRect} options.triggerRect
 * @param {DOMRect} options.bubbleRect
 * @param {number} [options.margin]
 * @param {number} [options.gap]
 * @returns {{ left: number, top: number }}
 */
export function positionAnchoredTooltip({
  triggerRect,
  bubbleRect,
  margin = VIEWPORT_EDGE_MARGIN,
  gap = TOOLTIP_GAP,
}) {
  let top = triggerRect.bottom + gap;
  let left = triggerRect.left;

  if (top + bubbleRect.height > window.innerHeight - margin) {
    top = triggerRect.top - gap - bubbleRect.height;
  }

  if (left + bubbleRect.width > window.innerWidth - margin) {
    left = triggerRect.right - bubbleRect.width;
  }

  return clampRectToViewport(left, top, bubbleRect.width, bubbleRect.height, margin);
}

/**
 * Tooltip PlayerAvatar (lewo / prawo / dół).
 *
 * @param {Object} options
 * @param {DOMRect} options.triggerRect
 * @param {DOMRect} options.bubbleRect
 * @param {'left' | 'right' | 'top'} [options.placement='right']
 * @param {number} [options.margin]
 * @param {number} [options.gap]
 * @returns {{ left: number, top: number, placement: 'left' | 'right' | 'top' }}
 */
export function positionSideTooltip({
  triggerRect,
  bubbleRect,
  placement = 'right',
  margin = VIEWPORT_EDGE_MARGIN,
  gap = 12,
}) {
  let resolvedPlacement = placement;
  let left;
  let top;

  if (placement === 'left') {
    left = triggerRect.left - gap - bubbleRect.width;
    top = triggerRect.top + triggerRect.height / 2 - bubbleRect.height / 2;
    if (left < margin) {
      resolvedPlacement = 'right';
      left = triggerRect.right + gap;
    }
  } else if (placement === 'right') {
    left = triggerRect.right + gap;
    top = triggerRect.top + triggerRect.height / 2 - bubbleRect.height / 2;
    if (left + bubbleRect.width > window.innerWidth - margin) {
      resolvedPlacement = 'left';
      left = triggerRect.left - gap - bubbleRect.width;
    }
  } else {
    left = triggerRect.left + triggerRect.width / 2 - bubbleRect.width / 2;
    top = triggerRect.bottom + gap;
    if (top + bubbleRect.height > window.innerHeight - margin) {
      top = triggerRect.top - gap - bubbleRect.height;
    }
  }

  ({ left, top } = clampRectToViewport(left, top, bubbleRect.width, bubbleRect.height, margin));

  return { left, top, placement: resolvedPlacement };
}

/**
 * Menu rozwijane / panel zakotwiczony przy triggerze (3 kropki, menu użytkownika).
 *
 * @param {Object} options
 * @param {DOMRect} options.triggerRect
 * @param {DOMRect} options.panelRect
 * @param {'end' | 'start' | 'center'} [options.align='end']
 * @param {'below' | 'above' | 'auto'} [options.placement='auto']
 * @param {number} [options.margin]
 * @param {number} [options.gap]
 * @returns {{ left: number, top: number, placement: 'below' | 'above' }}
 */
export function positionDropdownMenu({
  triggerRect,
  panelRect,
  align = 'end',
  placement = 'auto',
  margin = VIEWPORT_EDGE_MARGIN,
  gap = 4,
}) {
  let left;

  if (align === 'start') {
    left = triggerRect.left;
  } else if (align === 'center') {
    left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
  } else {
    left = triggerRect.right - panelRect.width;
  }

  const spaceBelow = window.innerHeight - triggerRect.bottom - gap;
  const spaceAbove = triggerRect.top - gap;
  let resolvedPlacement = placement;

  if (placement === 'auto') {
    resolvedPlacement = spaceBelow >= panelRect.height || spaceBelow >= spaceAbove
      ? 'below'
      : 'above';
  }

  let top = resolvedPlacement === 'below'
    ? triggerRect.bottom + gap
    : triggerRect.top - gap - panelRect.height;

  ({ left, top } = clampRectToViewport(left, top, panelRect.width, panelRect.height, margin));

  return { left, top, placement: resolvedPlacement };
}

/**
 * Podgląd wiersza tabeli — wyśrodkowany poziomo, wyrównany do wiersza w pionie.
 *
 * @param {Object} options
 * @param {DOMRect} options.triggerRect
 * @param {DOMRect} options.bubbleRect
 * @param {number} [options.margin]
 * @returns {{ left: number, top: number }}
 */
export function positionRowCenteredPreview({
  triggerRect,
  bubbleRect,
  margin = VIEWPORT_EDGE_MARGIN,
}) {
  let left = (window.innerWidth - bubbleRect.width) / 2;
  let top = triggerRect.top;

  return clampRectToViewport(left, top, bubbleRect.width, bubbleRect.height, margin);
}

/**
 * Podgląd przy kursorze (ActivityProgressIcon).
 *
 * @param {Object} options
 * @param {number} options.clientX
 * @param {number} options.clientY
 * @param {DOMRect} options.bubbleRect
 * @param {number} [options.offset]
 * @param {number} [options.margin]
 * @returns {{ left: number, top: number }}
 */
export function positionCursorTooltip({
  clientX,
  clientY,
  bubbleRect,
  offset = 16,
  margin = VIEWPORT_EDGE_MARGIN,
}) {
  let left = clientX + offset;
  let top = clientY + offset;

  if (left + bubbleRect.width > window.innerWidth - margin) {
    left = clientX - bubbleRect.width - offset;
  }

  if (top + bubbleRect.height > window.innerHeight - margin) {
    top = clientY - bubbleRect.height - offset;
  }

  return clampRectToViewport(left, top, bubbleRect.width, bubbleRect.height, margin);
}
