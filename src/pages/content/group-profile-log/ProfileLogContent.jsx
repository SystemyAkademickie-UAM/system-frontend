import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function ProfileLogContent() {
  const nav = useGroupSubNav('group-profile');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Aktywności"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
