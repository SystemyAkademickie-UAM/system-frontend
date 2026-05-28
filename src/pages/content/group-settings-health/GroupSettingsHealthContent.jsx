import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function GroupSettingsHealthContent() {
  const nav = useGroupSubNav('group-settings');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="System żyć"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
