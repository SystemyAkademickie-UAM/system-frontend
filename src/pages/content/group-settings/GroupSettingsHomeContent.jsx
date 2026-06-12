import { PageHeader, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import './GroupSettingsForm.css';
import TemporaryGroupsListCreator from './TemporaryGroupsListCreator.jsx';

export default function GroupSettingsHomeContent() {
  const nav = useGroupSubNav('group-settings');

  return (
    <section className="page-unavailable members-page group-settings-page" aria-label={nav.sectionTitle}>
      <PageHeader
        title={nav.sectionTitle}
        description="Edytuj podstawowe informacje o grupie — nazwę, przedmiot, baner i opis."
      />

      <div className="members-page__nav-row">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="members-page__sub-nav"
        />
      </div>

      <TemporaryGroupsListCreator />
    </section>
  );
}
