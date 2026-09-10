import { useCallback, useMemo, useState } from 'react';

import {
  CatalogFilterGroup,
  Pagination,
  SearchBar,
  useToast,
} from '../../../components/ui/index.js';
import TemplateListingCard from '../../../components/ui/TemplateListingCard/TemplateListingCard.jsx';
import CreateGroupFromTemplateModal from './CreateGroupFromTemplateModal.jsx';
import { updateGroupTemplate } from '../../../services/groupTemplates.api.js';
import { resolveTemplateCreatorDisplay } from './templateCreatorDisplay.js';
import { useTemplatesPage } from './useTemplatesPage.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './TemplatesPageLayout.css';

const GALLERY_FILTER_OPTIONS__TEXTLABEL = {
  polish: [
    { id: 'all', label: 'Wszystkie' },
    { id: 'favorites', label: 'Ulubione' }
  ],
  english: [
    { id: 'all', label: 'All' },
    { id: 'favorites', label: 'Favorites' }
  ]
};

const FAVORITE_UPDATE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się zaktualizować ulubionych',
  english: 'Failed to update favorites'
};

const FAVORITE_ADDED_SUCCESS__TEXTLABEL = {
  polish: 'Szablon dodany do ulubionych',
  english: 'Template added to favorites'
};

const NO_SEARCH_RESULTS__TEXTLABEL = {
  polish: 'Nie znaleziono szablonów pasujących do wyszukiwania.',
  english: 'No templates matching the search.'
};

const NO_FAVORITES__TEXTLABEL = {
  polish: 'Brak ulubionych szablonów w galerii.',
  english: 'No favorite templates in the gallery.'
};

const NO_PUBLIC_TEMPLATES__TEXTLABEL = {
  polish: 'Brak publicznych szablonów w galerii.',
  english: 'No public templates in the gallery.'
};

const GALLERY_FILTER_ARIA__TEXTLABEL = {
  polish: 'Filtr galerii szablonów',
  english: 'Template gallery filter'
};

const GALLERY_SEARCH_PLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj po nazwie lub prowadzącym…',
  english: 'Search by name or instructor…'
};

const GALLERY_SEARCH_ARIA__TEXTLABEL = {
  polish: 'Szukaj szablonów po nazwie, ksywce lub imieniu i nazwisku prowadzącego',
  english: 'Search templates by name, nickname or instructor first and last name'
};

const GALLERY_LOADING__TEXTLABEL = {
  polish: 'Ładowanie galerii…',
  english: 'Loading gallery…'
};

const GALLERY_PAGINATION_ARIA__TEXTLABEL = {
  polish: 'Paginacja galerii szablonów',
  english: 'Template gallery pagination'
};

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

export default function TemplatesGalleryContent() {
  const [listFilter, setListFilter] = useState('all');
  const favoritesOnly = listFilter === 'favorites';
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
    toggleFavorite,
    getTemplateCardProps,
  } = useTemplatesPage('public', { favoritesOnly });
  const { showSuccess, showError } = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const creatorLabelsById = useMemo(() => {
    const labels = new Map();
    templates.forEach((template) => {
      labels.set(template.id, resolveTemplateCreatorDisplay(template));
    });
    return labels;
  }, [templates]);

  const handleToggleFavorite = useCallback(async (templateId) => {
    const template = templates.find((item) => item.id === templateId);
    const wasFavorite = Boolean(template?.isFavorite);
    const result = await toggleFavorite(templateId);

    if (!result.ok) {
      showError(result.error ?? FAVORITE_UPDATE_ERROR__TEXTLABEL[LANGUAGE]);
      return;
    }

    if (!wasFavorite) {
      showSuccess(FAVORITE_ADDED_SUCCESS__TEXTLABEL[LANGUAGE]);
    }
  }, [templates, showError, showSuccess, toggleFavorite, LANGUAGE]);

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

  const emptyMessage = searchQuery.trim()
    ? NO_SEARCH_RESULTS__TEXTLABEL[LANGUAGE]
    : favoritesOnly
      ? NO_FAVORITES__TEXTLABEL[LANGUAGE]
      : NO_PUBLIC_TEMPLATES__TEXTLABEL[LANGUAGE];

  return (
    <div className="templates-page-content">
      <div className="templates-page-content__controls">
        <CatalogFilterGroup
          ariaLabel={GALLERY_FILTER_ARIA__TEXTLABEL[LANGUAGE]}
          filters={GALLERY_FILTER_OPTIONS__TEXTLABEL[LANGUAGE]}
          activeId={listFilter}
          onSelect={setListFilter}
        />
        <SearchBar
          className="templates-page-content__search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={GALLERY_SEARCH_PLACEHOLDER__TEXTLABEL[LANGUAGE]}
          aria-label={GALLERY_SEARCH_ARIA__TEXTLABEL[LANGUAGE]}
        />
      </div>

      {errorMessage ? (
        <p className="templates-page-content__message templates-page-content__message--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <p className="templates-page-content__message" aria-live="polite">{GALLERY_LOADING__TEXTLABEL[LANGUAGE]}</p>
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
                    name={template.name}
                    description={template.description}
                    createdAt={template.createdAt}
                    bannerUrl={cardProps.bannerUrl}
                    subjectName={cardProps.subjectName}
                    stats={cardProps.stats}
                    isFavorite={Boolean(template.isFavorite)}
                    isOwnTemplate={Boolean(template.isOwn)}
                    isPublic={template.isPublic}
                    creatorLabel={creatorLabelsById.get(template.id)}
                    showVisibilityBadge={false}
                    onToggleFavorite={() => handleToggleFavorite(template.id)}
                    onTogglePublic={template.isOwn ? () => handleTogglePublic(template) : undefined}
                    onClick={() => setSelectedTemplate(template)}
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
            ariaLabel={GALLERY_PAGINATION_ARIA__TEXTLABEL[LANGUAGE]}
          />
        </>
      )}

      <CreateGroupFromTemplateModal
        isOpen={Boolean(selectedTemplate)}
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </div>
  );
}
