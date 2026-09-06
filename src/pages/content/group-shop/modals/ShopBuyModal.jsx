import { useState } from 'react';
import { Modal, ProductCard } from '../../../../components/ui/index.js';
import { resolveShopCategoryDetails } from '../../../../utils/shop/shopCategories.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import './shopModals.css';

const BUY_CONFIRM_TITLE__TEXTLABEL = {
  polish: 'Potwierdź zakup',
  english: 'Confirm Purchase'
};

const BUY_CONFIRM_BUTTON__TEXTLABEL = {
  polish: 'Kup teraz',
  english: 'Buy Now'
};

const BUY_QUERY_TEXT__TEXTLABEL = {
  polish: 'Czy na pewno chcesz kupić ten produkt?',
  english: 'Are you sure you want to buy this product?'
};

export default function ShopBuyModal({
  isOpen,
  item,
  categoriesById,
  onClose,
  onConfirm,
}) {
  if (!item) {
    return null;
  }

  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const categoryDetails = resolveShopCategoryDetails(item.categories, categoriesById);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={BUY_CONFIRM_TITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={onConfirm}
      confirmLabel={BUY_CONFIRM_BUTTON__TEXTLABEL[LANGUAGE]}
      size="md"
      className="shop-modal"
    >
      <p className="shop-modal__lead">
        {BUY_QUERY_TEXT__TEXTLABEL[LANGUAGE]}
      </p>
      <ProductCard
        variant="preview"
        itemId={item.id}
        name={item.name}
        storyDescription={item.storyDescription}
        didacticDescription={item.didacticDescription}
        priceAmount={item.priceAmount}
        salePriceAmount={item.salePriceAmount}
        rankDiscountedPrice={item.rankDiscountedPrice}
        imageRef={item.imageRef}
        categoryDetails={categoryDetails}
        hideActions
        isExtraLife={item.isExtraLife === true}
        className="shop-modal__preview"
      />
    </Modal>
  );
}
