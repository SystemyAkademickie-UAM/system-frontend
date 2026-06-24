import { useSearchParams } from 'react-router-dom';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import '../../../components/page/PageUnavailable.css';
import '../group-settings/GroupSettingsForm.css';
import GroupShopAdd from './GroupShopAddContentContent.jsx';

export default function GroupShopAddContent() {
  const [searchParams] = useSearchParams();
  const editingItemId = searchParams.get('itemId');
  const title = editingItemId ? 'Edycja przedmiotu sklepowego' : 'Dodawanie przedmiotu do sklepu';

  return (
    <SectionPageLayout
      className="page-unavailable group-settings-page group-shop-add-page"
      title={title}
    >
      <GroupShopAdd />
    </SectionPageLayout>
  );
}
