import { useState } from 'react';
import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import Button from '../Button/Button.jsx';
import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import { SVG_ICONS, SVG_PLACEHOLDER } from '../../../constants/svgIcons.js';
import './ProductCard.css';

function ProductCardPrice({ priceAmount, salePriceAmount, priceEmoji, size = 'lg' }) {
  const hasDiscount = typeof salePriceAmount === 'number'
    && salePriceAmount >= 0
    && salePriceAmount < priceAmount;

  if (!hasDiscount) {
    return (
      <CurrencyDisplay
        amount={priceAmount}
        symbol={priceEmoji}
        size={size}
        className="maq-product-card__price"
      />
    );
  }

  return (
    <div className="maq-product-card__price-row" aria-label={`Cena ${salePriceAmount}, poprzednio ${priceAmount}`}>
      <CurrencyDisplay
        amount={priceAmount}
        symbol={priceEmoji}
        size={size}
        className="maq-product-card__price maq-product-card__price--original"
      />
      <div className="maq-product-card__sale-tag">
        <CurrencyDisplay
          amount={salePriceAmount}
          symbol={priceEmoji}
          size="md"
          className="maq-product-card__price maq-product-card__price--sale"
        />
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg className="maq-product-card__action-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M11.25 2.25 15.75 6.75 6 16.5H1.5V12L11.25 2.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * @param {Object} props
 * @param {string[]} [props.categories]
 */
function CategoryList({ categories = [] }) {
  if (categories.length === 0) {
    return null;
  }

  const visible = categories.slice(0, 3);
  const hidden = categories.slice(3);

  return (
    <ul className="maq-product-card__categories" aria-label="Kategorie produktu">
      {visible.map((label) => (
        <li key={label} className="maq-product-card__category">
          {label}
        </li>
      ))}
      {hidden.length > 0 ? (
        <li
          className="maq-product-card__category maq-product-card__category--more"
          title={hidden.join(', ')}
        >
          ...
        </li>
      ) : null}
    </ul>
  );
}

/**
 * Kafelek produktu sklepowego (układ pionowy, typ marketplace).
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} [props.storyDescription]
 * @param {string} [props.didacticDescription]
 * @param {number | string} props.priceAmount
 * @param {number} [props.salePriceAmount]
 * @param {string} [props.priceEmoji]
 * @param {string} [props.imageUrl]
 * @param {string} [props.imageAlt]
 * @param {string[]} [props.categories]
 * @param {'grid' | 'preview' | 'extra-life'} [props.variant='grid']
 * @param {() => void} [props.onBuy]
 * @param {() => void} [props.onAddToCart]
 * @param {() => void} [props.onEdit]
 * @param {() => void} [props.onDelete]
 * @param {boolean} [props.showLecturerActions=false]
 * @param {boolean} [props.hideAddToCart=false]
 * @param {boolean} [props.hideActions=false]
 * @param {string} [props.buyLabel='Kup teraz']
 * @param {string} [props.addToCartLabel='Do koszyka']
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.isInCart=false]
 * @param {string} [props.className]
 */
export default function ProductCard({
  name,
  storyDescription,
  didacticDescription,
  priceAmount,
  salePriceAmount,
  priceEmoji,
  imageUrl,
  imageAlt,
  categories = [],
  variant = 'grid',
  onBuy,
  onAddToCart,
  onEdit,
  onDelete,
  showLecturerActions = false,
  hideAddToCart = false,
  hideActions = false,
  buyLabel = 'Kup teraz',
  addToCartLabel = 'Do koszyka',
  disabled = false,
  isInCart = false,
  className = '',
}) {
  const [imageFailed, setImageFailed] = useState(!imageUrl);
  const showFallback = imageFailed || !imageUrl;
  const resolvedImageAlt = imageAlt ?? name;
  const isPreview = variant === 'preview';
  const showCartButton = !hideAddToCart && !hideActions;

  return (
    <article
      className={[
        'maq-product-card',
        `maq-product-card--${variant}`,
        disabled ? 'maq-product-card--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="maq-product-card__banner-wrap">
        {showFallback ? (
          <div className="maq-product-card__banner-fallback" aria-hidden="true">
            <AssetSvg
              name={SVG_PLACEHOLDER}
              className="maq-product-card__banner-fallback-icon"
              width={40}
              height={40}
              alt=""
            />
            <span className="maq-product-card__banner-fallback-text">Brak grafiki</span>
          </div>
        ) : (
          <img
            className="maq-product-card__banner"
            src={imageUrl}
            alt={resolvedImageAlt}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        )}

        {!isPreview ? <CategoryList categories={categories} /> : null}

        {showLecturerActions ? (
          <div className="maq-product-card__lecturer-actions">
            <button
              type="button"
              className="maq-product-card__action-btn"
              aria-label={`Edytuj produkt ${name}`}
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.();
              }}
            >
              <EditIcon />
            </button>
            <button
              type="button"
              className="maq-product-card__action-btn maq-product-card__action-btn--danger"
              aria-label={`Usuń produkt ${name}`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.();
              }}
            >
              <AssetSvg
                name={SVG_ICONS.actions.delete}
                className="maq-product-card__action-icon"
                width={18}
                height={18}
                alt=""
              />
            </button>
          </div>
        ) : null}
      </div>

      <div className="maq-product-card__body">
        <h3 className="maq-product-card__name" title={isPreview ? undefined : name}>
          {name}
        </h3>

        <p
          className="maq-product-card__story"
          title={isPreview ? undefined : storyDescription || undefined}
        >
          {storyDescription || '\u00A0'}
        </p>

        <div className="maq-product-card__didactic-box">
          <span className="maq-product-card__section-label">Opis dydaktyczny</span>
          <p
            className="maq-product-card__didactic-text"
            title={isPreview ? undefined : didacticDescription || undefined}
          >
            {didacticDescription || '\u00A0'}
          </p>
        </div>
      </div>

      {(!hideActions || isPreview) ? (
        <footer className="maq-product-card__footer">
          <ProductCardPrice
            priceAmount={priceAmount}
            salePriceAmount={salePriceAmount}
            priceEmoji={priceEmoji}
          />

          {hideActions ? null : (
            <div className="maq-product-card__actions">
              {showCartButton ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={disabled || isInCart}
                  onClick={onAddToCart}
                  className="maq-product-card__cart-btn"
                >
                  {isInCart ? 'W koszyku' : addToCartLabel}
                </Button>
              ) : null}

              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={disabled}
                onClick={onBuy}
                className="maq-product-card__buy-btn"
              >
                {buyLabel}
              </Button>
            </div>
          )}
        </footer>
      ) : null}
    </article>
  );
}
