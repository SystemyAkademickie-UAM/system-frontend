import PageAvailable from '../../../components/page/PageAvailable.jsx';
import GroupShopAdd from './GroupShopAddContentContent.jsx';

export default function GroupShopAddContent() {
  return (
    <PageAvailable
      title="Dodawanie przedmiotu do sklepu"
      description="Formularz tworzenia nowego przedmiotu dostępnego do zakupu w sklepie grupy."
    >
      <GroupShopAdd />
    </PageAvailable>
  );
}
