import { Link, useParams } from 'react-router-dom';
import { groupShopAddPath } from '../../../routes/pathRegistry.js';
import '../RouteContent.css';
import './GroupShopContent.css';

export default function GroupShopContent() {
  const { groupId } = useParams();

  return (
    <section className="route-content group-shop-content" aria-labelledby="group-shop-title">
      <h1 id="group-shop-title" className="route-content__title">
        Sklep
      </h1>
      {groupId ? (
        <p className="group-shop-content__actions">
          <Link className="group-shop-content__add-link" to={groupShopAddPath(groupId)}>
            Dodaj przedmiot do sklepu
          </Link>
        </p>
      ) : null}
    </section>
  );
}
