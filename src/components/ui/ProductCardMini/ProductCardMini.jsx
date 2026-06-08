import { useState } from 'react';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { SVG_PLACEHOLDER } from '../../../constants/svgIcons.js';
import './ProductCardMini.css';

/**
 * Kompaktowy wiersz produktu (np. lista koszyka).
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {number | string} props.priceAmount
 * @param {string} [props.priceEmoji]
 * @param {string} [props.imageUrl]
 * @param {string} [props.className]
 */
export default function ProductCardMini({
  name,
  priceAmount,
  priceEmoji,
  imageUrl,
  className = '',
}) {
  const [imageFailed, setImageFailed] = useState(!imageUrl);
  const showFallback = imageFailed || !imageUrl;

  return (
    <article className={['maq-product-card-mini', className].filter(Boolean).join(' ')}>
      <div className="maq-product-card-mini__thumb-wrap">
        {showFallback ? (
          <AssetSvg
            name={SVG_PLACEHOLDER}
            className="maq-product-card-mini__thumb-fallback"
            width={20}
            height={20}
            alt=""
          />
        ) : (
          <img
            className="maq-product-card-mini__thumb"
            src={imageUrl}
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
