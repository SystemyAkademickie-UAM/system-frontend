import './ProfileInventoryPanel.css';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ProductCard, useToast } from '../../../components/ui/index.js';
import { useGroupInventory } from '../group-shop/useGroupShop.js';
import './ProfileInventoryPanel.css';

export default function ProfileInventoryPanel() {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();
  const { entries, isLoading, error, useItem } = useGroupInventory(groupId);
  const [usingItemId, setUsingItemId] = useState(null);

  const handleUseItem = useCallback(async (itemId) => {
    setUsingItemId(itemId);
    const result = await useItem(itemId);
    setUsingItemId(null);

    if (!result.ok) {
      showError(result.error ?? 'Nie udało się użyć przedmiotu.');
      return;
    }

    showSuccess('Przedmiot został użyty.');
  }, [showError, showSuccess, useItem]);

  if (isLoading) {
    return <p className="profile-inventory__message">Ładowanie ekwipunku…</p>;
  }

  if (error) {
    return <p className="profile-inventory__error" role="alert">{error}</p>;
  }

  if (entries.length === 0) {
    return (
      <p className="profile-inventory__message">
        Twój plecak jest pusty. Kup przedmioty w sklepie grupy, aby pojawiły się tutaj.
      </p>
    );
  }

  return (
    <div className="profile-inventory">
      <p className="profile-inventory__lead">
        Przedmioty zakupione w sklepie grupy. Użycie przedmiotu rejestruje zdarzenie w backlogu prowadzącego.
      </p>

      <div className="profile-inventory__grid">
        {entries.map((entry) => (
          <article key={entry.id} className="profile-inventory__card-wrap">
            <ProductCard
              name={entry.item.name}
              storyDescription={entry.item.storyDescription}
              didacticDescription={entry.item.didacticDescription}
              priceAmount={entry.item.priceAmount}
              imageUrl={entry.item.imageUrl}
              hideActions
              disabled
              className="profile-inventory__card"
            />
            <div className="profile-inventory__meta">
              <span className="profile-inventory__quantity">×{entry.quantity}</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUseItem(entry.itemId)}
                disabled={usingItemId === entry.itemId}
              >
                {usingItemId === entry.itemId ? 'Używanie…' : 'Użyj'}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
