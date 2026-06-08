import { PageHeader, ShopToggleButton, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { useParams } from 'react-router-dom';
import { useGroupShopOpen } from '../group-shop/useGroupShop.js';
import '../../../components/page/PageUnavailable.css';
import '../group-rewards/shared/rewardsShared.css';
import './RewardsShopItemsContent.css';

export default function RewardsShopItemsContent() {
  const nav = useGroupSubNav('group-rewards');
  const { groupId } = useParams();
  const { isShopOpen, toggleShopOpen } = useGroupShopOpen(groupId);

  return (
    <section className="page-unavailable rewards-page rewards-shop-items" aria-label={nav.sectionTitle}>
      <div className="rewards-page__header-row">
        <PageHeader
          title={nav.sectionTitle}
          description="Zarządzaj katalogiem przedmiotów sklepowych kursu."
        />

        <ShopToggleButton
          isShopOpen={isShopOpen}
          onToggle={toggleShopOpen}
          className="rewards-shop-items__toggle"
        />
      </div>

      <SubNav
        ariaLabel={nav.ariaLabel}
        items={nav.items}
        className="rewards-page__sub-nav"
      />

      <p className="rewards-shop-items__hint">
        Przełącznik otwarcia sklepu jest współdzielony ze stroną
        {' '}
        <strong>/shop</strong>
        . Zamknięty sklep pokazuje zasłonę „Zamknięte” u studentów i prowadzącego.
      </p>
    </section>
  );
}
