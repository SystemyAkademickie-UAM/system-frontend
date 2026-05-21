import { PageHeader, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import ProfileContent from './ProfileContent.jsx';
import './ProfileHomeContent.css';

export default function ProfileHomeContent() {
  const nav = useGroupSubNav('group-profile');

  return (
    <section className="profile-page" aria-label={nav.sectionTitle}>
      <PageHeader title={nav.sectionTitle} description="Odznaki" />
      <SubNav
        ariaLabel={nav.ariaLabel}
        items={nav.items}
        className="page-unavailable__sub-nav"
      />
      <ProfileContent />
    </section>
  );
}
