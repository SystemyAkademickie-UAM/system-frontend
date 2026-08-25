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

import CreateGroupFromTemplateModal from './CreateGroupFromTemplateModal.jsx';
import CreateTemplateModal from './CreateTemplateModal.jsx';

import TemplateDetailsModal from './TemplateDetailsModal.jsx';

import TemplateFieldEditModal from './TemplateFieldEditModal.jsx';

import { useTemplatesPage } from './useTemplatesPage.js';

import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

import './TemplatesPageLayout.css';

const VISIBLE_CHANGE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się zmienić widoczności szablonu.',
  english: 'Failed to change template visibility.'
};

const VISIBLE_SET_PRIVATE__TEXTLABEL = {
  polish: 'Szablon ustawiony jako prywatny',
  english: 'Template set as private'
};

const VISIBLE_SET_PUBLIC__TEXTLABEL = {
  polish: 'Szablon udostępniony w galerii',
  english: 'Template shared in gallery'
};

const DELETE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się usunąć szablonu.',
  english: 'Failed to delete template.'
};

const DELETE_SUCCESS__TEXTLABEL = {
  polish: 'Szablon został usunięty',
  english: 'Template has been deleted'
};

const CREATE_GROUP_LABEL__TEXTLABEL = {
  polish: 'Utwórz grupę ze szablonu',
  english: 'Create group from template'
};

const EDIT_LABEL__TEXTLABEL = {
  polish: 'Edytuj szablon',
  english: 'Edit template'
};

const TOGGLE_PUBLIC_LABEL__TEXTLABEL = {
  polish: 'Opublikuj bądź ukryj szablon w galerii',
  english: 'Publish or hide template in gallery'
};

const DELETE_ACTION_LABEL__TEXTLABEL = {
  polish: 'Usuń szablon',
  english: 'Delete template'
};

const DELETE_ACTION_ARIA__TEXTLABEL = {
  polish: (name) => `Usuń szablon ${name}`,
  english: (name) => `Delete template ${name}`
};

const EMPTY_SEARCH_MESSAGE__TEXTLABEL = {
  polish: 'Nie znaleziono szablonów pasujących do wyszukiwania.',
  english: 'No templates matching search found.'
};

const EMPTY_MESSAGE__TEXTLABEL = {
  polish: 'Nie masz jeszcze zapisanych szablonów. Utwórz pierwszy szablon na podstawie swojej grupy.',
  english: 'You do not have any saved templates yet. Create your first template based on your group.'
};

const NEW_TEMPLATE_BUTTON__TEXTLABEL = {
  polish: 'Nowy szablon',
  english: 'New template'
};

const SEARCH_PLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj po nazwie…',
  english: 'Search by name…'
};

const SEARCH_ARIA__TEXTLABEL = {
  polish: 'Szukaj szablonów po nazwie',
  english: 'Search templates by name'
};

const LOADING_MESSAGE__TEXTLABEL = {
  polish: 'Ładowanie szablonów…',
  english: 'Loading templates…'
};

const PAGINATION_ARIA__TEXTLABEL = {
  polish: 'Paginacja moich szablonów',
  english: 'Pagination of my templates'
};

const DELETE_DIALOG_TITLE__TEXTLABEL = {
  polish: 'Usuń szablon',
  english: 'Delete template'
};

const DELETE_CONFIRM_MESSAGE__TEXTLABEL = {
  polish: 'Czy na pewno chcesz usunąć ten szablon? Tej operacji nie można cofnąć.',
  english: 'Are you sure you want to delete this template? This operation cannot be undone.'
};

const CANCEL_BUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

