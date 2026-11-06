/**
 * @file GroupSettingsHomeContent.jsx
 * @description Główny komponent widoku strony dla obszaru GroupSettingsHomeContent.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import '../group-settings/GroupSettingsForm.css';
import TemporaryGroupsListCreator from './TemporaryGroupsListCreator.jsx';

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function GroupSettingsHomeContent() {

const nav = useGroupSubNav('group-settings');

  return (
    <SectionPageLayout
      className="page-unavailable group-settings-page"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      <TemporaryGroupsListCreator />
    </SectionPageLayout>
  );
}
