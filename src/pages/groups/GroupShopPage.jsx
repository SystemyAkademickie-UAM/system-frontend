import { Link, useParams } from 'react-router-dom';
import PagePlaceholder from '../../components/page/PagePlaceholder.jsx';
import { groupShopAddPath } from '../../routes/pathRegistry.js';

export default function GroupShopPage() {
  const { groupId } = useParams();

  return (
    <>
      <PagePlaceholder name="SKLEP" />
      {groupId ? (
        <p className="shop-page__actions">
          <Link className="shop-page__add-link" to={groupShopAddPath(groupId)}>
            Dodaj przedmiot do sklepu
          </Link>
        </p>
      ) : null}
    </>
  );
}
