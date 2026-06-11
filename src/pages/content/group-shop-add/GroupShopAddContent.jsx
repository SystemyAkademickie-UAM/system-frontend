import PageAvailable from '../../../components/page/PageAvailable.jsx';
import GroupShopAddForm from './GroupShopAddForm.jsx';

export default function GroupShopAddContent() {
  return (
    <PageAvailable
      title="Dodawanie przedmiotu do sklepu"
      description="Wybierz gotowy szablon lub utwórz własny produkt dostępny w sklepie grupy."
    >
      <GroupShopAddForm />
    </PageAvailable>
  );
}
