import { useMemo, useState } from 'react';

import AssetSvg from '../AssetSvg/AssetSvg.jsx';

import Button from '../Button/Button.jsx';

import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import InfoTooltip from '../InfoTooltip/InfoTooltip.jsx';
import ProductCategoryStrip from '../ProductCategoryStrip/ProductCategoryStrip.jsx';

import { SVG_ICONS } from '../../../constants/svgIcons.js';

import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import { parseShopItemImageRef } from '../../../utils/shop/shopItemIcon.js';
import { resolveExtraLifeItemIcon } from '../../../utils/shop/extraLifeItem.js';
import { useGroupLives } from '../../../context/GroupLivesContext.jsx';
import { getProductCardColorVars } from '../../../utils/shop/shopCategoryColors.js';
import { getShopCatalogPriceHint, getShopItemPriceDisplay, getShopStrikePriceHint } from '../../../utils/shop/shopPricing.js';
import { getTileVisibilityLabel } from '../../../utils/rewards/visibilityStatusLabel.js';

import './ProductCard.css';
import './lecturerTileActions.css';

const PRICEPREVIOUSLY__TEXTLABEL = {
  polish: 'Cena ${price}, poprzednio ${oldPrice}',
  english: 'Price ${price}, previously ${oldPrice}'
};

const DEFAULTBUY__TEXTLABEL = {
  polish: 'Kup teraz',
  english: 'Buy now'
};

const DEFAULTADDTOCART__TEXTLABEL = {
  polish: 'Do koszyka',
  english: 'Add to cart'
};

const DEFAULTLOCKEDREASON__TEXTLABEL = {
  polish: 'Wymaga wyższej rangi, aby odblokować ten przedmiot.',
  english: 'Requires a higher rank to unlock this item.'
};

const EDITBUTTON__TEXTLABEL = {
  polish: 'Edytuj produkt ${name}',
  english: 'Edit product ${name}'
};

const DELETEBUTTON__TEXTLABEL = {
  polish: 'Usuń produkt ${name}',
  english: 'Delete product ${name}'
};

const STORYDESCRIPTION__TEXTLABEL = {
  polish: 'Opis fabularny',
  english: 'Story description'
};

const DIDACTICDESCRIPTION__TEXTLABEL = {
  polish: 'Opis dydaktyczny',
  english: 'Didactic description'
};

const USEDITEM__TEXTLABEL = {
  polish: 'Przedmiot zużyty',
  english: 'Item used'
};

const PRICE__TEXTLABEL = {
  polish: 'Cena',
  english: 'Price'
};

const OWNEDCOUNT__TEXTLABEL = {
  polish: 'Posiadane sztuki',
  english: 'Owned quantity'
};

const USEBUTTON__TEXTLABEL = {
  polish: 'Użyj',
  english: 'Use'
};

const MINPRICE__TEXTLABEL = {
  polish: 'Cena min.',
  english: 'Min. price'
};

const INCART__TEXTLABEL = {
  polish: 'W koszyku',
  english: 'In cart'
};



