import { Modal, ProductCard } from '../../../../components/ui/index.js';
import { resolveShopCategoryDetails } from '../../../../utils/shop/shopCategories.js';
import './shopModals.css';

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

  const categoryDetails = resolveShopCategoryDetails(item.categories, categoriesById);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Potwierdź zakup"
      onConfirm={onConfirm}
      confirmLabel="Kup teraz"
      size="md"
      className="shop-modal"
    >
      <p className="shop-modal__lead">
        Czy na pewno chcesz kupić ten produkt?
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
        className="shop-modal__preview"
        disabled
      />
    </Modal>
  );
}
