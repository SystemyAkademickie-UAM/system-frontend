import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  fetchGroupTemplateDetails,
  fetchGroupTemplates,
  filterTemplatesByName,
  setGroupTemplateFavorite,
} from '../../../services/groupTemplates.api.js';
import { sortTemplatesWithFavoritesFirst } from './templateFavorites.js';
import { getTemplateBannerUrl, getTemplateSummaryStats } from './groupSnapshotForTemplate.js';

export const TEMPLATES_PAGE_SIZE = 10;

/**
 * @param {'my' | 'public'} scope
 */
export function useTemplatesPage(scope) {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailsById, setDetailsById] = useState(() => new Map());

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await fetchGroupTemplates({ scope, limit: 100, offset: 0 });
      setTemplates(result.items);
    } catch {
      setErrorMessage('Nie udało się pobrać szablonów.');
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, scope]);

  useEffect(() => {
    if (templates.length === 0) return undefined;

    let cancelled = false;
    const missing = templates.filter((template) => !detailsById.has(template.id));
    if (missing.length === 0) return undefined;

    Promise.all(
      missing.map(async (template) => {
        const details = await fetchGroupTemplateDetails(template.id);
        return details ? [template.id, details] : null;
      }),
    ).then((entries) => {
      if (cancelled) return;
      setDetailsById((current) => {
        const next = new Map(current);
        entries.forEach((entry) => {
          if (entry) next.set(entry[0], entry[1]);
        });
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
    // detailsById intentionally omitted — only fetch ids missing from cache
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  const sortedTemplates = useMemo(() => {
    const filtered = filterTemplatesByName(templates, searchQuery);
    if (scope === 'public') {
      return sortTemplatesWithFavoritesFirst(filtered);
    }
    return [...filtered].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
  }, [templates, searchQuery, scope]);

  const totalPages = Math.max(1, Math.ceil(sortedTemplates.length / TEMPLATES_PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedTemplates = useMemo(() => {
    const start = (page - 1) * TEMPLATES_PAGE_SIZE;
    return sortedTemplates.slice(start, start + TEMPLATES_PAGE_SIZE);
  }, [sortedTemplates, page]);

  const toggleFavorite = useCallback(async (templateId) => {
    const current = templates.find((template) => template.id === templateId);
    if (!current) {
      return { ok: false, error: 'Nie znaleziono szablonu.' };
    }

    const nextFavorite = !current.isFavorite;
    setTemplates((items) => items.map((template) => (
      template.id === templateId
        ? { ...template, isFavorite: nextFavorite }
        : template
    )));

    const result = await setGroupTemplateFavorite(templateId, nextFavorite);
    if (!result.ok) {
      setTemplates((items) => items.map((template) => (
        template.id === templateId
          ? { ...template, isFavorite: current.isFavorite }
          : template
      )));
    }

    return result;
  }, [templates]);

  const getTemplateCardProps = useCallback(
    (template) => {
      const details = detailsById.get(template.id);
      const data = details?.data;
      return {
        bannerUrl: data ? getTemplateBannerUrl(data) : null,
        subjectName: data?.group?.subjectName ?? undefined,
        stats: data ? getTemplateSummaryStats(data) : undefined,
      };
    },
    [detailsById],
  );

  return {
    templates: paginatedTemplates,
    totalTemplates: sortedTemplates.length,
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
  };
}