function ProductCardPrice({
  priceAmount,
  salePriceAmount,
  rankDiscountedPrice,
  appliedDiscounts,
  priceEmoji,
  size = 'md',
  language,
}) {
  const display = getShopItemPriceDisplay({
    priceAmount,
    salePriceAmount,
    rankDiscountedPrice,
    appliedDiscounts,
  });
  const catalogPriceHint = getShopCatalogPriceHint(display);

  if (display.mode === 'badge') {
    const strikeHint = getShopStrikePriceHint(display);

    return (
      <div
        className="maq-product-card__price-row"
        aria-label={PRICEPREVIOUSLY__TEXTLABEL[language].replace('${price}', display.displayPrice).replace('${oldPrice}', display.strikePrice)}
      >
        {strikeHint ? (
          <InfoTooltip
            text={strikeHint}
            className="maq-product-card__price-hover"
          >
            <CurrencyDisplay
              amount={display.strikePrice}
              symbol={priceEmoji}
              size={size}
              className="maq-product-card__price-value maq-product-card__price-value--original"
            />
          </InfoTooltip>
        ) : (
          <CurrencyDisplay
            amount={display.strikePrice}
            symbol={priceEmoji}
            size={size}
            className="maq-product-card__price-value maq-product-card__price-value--original"
          />
        )}
        <InfoTooltip
          text={catalogPriceHint}
          className="maq-product-card__price-hover"
        >
          <div className="maq-product-card__sale-tag">
            <CurrencyDisplay
              amount={display.displayPrice}
              symbol={priceEmoji}
              size="md"
              className="maq-product-card__price-value maq-product-card__price-value--sale"
            />
          </div>
        </InfoTooltip>
      </div>
    );
  }

  if (display.mode === 'rank') {
    return (
      <InfoTooltip
        text={catalogPriceHint}
        className="maq-product-card__price-hover"
      >
        <div className="maq-product-card__price-row maq-product-card__price-row--rank">
          <CurrencyDisplay
            amount={display.displayPrice}
            symbol={priceEmoji}
            size={size}
            className="maq-product-card__price-value"
          />
        </div>
      </InfoTooltip>
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

  appliedDiscounts,

  minPrice,

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

  buyLabel = null,

  addToCartLabel = null,

  disabled = false,

  isRankLocked = false,

  lockedReason = null,

  isInCart = false,

  className = '',

  inventoryMode = false,

  ownedQuantity = 1,

  onUse,

  readOnly = false,

  isExtraLife = false,

  isUsed = false,

  isPurchasedHistory = false,

  dateLabel = null,

  onDoubleClick = null,

  isPublished,

}) {

  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { symbol: livesSymbol } = useGroupLives();

  const showLecturerTile = showLecturerActions && isPublished !== undefined;

  const icon = useMemo(

    () => (
      isExtraLife
        ? resolveExtraLifeItemIcon(livesSymbol)
        : parseShopItemImageRef(imageRef ?? imageUrl)
    ),

    [imageRef, imageUrl, isExtraLife, livesSymbol],

  );

  const resolvedImageAlt = imageAlt ?? name;

  const isPreview = variant === 'preview';

  const isInventory = inventoryMode === true;

  const showCartButton = !hideAddToCart && !hideActions && !isInventory && !isUsed && !isPurchasedHistory;

  const showFooter = isInventory || !hideActions || isPreview || isUsed || isPurchasedHistory || (priceAmount != null);

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

        isExtraLife ? 'maq-product-card--extra-life' : '',

        isUsed ? 'maq-product-card--used' : '',

        isPurchasedHistory ? 'maq-product-card--purchased' : '',

        className,

      ]

        .filter(Boolean)

        .join(' ')}

      style={cardStyle}
      title={isRankLocked ? (lockedReason ?? DEFAULTLOCKEDREASON__TEXTLABEL[LANGUAGE]) : undefined}
      onDoubleClick={() => onDoubleClick() }


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



          {showLecturerTile ? (
            <span
              className={[
                'maq-product-card__visibility',
                isPublished
                  ? 'maq-product-card__visibility--public'
                  : 'maq-product-card__visibility--hidden',
              ].join(' ')}
            >
              {getTileVisibilityLabel(isPublished, 'item')}
            </span>
          ) : null}

          {showLecturerActions ? (

            <div className="maq-product-card__lecturer-actions">

              <button

                type="button"

                className="maq-product-card__action-btn"

                aria-label={EDITBUTTON__TEXTLABEL[LANGUAGE].replace('${name}', name)}

                onClick={(event) => {

                  event.stopPropagation();

                  onEdit?.();

                }}

              >

                <EditIcon />

              </button>

              {!isExtraLife && onDelete ? (

              <button

                type="button"

                className="maq-product-card__action-btn maq-product-card__action-btn--danger"

                aria-label={DELETEBUTTON__TEXTLABEL[LANGUAGE].replace('${name}', name)}

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

              ) : null}

            </div>

          ) : null}

        </header>



        {(storyDescription || didacticDescription || !isPreview) ? (
          <div className="maq-product-card__descriptions">
            {(storyDescription || !isPreview) ? (
              <div className="maq-product-card__section">
                <span className="maq-product-card__section-label">{STORYDESCRIPTION__TEXTLABEL[LANGUAGE]}</span>
                <p
                  className="maq-product-card__story-text"
                  title={isPreview ? undefined : storyDescription || undefined}
                >
                  {storyDescription || '\u00A0'}
                </p>
              </div>
            ) : null}

            {(didacticDescription || !isPreview) ? (
              <div className="maq-product-card__section">
                <span className="maq-product-card__section-label">{DIDACTICDESCRIPTION__TEXTLABEL[LANGUAGE]}</span>
                <p
                  className="maq-product-card__didactic-text"
                  title={isPreview ? undefined : didacticDescription || undefined}
                >
                  {didacticDescription || '\u00A0'}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

      </div>



      {showFooter ? (

        <footer className="maq-product-card__footer">

          {isUsed ? (
            <div className="maq-product-card__price-bar">
              <span className="maq-product-card__section-label">{dateLabel || USEDITEM__TEXTLABEL[LANGUAGE]}</span>
            </div>
          ) : isPurchasedHistory ? (
            <>
              <div className="maq-product-card__price-bar">
                <span className="maq-product-card__section-label">{PRICE__TEXTLABEL[LANGUAGE]}</span>
                <ProductCardPrice
                  priceAmount={priceAmount}
                  priceEmoji={priceEmoji}
                  language={LANGUAGE}
                />
              </div>
              {dateLabel ? (
                <div className="maq-product-card__date-bar">
                  <span className="maq-product-card__section-label">{dateLabel}</span>
                </div>
              ) : null}
            </>
          ) : isInventory ? (
            <>
              <div className="maq-product-card__price-bar">
                <span className="maq-product-card__section-label">{OWNEDCOUNT__TEXTLABEL[LANGUAGE]}</span>
                <span className="maq-product-card__owned-count">{ownedQuantity}</span>
              </div>

              {!readOnly && !hideActions ? (
                <div className="maq-product-card__actions">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={disabled}
                    onClick={onUse}
                    className="maq-product-card__buy-btn"
                  >
                    {USEBUTTON__TEXTLABEL[LANGUAGE]}
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <>
          <div className="maq-product-card__price-bar">

            <span className="maq-product-card__section-label">{PRICE__TEXTLABEL[LANGUAGE]}</span>

            <ProductCardPrice

              priceAmount={priceAmount}

              salePriceAmount={salePriceAmount}

              rankDiscountedPrice={rankDiscountedPrice}

              appliedDiscounts={appliedDiscounts}

              priceEmoji={priceEmoji}

              language={LANGUAGE}

            />

          </div>

          {showLecturerActions && minPrice != null && Number(minPrice) > 0 ? (
            <div className="maq-product-card__min-price-bar">
              <span className="maq-product-card__section-label">{MINPRICE__TEXTLABEL[LANGUAGE]}</span>
              <CurrencyDisplay
                amount={Number(minPrice)}
                symbol={priceEmoji}
                size="sm"
                className="maq-product-card__min-price-value"
              />
            </div>
          ) : null}



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

                  {isInCart ? INCART__TEXTLABEL[LANGUAGE] : (addToCartLabel ?? DEFAULTADDTOCART__TEXTLABEL[LANGUAGE])}

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

                {buyLabel ?? DEFAULTBUY__TEXTLABEL[LANGUAGE]}

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


