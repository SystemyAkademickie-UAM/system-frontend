import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../ui/index.js';
import { groupShopPath } from '../../routes/pathRegistry.js';
import { findCachedShopItem } from '../../utils/shop/shopItemsCache.js';
import { positionCenteredTooltip } from '../../utils/ui/positionTooltipInViewport.js';
import './NotificationItemPreview.css';

/**
 * @param {{
 *   groupId: string | number,
 *   notification: import('../../utils/notifications/formatBacklogNotification.js').ReturnType<typeof import('../../utils/notifications/formatBacklogNotification.js').formatBacklogNotification>,
 *   name: string,
 *   isExtraLife?: boolean,
 *   onMarkRead?: (id: number) => void | Promise<unknown>,
 * }} props
 */
export default function NotificationItemPreview({
  groupId,
  notification,
  name,
  isExtraLife = false,
  onMarkRead,
}) {
  const popoverId = useId();
  const triggerRef = useRef(null);
  const bubbleRef = useRef(null);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState(null);
  const [resolvedItem, setResolvedItem] = useState(null);

  const raw = notification.rawPayload ?? {};
  const effectiveIsExtraLife = isExtraLife || notification.isExtraLife || raw.isExtraLife === true;

  const loadItemDetails = useCallback(async () => {
    if (!groupId) return;
    const item = await findCachedShopItem(groupId, notification.itemId, {
      name: notification.itemName || name,
      isExtraLife: effectiveIsExtraLife,
    });
    if (item) {
      setResolvedItem(item);
    }
  }, [effectiveIsExtraLife, groupId, name, notification.itemId, notification.itemName]);

  const handleMouseEnter = () => {
    setOpen(true);
    void loadItemDetails();
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const updateLayout = useCallback(() => {
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) {
      return;
    }

    setLayout(positionCenteredTooltip({
      triggerRect: trigger.getBoundingClientRect(),
      bubbleRect: bubble.getBoundingClientRect(),
      gap: 10,
    }));
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setLayout(null);
      return undefined;
    }

    updateLayout();
    const rafId = window.requestAnimationFrame(updateLayout);

    window.addEventListener('scroll', updateLayout, true);
    window.addEventListener('resize', updateLayout);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateLayout, true);
      window.removeEventListener('resize', updateLayout);
    };
  }, [open, resolvedItem, updateLayout]);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onMarkRead && !notification.isRead) {
      void onMarkRead(notification.id);
    }

    const targetItemId = resolvedItem?.id ?? notification.itemId ?? (effectiveIsExtraLife ? 'extra-life' : null);
    const shopPath = groupShopPath(groupId);

    navigate(
      targetItemId ? `${shopPath}?highlight=${encodeURIComponent(targetItemId)}` : shopPath,
      {
        state: {
          highlightItemId: targetItemId,
          isExtraLife: effectiveIsExtraLife,
          highlightItemName: resolvedItem?.name ?? notification.itemName ?? name,
        },
      },
    );
  };

  const itemToRender = resolvedItem ?? {
    id: notification.itemId ?? (effectiveIsExtraLife ? 'extra-life' : 'preview-item'),
    name: notification.itemName || name || (effectiveIsExtraLife ? 'Dodatkowe życie' : 'Przedmiot'),
    storyDescription: raw.storyDescription ?? '',
    didacticDescription: raw.didacticDescription ?? '',
    priceAmount: raw.price ?? raw.amount ?? null,
    salePriceAmount: raw.salePriceAmount ?? null,
    imageRef: raw.imageRef ?? raw.imageUrl ?? null,
    categories: Array.isArray(raw.categories) ? raw.categories : [],
    isExtraLife: effectiveIsExtraLife,
  };

  const popover = open && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={bubbleRef}
          id={popoverId}
          role="tooltip"
          className="notification-item-preview__popover"
          style={{
            visibility: layout ? 'visible' : 'hidden',
            left: layout ? `${layout.left}px` : 0,
            top: layout ? `${layout.top}px` : 0,
          }}
        >
          <ProductCard
            variant="preview"
            hideActions
            readOnly
            itemId={itemToRender.id}
            name={itemToRender.name}
            storyDescription={itemToRender.storyDescription}
            didacticDescription={itemToRender.didacticDescription}
            priceAmount={itemToRender.priceAmount}
            salePriceAmount={itemToRender.salePriceAmount}
            imageRef={itemToRender.imageRef}
            imageUrl={itemToRender.imageUrl}
            categories={itemToRender.categories}
            isExtraLife={effectiveIsExtraLife || itemToRender.isExtraLife}
            className="notification-item-preview__card"
          />
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        className="notification-item-preview__trigger"
        aria-describedby={open ? popoverId : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleClick(event);
          }
        }}
      >
        {name}
      </span>
      {popover}
    </>
  );
}
