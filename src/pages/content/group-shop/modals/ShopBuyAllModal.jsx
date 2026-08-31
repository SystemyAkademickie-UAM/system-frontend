import { useState } from 'react';
import { Modal, CurrencyDisplay } from '../../../../components/ui/index.js';
import ShopItemPriceRow from '../../../../components/ui/ShopItemPriceRow/ShopItemPriceRow.jsx';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import './shopModals.css';

const BUYALL_CONFIRM_TITLE__TEXTLABEL = {
  polish: 'Potwierdź zakup koszyka',
  english: 'Confirm Cart Purchase'
};

const BUYALL_CONFIRM_BUTTON__TEXTLABEL = {
  polish: 'Kup wszystko',
  english: 'Buy All'
};

const BUYALL_QUERY_TEXT__TEXTLABEL = {
  polish: 'Czy na pewno chcesz kupić {count} {countPlural} z koszyka?',
  english: 'Are you sure you want to buy {count} {countPlural} from the cart?'
};

const BUYALL_QUERY_PRODUCT_SINGULAR__TEXTLABEL = {
  polish: 'produkt',
  english: 'product'
};

const BUYALL_QUERY_PRODUCT_PLURAL__TEXTLABEL = {
  polish: 'produkty',
  english: 'products'
};

const BUYALL_TOTAL_LABEL__TEXTLABEL = {
  polish: 'Razem',
  english: 'Total'
};

function getQueryProductLabel(count, LANGUAGE) {
  return count === 1
    ? BUYALL_QUERY_PRODUCT_SINGULAR__TEXTLABEL[LANGUAGE]
    : BUYALL_QUERY_PRODUCT_PLURAL__TEXTLABEL[LANGUAGE];
}

export default function ShopBuyAllModal({
  isOpen,
  cartItems,
  cartTotal,
  onClose,
  onConfirm,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  if (!cartItems?.length) {
    return null;
  }

  const queryText = BUYALL_QUERY_TEXT__TEXTLABEL[LANGUAGE]
    .replace('{count}', cartItems.length)
    .replace('{countPlural}', getQueryProductLabel(cartItems.length, LANGUAGE));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={BUYALL_CONFIRM_TITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmLabel={BUYALL_CONFIRM_BUTTON__TEXTLABEL[LANGUAGE]}
      size="sm"
      className="shop-modal"
    >
      <p className="shop-modal__lead">
        {queryText}
      </p>
      <ul className="shop-modal__summary-list">
        {cartItems.map((item) => (
          <li key={item.id} className="shop-modal__summary-item">
            <span>{item.name}</span>
            <ShopItemPriceRow
              priceAmount={item.priceAmount}
              salePriceAmount={item.salePriceAmount}
              rankDiscountedPrice={item.rankDiscountedPrice}
              size="sm"
            />
          </li>
        ))}
      </ul>
      <div className="shop-modal__summary-total">
        <span>{BUYALL_TOTAL_LABEL__TEXTLABEL[LANGUAGE]}</span>
        <CurrencyDisplay amount={cartTotal} size="md" />
      </div>
    </Modal>
  );
}
