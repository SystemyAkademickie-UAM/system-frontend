import { PageHeader, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import '../group-settings/GroupSettingsForm.css';

export default function GroupSettingsCurrencyContent() {
  const nav = useGroupSubNav('group-settings');

  return (
    <section className="page-unavailable members-page group-settings-page" aria-label={nav.sectionTitle}>
      <PageHeader
        title={nav.sectionTitle}
        description="Konfiguracja waluty grupy — nazwa, symbol i zasady przyznawania."
      />

      <div className="members-page__nav-row">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="members-page__sub-nav"
        />
      </div>

      <p className="members-page__notice" role="status">
        Ta strona jest obecnie niedostępna. Funkcjonalność zostanie udostępniona w kolejnej wersji aplikacji.
      </p>
    </section>
  );
}
