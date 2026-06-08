import { Modal, ProductCard } from '../../../../components/ui/index.js';
import { resolveShopCategoryLabels } from '../shopCategories.js';
import './shopModals.css';

export default function ShopBuyModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  if (!item) {
    return null;
  }

  const categoryLabels = resolveShopCategoryLabels(item.categories);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Potwierdź zakup"
      onConfirm={handleConfirm}
      confirmLabel="Kup teraz"
      size="md"
      className="shop-modal"
    >
      <p className="shop-modal__lead">
        Czy na pewno chcesz kupić ten produkt?
      </p>
      <ProductCard
        variant="preview"
        name={item.name}
        storyDescription={item.storyDescription}
        didacticDescription={item.didacticDescription}
        priceAmount={item.priceAmount}
        salePriceAmount={item.salePriceAmount}
        imageUrl={item.imageUrl}
        categories={categoryLabels}
        hideActions
        className="shop-modal__preview"
        disabled
      />
    </Modal>
  );
}
