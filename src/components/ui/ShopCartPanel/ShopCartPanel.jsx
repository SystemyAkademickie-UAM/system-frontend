import { useCallback, useEffect, useId, useRef, useState } from 'react';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import Button from '../Button/Button.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import ProductCardMini from '../ProductCardMini/ProductCardMini.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import './ShopCartPanel.css';

/**
 * Pływający koszyk sklepu z listą pozycji.
 *
 * @param {Object} props
 * @param {number} props.cartCount
 * @param {Array<{ id: string, name: string, priceAmount: number, imageUrl?: string }>} props.cartItems
 * @param {number} props.cartTotal
 * @param {() => void} props.onBuyAll
 * @param {(itemId: string) => void} [props.onRemoveFromCart]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 */
export default function ShopCartPanel({
  cartCount,
  cartItems,
  cartTotal,
  onBuyAll,
  onRemoveFromCart,
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef(null);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        closePanel();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closePanel]);

  return (
    <div
      ref={rootRef}
      className={[
        'maq-shop-cart',
        disabled ? 'maq-shop-cart--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className="maq-shop-cart__trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={`Koszyk, ${cartCount} produktów`}
        disabled={disabled}
        onClick={() => {
          if (disabled) {
            return;
          }
          setIsOpen((open) => !open);
        }}
      >
        <AssetSvg
          name={SVG_ICONS.nav.shop}
          className="maq-shop-cart__icon"
          width={24}
          height={24}
          alt=""
        />
        {cartCount > 0 ? (
          <span className="maq-shop-cart__badge" aria-hidden="true">
            {cartCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div id={panelId} className="maq-shop-cart__panel" role="region" aria-label="Zawartość koszyka">
          {cartItems.length === 0 ? (
            <p className="maq-shop-cart__empty">Koszyk jest pusty.</p>
          ) : (
            <>
              <ul className="maq-shop-cart__list">
                {cartItems.map((item) => (
                  <li key={item.id} className="maq-shop-cart__item">
                    <ProductCardMini
                      name={item.name}
                      priceAmount={item.priceAmount}
                      imageUrl={item.imageUrl}
                      className="maq-shop-cart__item-card"
                    />
                    <button
                      type="button"
                      className="maq-shop-cart__remove-btn"
                      aria-label={`Usuń ${item.name} z koszyka`}
                      disabled={disabled}
                      onClick={() => onRemoveFromCart?.(item.id)}
                    >
                      <AssetSvg
                        name={SVG_ICONS.actions.delete}
                        className="maq-shop-cart__remove-icon"
                        width={18}
                        height={18}
                        alt=""
                      />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="maq-shop-cart__summary">
                <div className="maq-shop-cart__total-row">
                  <span className="maq-shop-cart__total-label">Razem</span>
                  <CurrencyDisplay amount={cartTotal} size="md" className="maq-shop-cart__total-value" />
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  fullWidth
                  disabled={disabled || cartItems.length === 0}
                  onClick={() => {
                    closePanel();
                    onBuyAll?.();
                  }}
                >
                  Kup wszystko
                </Button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
