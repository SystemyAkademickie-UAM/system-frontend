import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function RankingHomeContent() {
  const nav = useGroupSubNav('group-ranking');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Twoje informacje"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
