import { useMemo, useState } from 'react';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { parseShopItemImageRef } from '../../../utils/shop/shopItemIcon.js';
import './ProductCardMini.css';

/**
 * Kompaktowy wiersz produktu (np. lista koszyka).
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {number | string} props.priceAmount
 * @param {string} [props.priceEmoji]
 * @param {string | null} [props.imageRef]
 * @param {string} [props.imageUrl]
 * @param {string} [props.className]
 */
export default function ProductCardMini({
  name,
  priceAmount,
  priceEmoji,
  imageRef,
  imageUrl,
  className = '',
}) {
  const icon = useMemo(
    () => parseShopItemImageRef(imageRef ?? imageUrl),
    [imageRef, imageUrl],
  );
  const [imageFailed, setImageFailed] = useState(!icon.imageUrl);
  const showEmoji = !icon.imageUrl || imageFailed;

  return (
    <article className={['maq-product-card-mini', className].filter(Boolean).join(' ')}>
      <div
        className="maq-product-card-mini__thumb-wrap"
        style={showEmoji ? { background: icon.iconBackground } : undefined}
      >
        {showEmoji ? (
          <span className="maq-product-card-mini__thumb-emoji" aria-hidden="true">
            {icon.emoji}
          </span>
        ) : (
          <img
            className="maq-product-card-mini__thumb"
            src={icon.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <div className="maq-product-card-mini__content">
        <p className="maq-product-card-mini__name">{name}</p>
        <CurrencyDisplay
          amount={priceAmount}
          symbol={priceEmoji}
          size="sm"
          className="maq-product-card-mini__price"
        />
      </div>
    </article>
  );
}
