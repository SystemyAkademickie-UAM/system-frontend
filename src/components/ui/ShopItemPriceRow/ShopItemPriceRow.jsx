import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import InfoTooltip from '../InfoTooltip/InfoTooltip.jsx';
import { getShopCatalogPriceHint, getShopItemPriceDisplay, getShopStrikePriceHint } from '../../../utils/shop/shopPricing.js';
import '../ProductCard/ProductCard.css';

/**
 * Wiersz ceny produktu — ten sam układ co na kafelku sklepu.
 *
 * @param {{
 *   priceAmount: number,
 *   salePriceAmount?: number,
 *   rankDiscountedPrice?: number,
 *   appliedDiscounts?: Array<{ source: 'rank' | 'badge', name: string, type: 'percent' | 'fixed', value: number, formattedText: string }>,
 *   priceEmoji?: string,
 *   size?: 'sm' | 'md',
 * }} props
 */
export default function ShopItemPriceRow({
  priceAmount,
  salePriceAmount,
  rankDiscountedPrice,
  appliedDiscounts,
  priceEmoji,
  size = 'sm',
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
      <div className="maq-product-card__price-row" aria-label={`Cena ${display.displayPrice}`}>
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
