import { useCallback, useMemo, useState } from 'react';

import {

  Button,

  Modal,

  Pagination,

  SearchBar,

  useToast,

} from '../../../components/ui/index.js';

import TemplateListingCard from '../../../components/ui/TemplateListingCard/TemplateListingCard.jsx';

import {

  deleteGroupTemplate,

  updateGroupTemplate,

} from '../../../services/groupTemplates.api.js';

import CreateTemplateModal from './CreateTemplateModal.jsx';

import TemplateDetailsModal from './TemplateDetailsModal.jsx';

import TemplateFieldEditModal from './TemplateFieldEditModal.jsx';

import { useTemplatesPage } from './useTemplatesPage.js';

import './TemplatesPageLayout.css';



export default function TemplatesMyContent() {

  const {

    templates,

    totalTemplates,

    page,

    setPage,

    totalPages,

    searchQuery,

    setSearchQuery,

    isLoading,

    errorMessage,

    refetch,

    getTemplateCardProps,

  } = useTemplatesPage('my');

  const { showSuccess, showError } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [activeModal, setActiveModal] = useState(null);



  const openModal = useCallback((type, template) => {

    setActiveModal({ type, template });

  }, []);



  const closeModal = useCallback(() => {

    setActiveModal(null);

  }, []);



  const handleTogglePublic = useCallback(async (template) => {

    const result = await updateGroupTemplate(template.id, {

      isPublic: !template.isPublic,

    });

    if (!result.ok) {

      showError(result.error || 'Nie udało się zmienić widoczności szablonu.');

      return;

    }

    showSuccess(

      template.isPublic

        ? 'Szablon ustawiony jako prywatny'

        : 'Szablon udostępniony w galerii',

    );

    await refetch();

  }, [refetch, showError, showSuccess]);



  const handleDelete = useCallback(async () => {

    const template = activeModal?.template;

    if (!template) return;

    const result = await deleteGroupTemplate(template.id);

    if (!result.ok) {

      showError(result.error || 'Nie udało się usunąć szablonu.');

      return;

    }

    showSuccess('Szablon został usunięty');

    closeModal();

    await refetch();

  }, [activeModal, closeModal, refetch, showError, showSuccess]);



  const rowActions = useMemo(() => ({
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj szablon',
        onSelect: (template) => openModal('edit', template),
      },
      {
        id: 'togglePublic',
        label: 'Zmień widoczność w galerii',
        onSelect: (template) => handleTogglePublic(template),
      },
    ],
    onDelete: (template) => openModal('delete', template),
    deleteLabel: 'Usuń szablon',
    deleteAriaLabel: (template) => `Usuń szablon ${template.name}`,
  }), [handleTogglePublic, openModal]);



  const emptyMessage = searchQuery.trim()

    ? 'Nie znaleziono szablonów pasujących do wyszukiwania.'

    : 'Nie masz jeszcze zapisanych szablonów. Utwórz pierwszy szablon na podstawie swojej grupy.';



  return (

    <div className="templates-page-content">

      <div className="templates-page-content__controls">

        <Button type="button" variant="primary" onClick={() => setIsCreateOpen(true)}>

          Nowy szablon

        </Button>

        <SearchBar

          className="templates-page-content__search"

          value={searchQuery}

          onChange={(event) => setSearchQuery(event.target.value)}

          placeholder="Szukaj po nazwie…"

          aria-label="Szukaj szablonów po nazwie"

        />

      </div>



      {errorMessage ? (

        <p className="templates-page-content__message templates-page-content__message--error" role="alert">

          {errorMessage}

        </p>

      ) : null}



      {isLoading ? (

        <p className="templates-page-content__message" aria-live="polite">Ładowanie szablonów…</p>

      ) : totalTemplates === 0 ? (

        <p className="templates-page-content__message" aria-live="polite">{emptyMessage}</p>

      ) : (

        <>

          <ul className="templates-page-content__list">

            {templates.map((template) => {

              const cardProps = getTemplateCardProps(template);

              return (

                <li key={template.id}>

                  <TemplateListingCard

                    row={template}

                    rowActions={rowActions}

                    name={template.name}

                    description={template.description}

                    isPublic={template.isPublic}

                    createdAt={template.createdAt}

                    bannerUrl={cardProps.bannerUrl}

                    subjectName={cardProps.subjectName}

                    stats={cardProps.stats}

                    onClick={() => openModal('details', template)}

                  />

                </li>

              );

            })}

          </ul>



          <Pagination

            className="templates-page-content__pagination"

            totalPages={totalPages}

            page={page}

            onPageChange={setPage}

            ariaLabel="Paginacja moich szablonów"

          />

        </>

      )}



      <CreateTemplateModal

        isOpen={isCreateOpen}

        onClose={() => setIsCreateOpen(false)}

        onCreated={refetch}

      />



      <TemplateDetailsModal

        isOpen={activeModal?.type === 'details'}

        template={activeModal?.template ?? null}

        onClose={closeModal}

      />



      <TemplateFieldEditModal
        isOpen={activeModal?.type === 'edit'}
        field="both"
        template={activeModal?.template ?? null}
        onClose={closeModal}
        onSaved={refetch}
      />

      <TemplateFieldEditModal
        isOpen={activeModal?.type === 'editName'}
        field="name"
        template={activeModal?.template ?? null}
        onClose={closeModal}
        onSaved={refetch}
      />

      <TemplateFieldEditModal
        isOpen={activeModal?.type === 'editDescription'}
        field="description"
        template={activeModal?.template ?? null}
        onClose={closeModal}
        onSaved={refetch}
      />



      <Modal

        isOpen={activeModal?.type === 'delete'}

        onClose={closeModal}

        title="Usuń szablon"

        subtitle={activeModal?.template?.name}

        size="sm"

        showFooter={false}

      >

        <p className="templates-page-content__message">

          Czy na pewno chcesz usunąć ten szablon? Tej operacji nie można cofnąć.

        </p>

        <div className="templates-page-content__modal-footer">

          <Button type="button" variant="secondary" onClick={closeModal}>

            Anuluj

          </Button>

          <Button type="button" variant="danger" onClick={handleDelete}>

            Usuń szablon

          </Button>

        </div>

      </Modal>

    </div>

  );

}

