import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function GroupSettingsCurrencyContent() {
  const nav = useGroupSubNav('group-settings');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Waluta"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
