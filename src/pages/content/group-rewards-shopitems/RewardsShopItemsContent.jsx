import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, ShopToggleButton, SubNav, useToast } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { useGroupShopOpen } from '../group-shop/useGroupShop.js';
import '../../../components/page/PageUnavailable.css';
import '../group-rewards/shared/rewardsShared.css';
import './RewardsShopItemsContent.css';

export default function RewardsShopItemsContent() {
  const nav = useGroupSubNav('group-rewards');
  const { groupId } = useParams();
  const { showError } = useToast();
  const { isShopOpen, toggleShopOpen } = useGroupShopOpen(groupId);

  const handleToggleShopOpen = useCallback(async () => {
    const result = await toggleShopOpen();
    if (!result?.ok) {
      showError(result?.error ?? 'Nie udało się zmienić statusu sklepu.');
    }
  }, [showError, toggleShopOpen]);

  return (
    <section className="page-unavailable rewards-page rewards-shop-items" aria-label={nav.sectionTitle}>
      <div className="rewards-page__header-row">
        <PageHeader
          title={nav.sectionTitle}
          description="Zarządzaj katalogiem przedmiotów sklepowych kursu."
        />

        <ShopToggleButton
          isShopOpen={isShopOpen}
          onToggle={handleToggleShopOpen}
          className="rewards-shop-items__toggle"
        />
      </div>

      <SubNav
        ariaLabel={nav.ariaLabel}
        items={nav.items}
        className="rewards-page__sub-nav"
      />

      <p className="rewards-shop-items__hint">
        Przełącznik otwarcia sklepu synchronizuje się z backendem i ze stroną
        {' '}
        <strong>/shop</strong>
        . Zamknięty sklep pokazuje zasłonę „Zamknięte” u studentów.
      </p>
    </section>
  );
}
