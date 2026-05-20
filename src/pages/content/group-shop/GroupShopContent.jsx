import { useParams } from 'react-router-dom';
import { Button, PageHeader } from '../../../components/ui/index.js';
import { RoleVisibility } from '../../../components/guards/index.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { groupShopAddPath } from '../../../routes/pathRegistry.js';
import './GroupShopContent.css';

export default function GroupShopContent() {
  const { groupId } = useParams();

  return (
    <section className="group-shop-content" aria-labelledby="group-shop-title">
      <div className="group-shop-content__header">
        <PageHeader
          title="Sklep"
          description="Przeglądaj i kupuj przedmioty."
        />

        <RoleVisibility allowedRoles={[APP_ROLE.LECTURER, APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN]}>
          {groupId ? (
            <Button to={groupShopAddPath(groupId)} variant="primary">
              Dodaj produkt
            </Button>
          ) : null}
        </RoleVisibility>
      </div>

      <p style={{ color: 'var(--color-text-secondary)', padding: '1rem 0' }}>
        Lista produktów sklepu — w budowie.
      </p>
    </section>
  );
}
