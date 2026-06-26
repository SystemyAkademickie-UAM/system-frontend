import { useCallback, useState } from 'react';

import { Pagination, SearchBar, useToast } from '../../../components/ui/index.js';
import TemplateListingCard from '../../../components/ui/TemplateListingCard/TemplateListingCard.jsx';
import CreateGroupFromTemplateModal from './CreateGroupFromTemplateModal.jsx';
import { useTemplatesPage } from './useTemplatesPage.js';
import './TemplatesPageLayout.css';

export default function TemplatesGalleryContent() {
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
  } = useTemplatesPage('public');
  const { showSuccess, showError } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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
    : 'Brak publicznych szablonów w galerii.';

  return (
    <div className="templates-page-content">
      <div className="templates-page-content__controls">
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
                    isPublic={template.isPublic}
                    createdAt={template.createdAt}
                    bannerUrl={cardProps.bannerUrl}
                    subjectName={cardProps.subjectName}
                    stats={cardProps.stats}
                    isFavorite={Boolean(template.isFavorite)}
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
