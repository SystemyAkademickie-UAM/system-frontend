import { useCallback, useMemo, useState } from 'react';

import {
  CatalogFilterGroup,
  Pagination,
  SearchBar,
  useToast,
} from '../../../components/ui/index.js';
import TemplateListingCard from '../../../components/ui/TemplateListingCard/TemplateListingCard.jsx';
import CreateGroupFromTemplateModal from './CreateGroupFromTemplateModal.jsx';
import { resolveTemplateCreatorDisplay } from './templateCreatorDisplay.js';
import { useTemplatesPage } from './useTemplatesPage.js';
import './TemplatesPageLayout.css';

const GALLERY_FILTERS = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'favorites', label: 'Ulubione' },
];

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
    toggleFavorite,
    getTemplateCardProps,
  } = useTemplatesPage('public', { favoritesOnly });
  const { showSuccess, showError } = useToast();
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
      showError(result.error ?? 'Nie udało się zaktualizować ulubionych');
      return;
    }

    if (!wasFavorite) {
      showSuccess('Szablon dodany do ulubionych');
    }
  }, [templates, showError, showSuccess, toggleFavorite]);

  const emptyMessage = searchQuery.trim()
    ? 'Nie znaleziono szablonów pasujących do wyszukiwania.'
    : favoritesOnly
      ? 'Brak ulubionych szablonów w galerii.'
      : 'Brak publicznych szablonów w galerii.';

  return (
    <div className="templates-page-content">
      <div className="templates-page-content__controls">
        <CatalogFilterGroup
          ariaLabel="Filtr galerii szablonów"
          filters={GALLERY_FILTERS}
          activeId={listFilter}
          onSelect={setListFilter}
        />
        <SearchBar
          className="templates-page-content__search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj po nazwie lub prowadzącym…"
          aria-label="Szukaj szablonów po nazwie, ksywce lub imieniu i nazwisku prowadzącego"
        />
      </div>

      {errorMessage ? (
        <p className="templates-page-content__message templates-page-content__message--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <p className="templates-page-content__message" aria-live="polite">Ładowanie galerii…</p>
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
                    creatorLabel={creatorLabelsById.get(template.id)}
                    showVisibilityBadge={false}
                    onToggleFavorite={() => handleToggleFavorite(template.id)}
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
            ariaLabel="Paginacja galerii szablonów"
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
