import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function RankingActivitiesContent() {
  const nav = useGroupSubNav('group-ranking');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Ranking aktywności"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
