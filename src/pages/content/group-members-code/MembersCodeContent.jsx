import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Button,
  DataTable,
  PageHeader,
  SearchBar,
  SubNav,
  useToast,
} from '../../../components/ui/index.js';
import { DataTableRowActions } from '../../../components/ui/DataTable/DataTable.jsx';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import MembersCodeContentWindow from './MembersCodeContentWindow.jsx';
import './MembersCodeContent.css';

function formatExpiresAt(value) {
  if (value == null || value === '') {
    return 'Brak';
  }

  return new Date(value).toLocaleString('pl-PL');
}

function formatMaxUses(maxUses, useCount) {
  if (maxUses == null) {
    return `${useCount} / ∞`;
  }

  return `${useCount} / ${maxUses}`;
}

function CodeTableRow({ row, columns, rowActions, rowActionsPosition = 'end' }) {
  const actionsCell = rowActions ? (
    <td className="data-table__cell data-table__cell--actions">
      <DataTableRowActions row={row} rowActions={rowActions} />
    </td>
  ) : null;

  return (
    <tr
      className={[
        'data-table__row',
        row.isActive ? 'members-code-table__row--active' : 'members-code-table__row--inactive',
      ].join(' ')}
    >
      {rowActionsPosition === 'start' ? actionsCell : null}
      {columns.map((column) => (
        <td
          key={column.key}
          className={[
            'data-table__cell',
            column.cellClassName,
            column.hiddenBelow ? `data-table__cell--hide-below-${column.hiddenBelow}` : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {column.render ? column.render(row) : String(row[column.key] ?? '')}
        </td>
      ))}
      {rowActionsPosition === 'end' ? actionsCell : null}
    </tr>
  );
}

export default function MembersCodeContent() {
  const { groupId } = useParams();
  const nav = useGroupSubNav('group-members');
  const { showSuccess, showError } = useToast();

  const [errorMessage, setErrorMessage] = useState('');
  const [codes, setCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [windowOpen, setWindowOpen] = useState(false);
  const [editCodeId, setEditCodeId] = useState(0);

  const fetchCodes = useCallback(async () => {
    setErrorMessage('');

    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const url = `${base}/groups/${groupId}/enrollment-codes`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('Nie udało się odczytać listy kodów.');
      }

      if (!response.ok) {
        throw new Error(`Nie udało się pobrać kodów (status ${response.status}).`);
      }

      setCodes(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleDeleteCode = useCallback(async (codeId) => {
    setErrorMessage('');

    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const url = `${base}/groups/${groupId}/enrollment-codes/${codeId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });

      if (response.status < 200 || response.status >= 300) {
        setErrorMessage(`Nie udało się usunąć kodu (status ${response.status}).`);
        return;
      }

      showSuccess('Kod został usunięty.');
      await fetchCodes();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }, [fetchCodes, groupId, showSuccess]);

  const openGenerateWindow = useCallback(() => {
    setEditCodeId(0);
    setWindowOpen(true);
  }, []);

  const openEditWindow = useCallback((codeId) => {
    setEditCodeId(codeId);
    setWindowOpen(true);
  }, []);

  const closeWindow = useCallback(() => {
    setWindowOpen(false);
    setEditCodeId(0);
  }, []);

  const handleSaved = useCallback(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleCopyCode = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code.code);
      showSuccess('Kod skopiowany do schowka.');
    } catch {
      showError('Nie udało się skopiować kodu.');
    }
  }, [showError, showSuccess]);

  const codeColumns = useMemo(() => [
    {
      key: 'code',
      label: 'Kod',
      sort: 'text',
      width: '28%',
      className: 'members-code-table__th--code',
      colClassName: 'members-code-table__col--code',
      cellClassName: 'members-code-table__cell--code',
      render: (code) => (
        <span className="members-code-table__code">{code.code}</span>
      ),
    },
    {
      key: 'expiresAt',
      label: 'Wygaśnięcie',
      sort: 'text',
      width: '168px',
      className: 'members-code-table__th--expires',
      colClassName: 'members-code-table__col--expires',
      accessor: (code) => formatExpiresAt(code.expiresAt),
      render: (code) => (
        <span className="members-code-table__meta">{formatExpiresAt(code.expiresAt)}</span>
      ),
    },
    {
      key: 'uses',
      label: 'Użycia',
      sort: 'number',
      width: '108px',
      className: 'members-code-table__th--uses',
      colClassName: 'members-code-table__col--uses',
      accessor: (code) => code.useCount,
      render: (code) => (
        <span className="members-code-table__meta">{formatMaxUses(code.maxUses, code.useCount)}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Aktywny',
      sort: 'text',
      width: '102px',
      className: 'members-code-table__th--active',
      colClassName: 'members-code-table__col--active',
      cellClassName: 'members-code-table__cell--active',
      accessor: (code) => (code.isActive ? 1 : 0),
      render: (code) => (
        <span
          className={[
            'members-code-table__status',
            code.isActive ? 'members-code-table__status--active' : 'members-code-table__status--inactive',
          ].join(' ')}
        >
          {code.isActive ? 'Tak' : 'Nie'}
        </span>
      ),
    },
  ], []);

  const rowActions = useMemo(() => ({
    inlineActions: [
      {
        id: 'copy',
        label: 'Skopiuj kod',
        ariaLabel: 'Skopiuj kod dostępu',
        onSelect: handleCopyCode,
      },
    ],
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj kod',
        description: 'Zmień wygaśnięcie, limit użyć lub status aktywności.',
        onSelect: (code) => openEditWindow(code.id),
      },
    ],
    onDelete: (code) => handleDeleteCode(code.id),
    deleteLabel: 'Usuń kod',
    deleteAriaLabel: (code) => `Usuń kod ${code.code}`,
  }), [handleCopyCode, handleDeleteCode, openEditWindow]);

  return (
    <section className="page-unavailable members-page members-code-page" aria-label={nav.sectionTitle}>
      <div className="members-code-page__header-row">
        <PageHeader
          title={nav.sectionTitle}
          description="Kody dostępu do grupy"
        />
        <Button
          variant="primary"
          size="md"
          className="members-code-page__add-btn"
          onClick={openGenerateWindow}
        >
          Generuj nowy kod
        </Button>
      </div>

      <div className="members-page__nav-row">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="members-page__sub-nav"
        />
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj kodu…"
          name="enrollment-code-search"
          className="members-page__search"
          aria-label="Szukaj kodu dostępu"
        />
      </div>

      {errorMessage ? (
        <p className="members-code-page__error" role="alert">{errorMessage}</p>
      ) : null}

      {isLoading ? (
        <p className="members-code-page__loading" role="status">Ładowanie kodów dostępu…</p>
      ) : codes.length === 0 ? (
        <p className="members-code-page__empty">
          Brak kodów dostępu. Kliknij „Generuj nowy kod”, aby utworzyć pierwszy.
        </p>
      ) : (
        <DataTable
          columns={codeColumns}
          data={codes}
          rowKey="id"
          rowActions={rowActions}
          renderRow={CodeTableRow}
          search={{
            value: searchQuery,
            onChange: (event) => setSearchQuery(event.target.value),
            external: true,
            filter: (code, query) => String(code.code ?? '').toLowerCase().includes(query),
          }}
          paginationAriaLabel="Nawigacja stron kodów dostępu"
          className="members-code-table"
        />
      )}

      {windowOpen ? (
        <MembersCodeContentWindow
          popupclose={closeWindow}
          groupId={groupId}
          editCodeId={editCodeId}
          onsaved={handleSaved}
        />
      ) : null}
    </section>
  );
}
