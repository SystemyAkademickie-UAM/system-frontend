import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import InfoTooltip from '../InfoTooltip/InfoTooltip.jsx';
import { getShopCatalogPriceHint, getShopItemPriceDisplay } from '../../../utils/shop/shopPricing.js';
import '../ProductCard/ProductCard.css';

/**
 * Wiersz ceny produktu — ten sam układ co na kafelku sklepu.
 *
 * @param {{
 *   priceAmount: number,
 *   salePriceAmount?: number,
 *   rankDiscountedPrice?: number,
 *   priceEmoji?: string,
 *   size?: 'sm' | 'md',
 * }} props
 */
export default function ShopItemPriceRow({
  priceAmount,
  salePriceAmount,
  rankDiscountedPrice,
  priceEmoji,
  size = 'sm',
}) {
  const display = getShopItemPriceDisplay({
    priceAmount,
    salePriceAmount,
    rankDiscountedPrice,
  });
  const catalogPriceHint = getShopCatalogPriceHint(display);

  if (display.mode === 'badge') {
    return (
      <div className="maq-product-card__price-row" aria-label={`Cena ${display.displayPrice}`}>
        <CurrencyDisplay
          amount={display.strikePrice}
          symbol={priceEmoji}
          size={size}
          className="maq-product-card__price-value maq-product-card__price-value--original"
        />
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
      <div className="maq-product-card__price-row maq-product-card__price-row--rank">
        <InfoTooltip
          text={catalogPriceHint}
          className="maq-product-card__price-hover"
        >
          <CurrencyDisplay
            amount={display.displayPrice}
            symbol={priceEmoji}
            size={size}
            className="maq-product-card__price-value"
          />
        </InfoTooltip>
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
