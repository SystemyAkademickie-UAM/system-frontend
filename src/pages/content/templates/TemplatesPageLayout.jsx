import { Outlet } from 'react-router-dom';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useAppSubNav from '../../../navigation/useAppSubNav.js';
import './TemplatesPageLayout.css';

export default function TemplatesPageLayout() {
  const nav = useAppSubNav('app-templates');

  return (
    <SectionPageLayout
      className="templates-page page-unavailable"
      title="Szablony"
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      <Outlet />
    </SectionPageLayout>
  );
}
