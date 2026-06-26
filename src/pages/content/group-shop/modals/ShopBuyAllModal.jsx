import { Modal, CurrencyDisplay } from '../../../../components/ui/index.js';
import { getShopItemEffectivePrice } from '../../../../utils/shop/shopPricing.js';
import './shopModals.css';
export default function ShopBuyAllModal({
  isOpen,
  cartItems,
  cartTotal,
  onClose,
  onConfirm,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  if (!cartItems?.length) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Potwierdź zakup koszyka"
      onConfirm={handleConfirm}
      confirmLabel="Kup wszystko"
      size="sm"
      className="shop-modal"
    >
      <p className="shop-modal__lead">
        Czy na pewno chcesz kupić
        {' '}
        <strong>{cartItems.length}</strong>
        {' '}
        {cartItems.length === 1 ? 'produkt' : 'produkty'}
        {' '}
        z koszyka?
      </p>
      <ul className="shop-modal__summary-list">
        {cartItems.map((item) => (
          <li key={item.id} className="shop-modal__summary-item">
            <span>{item.name}</span>
            <CurrencyDisplay amount={getShopItemEffectivePrice(item)} size="sm" />
          </li>
        ))}
      </ul>
      <div className="shop-modal__summary-total">
        <span>Razem</span>
        <CurrencyDisplay amount={cartTotal} size="md" />
      </div>
    </Modal>
  );
}
