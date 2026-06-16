import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import '../../../components/page/PageUnavailable.css';
import '../group-settings/GroupSettingsForm.css';
import GroupShopAdd from './GroupShopAddContentContent.jsx';

export default function GroupShopAddContent() {
  return (
    <SectionPageLayout
      className="page-unavailable group-settings-page group-shop-add-page"
      title="Dodawanie przedmiotu do sklepu"
    >
      <GroupShopAdd />
    </SectionPageLayout>
  );
}
