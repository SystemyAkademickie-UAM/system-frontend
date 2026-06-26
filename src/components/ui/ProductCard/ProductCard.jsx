import { useMemo, useState } from 'react';

import AssetSvg from '../AssetSvg/AssetSvg.jsx';

import Button from '../Button/Button.jsx';

import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import InfoTooltip from '../InfoTooltip/InfoTooltip.jsx';
import ProductCategoryStrip from '../ProductCategoryStrip/ProductCategoryStrip.jsx';

import { SVG_ICONS } from '../../../constants/svgIcons.js';

import { parseShopItemImageRef } from '../../../utils/shop/shopItemIcon.js';
import { getProductCardColorVars } from '../../../utils/shop/shopCategoryColors.js';
import { getShopItemPriceDisplay } from '../../../utils/shop/shopPricing.js';

import './ProductCard.css';



function ProductCardPrice({
  priceAmount,
  salePriceAmount,
  rankDiscountedPrice,
  priceEmoji,
  size = 'md',
}) {
  const display = getShopItemPriceDisplay({
    priceAmount,
    salePriceAmount,
    rankDiscountedPrice,
  });

  if (display.mode === 'badge') {
    return (
      <div
        className="maq-product-card__price-row"
        aria-label={`Cena ${display.displayPrice}, poprzednio ${display.strikePrice}`}
      >
        <CurrencyDisplay
          amount={display.strikePrice}
          symbol={priceEmoji}
          size={size}
          className="maq-product-card__price-value maq-product-card__price-value--original"
        />
        <div className="maq-product-card__sale-tag">
          <CurrencyDisplay
            amount={display.displayPrice}
            symbol={priceEmoji}
            size="md"
            className="maq-product-card__price-value maq-product-card__price-value--sale"
          />
        </div>
      </div>
    );
  }

  if (display.mode === 'rank') {
    return (
      <div className="maq-product-card__price-row maq-product-card__price-row--rank">
        <CurrencyDisplay
          amount={display.displayPrice}
          symbol={priceEmoji}
          size={size}
          className="maq-product-card__price-value"
        />
        <InfoTooltip
          text={`Cena katalogowa: ${display.tooltipBasePrice}`}
          className="maq-product-card__price-tooltip"
        />
      </div>
    );
  }

  return (
    <CurrencyDisplay
      amount={display.displayPrice}
      symbol={priceEmoji}
      size={size}
      className="maq-product-card__price-value"
    />
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



function ProductItemIcon({ emoji, iconBackground, imageUrl, imageAlt }) {

  const [imageFailed, setImageFailed] = useState(!imageUrl);



  if (imageUrl && !imageFailed) {

    return (

      <div

        className="maq-product-card__icon-circle"

        style={{ background: iconBackground }}

      >

        <img

          className="maq-product-card__icon-img"

          src={imageUrl}

          alt={imageAlt}

          loading="lazy"

          decoding="async"

          onError={() => setImageFailed(true)}

        />

      </div>

    );

  }



  return (

    <div

      className="maq-product-card__icon-circle"

      style={{ background: iconBackground }}

    >

      <span className="maq-product-card__icon-emoji" aria-hidden="true">{emoji}</span>

    </div>

  );

}



/**

 * Kafelek produktu sklepowego — układ spójny z odznaką, z obwódką Brush grindhouse.

 */

export default function ProductCard({

  name,

  storyDescription,

  didacticDescription,

  priceAmount,

  salePriceAmount,

  rankDiscountedPrice,

  priceEmoji,

  imageRef,

  imageUrl,

  imageAlt,

  itemId,

  categories = [],

  categoryDetails = [],

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

  isRankLocked = false,

  lockedReason = 'Wymaga wyższej rangi, aby odblokować ten przedmiot.',

  isInCart = false,

  className = '',

  inventoryMode = false,

  ownedQuantity = 1,

  onUse,

  readOnly = false,

}) {

  const icon = useMemo(

    () => parseShopItemImageRef(imageRef ?? imageUrl),

    [imageRef, imageUrl],

  );

  const resolvedImageAlt = imageAlt ?? name;

  const isPreview = variant === 'preview';

  const isInventory = inventoryMode === true;

  const showCartButton = !hideAddToCart && !hideActions && !isInventory;

  const showFooter = isInventory || !hideActions || isPreview;

  const resolvedCategories = categoryDetails.length > 0
    ? categoryDetails
    : categories.map((name, index) => ({
      id: `label-${index}`,
      name,
      color: null,
    }));

  const cardStyle = useMemo(
    () => getProductCardColorVars(resolvedCategories),
    [resolvedCategories],
  );



  return (

    <article

      className={[

        'maq-product-card',

        `maq-product-card--${variant}`,

        disabled ? 'maq-product-card--disabled' : '',

        isRankLocked ? 'maq-product-card--rank-locked' : '',

        className,

      ]

        .filter(Boolean)

        .join(' ')}

      style={cardStyle}
      title={isRankLocked ? lockedReason : undefined}

    >

      <ProductCategoryStrip categories={resolvedCategories} />

      <div className="maq-product-card__main">

        <header className="maq-product-card__header">

          <div className="maq-product-card__icon-wrap">

            <ProductItemIcon

              emoji={icon.emoji}

              iconBackground={icon.iconBackground}

              imageUrl={icon.imageUrl}

              imageAlt={resolvedImageAlt}

            />

          </div>



          <div className="maq-product-card__heading">

            <h3 className="maq-product-card__name" title={isPreview ? undefined : name}>

              {name}

            </h3>

          </div>



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

        </header>



        <div className="maq-product-card__descriptions">

          <div className="maq-product-card__section">

            <span className="maq-product-card__section-label">Opis fabularny</span>

            <p

              className="maq-product-card__story-text"

              title={isPreview ? undefined : storyDescription || undefined}

            >

              {storyDescription || '\u00A0'}

            </p>

          </div>



          <div className="maq-product-card__section">

            <span className="maq-product-card__section-label">Opis dydaktyczny</span>

            <p

              className="maq-product-card__didactic-text"

              title={isPreview ? undefined : didacticDescription || undefined}

            >

              {didacticDescription || '\u00A0'}

            </p>

          </div>

        </div>

      </div>



      {showFooter ? (

        <footer className="maq-product-card__footer">

          {isInventory ? (
            <>
              <div className="maq-product-card__price-bar">
                <span className="maq-product-card__section-label">Posiadane</span>
                <span className="maq-product-card__owned-count">{ownedQuantity}</span>
              </div>

              {!readOnly ? (
                <div className="maq-product-card__actions">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={disabled}
                    onClick={onUse}
                    className="maq-product-card__buy-btn"
                  >
                    Użyj
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <>
          <div className="maq-product-card__price-bar">

            <span className="maq-product-card__section-label">Cena</span>

            <ProductCardPrice

              priceAmount={priceAmount}

              salePriceAmount={salePriceAmount}

              rankDiscountedPrice={rankDiscountedPrice}

              priceEmoji={priceEmoji}

            />

          </div>



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

            </>
          )}

        </footer>

      ) : null}

    </article>

  );

}