const DELETE_BUTTON__TEXTLABEL = {
  polish: 'Usuń szablon',
  english: 'Delete template'
};



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

  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const { showSuccess, showError } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [createGroupTemplate, setCreateGroupTemplate] = useState(null);

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

      showError(result.error || VISIBLE_CHANGE_ERROR__TEXTLABEL[LANGUAGE]);

      return;

    }

    showSuccess(

      template.isPublic

        ? VISIBLE_SET_PRIVATE__TEXTLABEL[LANGUAGE]

        : VISIBLE_SET_PUBLIC__TEXTLABEL[LANGUAGE],

    );

    await refetch();

  }, [refetch, showError, showSuccess, LANGUAGE]);



  const handleDelete = useCallback(async () => {

    const template = activeModal?.template;

    if (!template) return;

    const result = await deleteGroupTemplate(template.id);

    if (!result.ok) {

      showError(result.error || DELETE_ERROR__TEXTLABEL[LANGUAGE]);

      return;

    }

    showSuccess(DELETE_SUCCESS__TEXTLABEL[LANGUAGE]);

    closeModal();

    await refetch();

  }, [activeModal, closeModal, refetch, showError, showSuccess, LANGUAGE]);



  const rowActions = useMemo(() => ({
    menuItems: [
      {
        id: 'createGroup',
        label: CREATE_GROUP_LABEL__TEXTLABEL[LANGUAGE],
        onSelect: (template) => setCreateGroupTemplate(template),
      },
      {
        id: 'edit',
        label: EDIT_LABEL__TEXTLABEL[LANGUAGE],
        onSelect: (template) => openModal('edit', template),
      },
      {
        id: 'togglePublic',
        label: TOGGLE_PUBLIC_LABEL__TEXTLABEL[LANGUAGE],
        onSelect: (template) => handleTogglePublic(template),
      },
    ],
    onDelete: (template) => openModal('delete', template),
    deleteLabel: DELETE_ACTION_LABEL__TEXTLABEL[LANGUAGE],
    deleteAriaLabel: (template) => DELETE_ACTION_ARIA__TEXTLABEL[LANGUAGE](template.name),
  }), [handleTogglePublic, openModal, setCreateGroupTemplate, LANGUAGE]);



  const emptyMessage = searchQuery.trim()

    ? EMPTY_SEARCH_MESSAGE__TEXTLABEL[LANGUAGE]

    : EMPTY_MESSAGE__TEXTLABEL[LANGUAGE];



  return (

    <div className="templates-page-content">

      <div className="templates-page-content__controls">

        <Button type="button" variant="primary" onClick={() => setIsCreateOpen(true)}>

          {NEW_TEMPLATE_BUTTON__TEXTLABEL[LANGUAGE]}

        </Button>

        <SearchBar

          className="templates-page-content__search"

          value={searchQuery}

          onChange={(event) => setSearchQuery(event.target.value)}

          placeholder={SEARCH_PLACEHOLDER__TEXTLABEL[LANGUAGE]}

          aria-label={SEARCH_ARIA__TEXTLABEL[LANGUAGE]}

        />

      </div>



      {errorMessage ? (

        <p className="templates-page-content__message templates-page-content__message--error" role="alert">

          {errorMessage}

        </p>

      ) : null}



      {isLoading ? (

        <p className="templates-page-content__message" aria-live="polite">{LOADING_MESSAGE__TEXTLABEL[LANGUAGE]}</p>

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

            ariaLabel={PAGINATION_ARIA__TEXTLABEL[LANGUAGE]}

          />

        </>

      )}



      <CreateTemplateModal

        isOpen={isCreateOpen}

        onClose={() => setIsCreateOpen(false)}

        onCreated={refetch}

      />

      <CreateGroupFromTemplateModal
        isOpen={Boolean(createGroupTemplate)}
        template={createGroupTemplate}
        onClose={() => setCreateGroupTemplate(null)}
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

        title={DELETE_DIALOG_TITLE__TEXTLABEL[LANGUAGE]}

        subtitle={activeModal?.template?.name}

        size="sm"

        showFooter={false}

      >

        <p className="templates-page-content__message">

          {DELETE_CONFIRM_MESSAGE__TEXTLABEL[LANGUAGE]}

        </p>

        <div className="templates-page-content__modal-footer">

          <Button type="button" variant="secondary" onClick={closeModal}>

            {CANCEL_BUTTON__TEXTLABEL[LANGUAGE]}

          </Button>

          <Button type="button" variant="danger" onClick={handleDelete}>

            {DELETE_BUTTON__TEXTLABEL[LANGUAGE]}

          </Button>

        </div>

      </Modal>

    </div>

  );

}

