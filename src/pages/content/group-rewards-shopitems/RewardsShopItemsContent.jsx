import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function RewardsShopItemsContent() {
  const nav = useGroupSubNav('group-rewards');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Przedmioty sklepowe"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
