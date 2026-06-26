import CurrencyDisplay from '../Currency/CurrencyDisplay.jsx';
import InfoTooltip from '../InfoTooltip/InfoTooltip.jsx';
import { getShopItemPriceDisplay } from '../../../utils/shop/shopPricing.js';
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

  if (display.mode === 'badge') {
    return (
      <div className="maq-product-card__price-row" aria-label={`Cena ${display.displayPrice}`}>
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
