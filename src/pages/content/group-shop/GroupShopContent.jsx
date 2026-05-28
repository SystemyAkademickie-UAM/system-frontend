import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/index.js';
import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import { RoleVisibility } from '../../../components/guards/index.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { groupShopAddPath } from '../../../routes/pathRegistry.js';
import './GroupShopContent.css';

export default function GroupShopContent() {
  const { groupId } = useParams();

  return (
    <PageUnavailable
      className="group-shop-content"
      title="Sklep"
      description="Przeglądaj i wymieniaj zgromadzoną walutę na bonusy dydaktyczne."
    >
      <RoleVisibility allowedRoles={[APP_ROLE.LECTURER, APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN]}>
        {groupId ? (
          <div className="group-shop-content__actions">
            <Button to={groupShopAddPath(groupId)} variant="primary">
              Dodaj produkt
            </Button>
          </div>
        ) : null}
      </RoleVisibility>
    </PageUnavailable>
  );
}
