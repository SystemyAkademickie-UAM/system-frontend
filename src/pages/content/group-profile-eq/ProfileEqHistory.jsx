import { useProfileInventoryHistory } from '../../../hooks/shop/useProfileInventoryHistory.js';
import { useGroupCurrency } from '../../../context/GroupCurrencyContext.jsx';
import './ProfileEqHistory.css';

export default function ProfileEqHistory({ groupId, studentAccountId }) {
  const { history, isLoading, error } = useProfileInventoryHistory(groupId, { studentAccountId });
  const { symbol: currencyEmoji } = useGroupCurrency();

  if (isLoading) {
    return <p className="profile-eq-page__message">Ładowanie historii ekwipunku…</p>;
  }

  if (error) {
    return <p className="profile-eq-page__error" role="alert">{error}</p>;
  }

  if (history.length === 0) {
    return <p className="profile-eq-page__message">Brak historii operacji.</p>;
  }

  return (
    <div className="profile-eq-history">
      <ul className="profile-eq-history__list">
        {history.map((record) => {
          const isPurchase = record.type === 'SHOP_PURCHASE';
          const typeClass = isPurchase 
            ? 'profile-eq-history__item-type--purchase' 
            : 'profile-eq-history__item-type--use';
            
          return (
            <li key={record.id} className="profile-eq-history__item">
              <div className="profile-eq-history__item-header">
                <span className={`profile-eq-history__item-type ${typeClass}`}>
                  {isPurchase ? 'Zakup' : 'Użycie'}
                </span>
                <span className="profile-eq-history__item-date">
                  {new Date(record.date).toLocaleString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="profile-eq-history__item-details">
                <span className="profile-eq-history__item-name">
                  {record.itemName || 'Nieznany przedmiot'}
                  {record.isExtraLife ? ' (Dodatkowe życie)' : ''}
                </span>
                
                {isPurchase && record.price != null && (
                  <span className="profile-eq-history__item-price">
                    {record.price} {currencyEmoji || 'pkt'}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
