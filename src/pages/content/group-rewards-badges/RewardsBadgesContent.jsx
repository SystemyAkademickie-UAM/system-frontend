import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function RewardsBadgesContent() {
  const nav = useGroupSubNav('group-rewards');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Odznaki"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
