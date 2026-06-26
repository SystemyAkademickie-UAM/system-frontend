import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import GroupLogC from './MembersLogContentContent.jsx';

export default function MembersLogContent() {
  const nav = useGroupSubNav('group-members');

  return (
    <SectionPageLayout
      className="page-unavailable"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >

      <GroupLogC />
    </SectionPageLayout>
  );
}
