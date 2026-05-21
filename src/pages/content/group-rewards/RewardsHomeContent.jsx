import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function RewardsHomeContent() {
  const nav = useGroupSubNav('group-rewards');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Rangi"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
