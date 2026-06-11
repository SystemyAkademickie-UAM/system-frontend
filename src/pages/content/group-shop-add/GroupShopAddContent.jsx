import { PageHeader } from '../../../components/ui/index.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import GroupShopAdd from './GroupShopAddContentContent.jsx';

export default function GroupShopAddContent() {
  return (
    <section className="page-unavailable members-page group-settings-page" aria-label="Dodawanie przedmiotu">
      <PageHeader
        title="Dodawanie przedmiotu do sklepu"
        description="Formularz tworzenia nowego przedmiotu dostępnego do zakupu w sklepie grupy."
      />

      <GroupShopAdd />
    </section>
  );
}
