import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import '../group-settings/GroupSettingsForm.css';
import GroupSettingsHealthContentContent from './GroupSettingsHealthContentContent.jsx';

export default function GroupSettingsHealthContent() {
  const nav = useGroupSubNav('group-settings');

  return (
    <SectionPageLayout
      className="page-unavailable group-settings-page"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      <GroupSettingsHealthContentContent />
    </SectionPageLayout>
  );
}
