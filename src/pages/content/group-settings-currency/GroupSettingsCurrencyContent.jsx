import { useState } from 'react';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import '../group-settings/GroupSettingsForm.css';
import GroupSettingsCurrencyContentContent from './GroupSettingsCurrencyContentContent.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const PAGETITLE__TEXTLABEL = {
  polish: 'Ustawienia waluty',
  english: 'Currency settings'
};

export default function GroupSettingsCurrencyContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const nav = useGroupSubNav('group-settings');

  return (
    <SectionPageLayout
      className="page-unavailable group-settings-page"
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      <GroupSettingsCurrencyContentContent />
    </SectionPageLayout>
  );
}
