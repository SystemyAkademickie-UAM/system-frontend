import { useState } from 'react';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import GroupMainSubpageHeader from '../group-main/shared/GroupMainSubpageHeader.jsx';
import '../../../components/page/PageUnavailable.css';
import '../group-main/shared/groupMainSubpageHeader.css';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const NOTICETEXT__TEXTLABEL = {
  polish: 'Ta strona jest obecnie niedostępna. Funkcjonalność zostanie udostępniona w kolejnej wersji aplikacji.',
  english: 'This page is currently unavailable. Functionality will be available in the next version of the application.'
};

const EYEBROWTEXT__TEXTLABEL = {
  polish: 'Rywalizacja',
  english: 'Competition'
};

const STUDENTVIEWTITLE__TEXTLABEL = {
  polish: 'Ranking aktywności',
  english: 'Activities Ranking'
};

export default function RankingActivitiesContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const nav = useGroupSubNav('group-ranking');
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  const notice = (
    <p className="page-unavailable__notice" role="status">
      {NOTICETEXT__TEXTLABEL[LANGUAGE]}
    </p>
  );

  if (isStudentView) {
    return (
      <section className="page-unavailable group-ranking-page group-ranking-page--student">
        <GroupMainSubpageHeader eyebrow={EYEBROWTEXT__TEXTLABEL[LANGUAGE]} title={STUDENTVIEWTITLE__TEXTLABEL[LANGUAGE]} />
        {notice}
      </section>
    );
  }

  return (
    <SectionPageLayout
      className="page-unavailable"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      {notice}
    </SectionPageLayout>
  );
}
