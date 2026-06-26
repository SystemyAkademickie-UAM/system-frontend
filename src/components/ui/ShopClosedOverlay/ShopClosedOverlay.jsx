import ProductCard from '../ProductCard/ProductCard.jsx';
import './ShopClosedOverlay.css';

/**
 * Zasłona nad katalogiem produktów — zamknięty sklep lub koniec gry (brak żyć).
 * Zamknięcie sklepu ma priorytet nad blokadą żyć.
 *
 * @param {Object} props
 * @param {boolean} props.isClosed
 * @param {boolean} [props.isGameOver=false]
 * @param {import('../../../utils/shop/shopItem.types.js').ShopItem} [props.extraLifeProduct]
 * @param {() => void} [props.onExtraLifeBuy]
 * @param {string} [props.className]
 */
export default function ShopClosedOverlay({
  isClosed,
  isGameOver = false,
  extraLifeProduct,
  onExtraLifeBuy,
  className = '',
}) {
  const showClosed = isClosed;
  const showGameOver = !isClosed && isGameOver;
  const isVisible = showClosed || showGameOver;

  return (
    <div
      className={[
        'maq-shop-closed-overlay',
        isVisible ? 'maq-shop-closed-overlay--visible' : '',
        showGameOver ? 'maq-shop-closed-overlay--game-over' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!isVisible}
    >
      <div className="maq-shop-closed-overlay__panel">
        {showClosed ? (
          <p className="maq-shop-closed-overlay__message">Zamknięte</p>
        ) : null}

        {showGameOver ? (
          <>
            <div className="maq-shop-closed-overlay__game-over-copy">
              <p className="maq-shop-closed-overlay__message">Koniec gry</p>
              <p className="maq-shop-closed-overlay__subtitle">.. dla Twoich zakupów</p>
              <p className="maq-shop-closed-overlay__hint">
                Aby odblokować ponownie sklep zakup dodatkowe życie
              </p>
            </div>

            {extraLifeProduct ? (
              <div className="maq-shop-closed-overlay__extra-life">
                <ProductCard
                  variant="extra-life"
                  itemId={extraLifeProduct.id}
                  name={extraLifeProduct.name}
                  storyDescription={extraLifeProduct.storyDescription}
                  didacticDescription={extraLifeProduct.didacticDescription}
                  priceAmount={extraLifeProduct.priceAmount}
                  salePriceAmount={extraLifeProduct.salePriceAmount}
                  rankDiscountedPrice={extraLifeProduct.rankDiscountedPrice}
                  imageRef={extraLifeProduct.imageRef}
                  hideAddToCart
                  onBuy={onExtraLifeBuy}
                  className="maq-shop-closed-overlay__extra-life-card"
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
