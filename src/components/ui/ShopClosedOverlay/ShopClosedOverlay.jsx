import { useState } from 'react';
import ProductCard from '../ProductCard/ProductCard.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './ShopClosedOverlay.css';

/**
 * Zasłona nad katalogiem produktów — zamknięty sklep lub koniec gry (brak żyć).
 * Zamknięcie sklepu ma priorytet nad blokadą żyć.
 *
 * @param {Object} props
 * @param {boolean} props.isClosed
 * @param {boolean} [props.isGameOver=false]
 * @param {import('../../../utils/shop/shopItem.types.js').ShopItem} [props.extraLifeProduct]
 * @param {boolean} [props.extraLifeDisabled=false]
 * @param {() => void} [props.onExtraLifeBuy]
 * @param {string} [props.className]
 */
const CLOSEDSTORE__TEXTLABEL = {
  polish: 'Zamknięte',
  english: 'Closed',
};

const GAMEOVER__TEXTLABEL = {
  polish: 'Koniec gry',
  english: 'Game Over',
};

const GAMEOVERSUBTITLE__TEXTLABEL = {
  polish: '... dla Twoich zakupów',
  english: '... for your shopping',
};

const EXTRALIFEHINT__TEXTLABEL = {
  polish: 'Aby odblokować ponownie sklep zakup dodatkowe życie',
  english: 'To unlock the shop again, buy an extra life',
};

export default function ShopClosedOverlay({
  isClosed,
  isGameOver = false,
  extraLifeProduct,
  extraLifeDisabled = false,
  onExtraLifeBuy,
  className = '',
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

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
          <p className="maq-shop-closed-overlay__message">
            {CLOSEDSTORE__TEXTLABEL[LANGUAGE]}
          </p>
        ) : null}

        {showGameOver ? (
          <>
            <div className="maq-shop-closed-overlay__game-over-copy">
              <p className="maq-shop-closed-overlay__message">
                {GAMEOVER__TEXTLABEL[LANGUAGE]}
              </p>
              <p className="maq-shop-closed-overlay__subtitle">
                {GAMEOVERSUBTITLE__TEXTLABEL[LANGUAGE]}
              </p>
              {extraLifeProduct ? (
                <p className="maq-shop-closed-overlay__hint">
                  {EXTRALIFEHINT__TEXTLABEL[LANGUAGE]}
                </p>
              ) : null}
            </div>

            {extraLifeProduct ? (
              <div className="maq-shop-closed-overlay__extra-life">
                <ProductCard
                  itemId={extraLifeProduct.id}
                  name={extraLifeProduct.name}
                  storyDescription={extraLifeProduct.storyDescription}
                  didacticDescription={extraLifeProduct.didacticDescription}
                  priceAmount={extraLifeProduct.priceAmount}
                  salePriceAmount={extraLifeProduct.salePriceAmount}
                  rankDiscountedPrice={extraLifeProduct.rankDiscountedPrice}
                  appliedDiscounts={extraLifeProduct.appliedDiscounts}
                  imageRef={extraLifeProduct.imageRef}
                  isExtraLife
                  hideAddToCart
                  disabled={extraLifeDisabled}
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
