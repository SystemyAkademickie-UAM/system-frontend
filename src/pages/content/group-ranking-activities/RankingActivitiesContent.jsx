import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';

export default function RankingActivitiesContent() {
  const nav = useGroupSubNav('group-ranking');

  return (
    <SectionPageLayout
      className="page-unavailable"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      <p className="page-unavailable__notice" role="status">
        Ta strona jest obecnie niedostępna. Funkcjonalność zostanie udostępniona w kolejnej wersji aplikacji.
      </p>
    </SectionPageLayout>
  );
}
