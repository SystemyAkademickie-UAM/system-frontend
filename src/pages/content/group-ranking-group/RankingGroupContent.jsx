import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function RankingGroupContent() {
  const nav = useGroupSubNav('group-ranking');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Ranking grupy"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
