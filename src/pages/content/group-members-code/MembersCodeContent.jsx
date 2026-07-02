import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Button,
  DataTable,
  SearchBar,
  useToast,
} from '../../../components/ui/index.js';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { DataTableRowActions } from '../../../components/ui/DataTable/DataTable.jsx';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import '../../../components/page/PageUnavailable.css';
import MembersCodeContentWindow from './MembersCodeContentWindow.jsx';
import './MembersCodeContent.css';

const FETCHERROR__TEXTLABEL = {
  polish: 'Nie udało się odczytać listy kodów.',
  english: 'Failed to read the list of codes.',
};

const FETCHSTATUSERROR__TEXTLABEL = {
  polish: 'Nie udało się pobrać kodów (status {status}).',
  english: 'Failed to fetch codes (status {status}).',
};

const DELETESTATUSERROR__TEXTLABEL = {
  polish: 'Nie udało się usunąć kodu (status {status}).',
  english: 'Failed to delete code (status {status}).',
};

const DELETESUCCESS__TEXTLABEL = {
  polish: 'Kod został usunięty.',
  english: 'Code deleted.',
};

const COPYSUCCESS__TEXTLABEL = {
  polish: 'Kod skopiowany do schowka.',
  english: 'Code copied to clipboard.',
};

const COPYERROR__TEXTLABEL = {
  polish: 'Nie udało się skopiować kodu.',
  english: 'Failed to copy code.',
};

const CODECOLUMN__TEXTLABEL = {
  polish: 'Kod',
  english: 'Code',
};

const EXPIRESATCOLUMN__TEXTLABEL = {
  polish: 'Wygaśnięcie',
  english: 'Expires',
};

const USES__TEXTLABEL = {
  polish: 'Użycia',
  english: 'Uses',
};

const ACTIVECOLUMN__TEXTLABEL = {
  polish: 'Aktywny',
  english: 'Active',
};

const YES__TEXTLABEL = {
  polish: 'Tak',
  english: 'Yes',
};

const NO__TEXTLABEL = {
  polish: 'Nie',
  english: 'No',
};

const COPYCODELABEL__TEXTLABEL = {
  polish: 'Skopiuj kod',
  english: 'Copy code',
};

const COPYCODE__TEXTLABEL = {
  polish: 'Skopiuj kod dostępu',
  english: 'Copy access code',
};

const EDITCODE__TEXTLABEL = {
  polish: 'Edytuj kod',
  english: 'Edit code',
};

const EDITCODEDESCRIPTION__TEXTLABEL = {
  polish: 'Zmień wygaśnięcie, limit użyć lub status aktywności.',
  english: 'Change expiration, use limit, or activity status.',
};

const DELETECODE__TEXTLABEL = {
  polish: 'Usuń kod',
  english: 'Delete code',
};

const GENERATEBUTTON__TEXTLABEL = {
  polish: 'Generuj nowy kod',
  english: 'Generate new code',
};

const SEARCHPLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj kodu...',
  english: 'Search code...',
};

const SEARCH__TEXTLABEL = {
  polish: 'Szukaj kodu dostępu',
  english: 'Search access code',
};

const LOADING__TEXTLABEL = {
  polish: 'Ładowanie kodów dostępu...',
  english: 'Loading access codes...',
};

const EMPTY__TEXTLABEL = {
  polish: 'Brak kodów dostępu. Kliknij „{button}”, aby utworzyć pierwszy.',
  english: 'No access codes. Click "{button}" to create the first one.',
};

const DELETE__TEMPLATE = {
  polish: 'Usuń kod {code}',
  english: 'Delete code {code}',
};

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

function renderCodeTableCell(code, language) {
  const statusClassName = [
    'members-code-table__status',
    code.isActive ? 'members-code-table__status--active' : 'members-code-table__status--inactive',
  ].join(' ');

  return (
    <div className="members-code-table__code-cell">
      <span className="members-code-table__code members-code-table__code--desktop">{code.code}</span>
      <div className="members-code-table__code-mobile">
        <div className="members-code-table__code-headline">
          <span className="members-code-table__code">{code.code}</span>
          <span className={statusClassName}>
            {code.isActive ? YES__TEXTLABEL[language] : NO__TEXTLABEL[language]}
          </span>
        </div>
        <p className="members-code-table__code-meta-line">
          <span className="members-code-table__code-meta-part">
            <span className="members-code-table__code-meta-label">{EXPIRESATCOLUMN__TEXTLABEL[language]}</span>
            {' '}
            <span className="members-code-table__code-meta-value">{formatExpiresAt(code.expiresAt)}</span>
          </span>
          <span className="members-code-table__code-meta-separator" aria-hidden="true"> · </span>
          <span className="members-code-table__code-meta-part">
            <span className="members-code-table__code-meta-label">{USES__TEXTLABEL[language]}</span>
            {' '}
            <span className="members-code-table__code-meta-value">{formatMaxUses(code.maxUses, code.useCount)}</span>
          </span>
        </p>
      </div>
    </div>
  );
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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

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
        throw new Error(FETCHERROR__TEXTLABEL[LANGUAGE]);
      }

      if (!response.ok) {
        throw new Error(FETCHSTATUSERROR__TEXTLABEL[LANGUAGE].replace('{status}', response.status));
      }

      setCodes(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, LANGUAGE]);

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
        setErrorMessage(DELETESTATUSERROR__TEXTLABEL[LANGUAGE].replace('{status}', response.status));
        return;
      }

      showSuccess(DELETESUCCESS__TEXTLABEL[LANGUAGE]);
      await fetchCodes();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }, [fetchCodes, groupId, LANGUAGE, showSuccess]);

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
      showSuccess(COPYSUCCESS__TEXTLABEL[LANGUAGE]);
    } catch {
      showError(COPYERROR__TEXTLABEL[LANGUAGE]);
    }
  }, [showError, showSuccess, LANGUAGE]);

  const codeColumns = useMemo(() => [
    {
      key: 'code',
      label: CODECOLUMN__TEXTLABEL[LANGUAGE],
      sort: 'text',
      width: '28%',
      className: 'members-code-table__th--code',
      colClassName: 'members-code-table__col--code',
      cellClassName: 'members-code-table__cell--code',
      render: (code) => renderCodeTableCell(code, LANGUAGE),
    },
    {
      key: 'expiresAt',
      label: EXPIRESATCOLUMN__TEXTLABEL[LANGUAGE],
      sort: 'text',
      width: '168px',
      className: 'members-code-table__th--expires',
      colClassName: 'members-code-table__col--expires',
      mobileHidden: true,
      accessor: (code) => formatExpiresAt(code.expiresAt),
      render: (code) => (
        <span className="members-code-table__meta">{formatExpiresAt(code.expiresAt)}</span>
      ),
    },
    {
      key: 'uses',
      label: USES__TEXTLABEL[LANGUAGE],
      sort: 'number',
      width: '108px',
      className: 'members-code-table__th--uses',
      colClassName: 'members-code-table__col--uses',
      mobileHidden: true,
      accessor: (code) => code.useCount,
      render: (code) => (
        <span className="members-code-table__meta">{formatMaxUses(code.maxUses, code.useCount)}</span>
      ),
    },
    {
      key: 'isActive',
      label: ACTIVECOLUMN__TEXTLABEL[LANGUAGE],
      sort: 'text',
      width: '102px',
      className: 'members-code-table__th--active',
      colClassName: 'members-code-table__col--active',
      cellClassName: 'members-code-table__cell--active',
      mobileHidden: true,
      accessor: (code) => (code.isActive ? 1 : 0),
      render: (code) => (
        <span
          className={[
            'members-code-table__status',
            code.isActive ? 'members-code-table__status--active' : 'members-code-table__status--inactive',
          ].join(' ')}
        >
          {code.isActive ? YES__TEXTLABEL[LANGUAGE] : NO__TEXTLABEL[LANGUAGE]}
        </span>
      ),
    },
  ], [LANGUAGE]);

  const rowActions = useMemo(() => ({
    inlineActions: [
      {
        id: 'copy',
        label: COPYCODELABEL__TEXTLABEL[LANGUAGE],
        iconFile: SVG_ICONS.actions.copy,
        ariaLabel: COPYCODE__TEXTLABEL[LANGUAGE],
        onSelect: handleCopyCode,
      },
    ],
    menuItems: [
      {
        id: 'edit',
        label: EDITCODE__TEXTLABEL[LANGUAGE],
        description: EDITCODEDESCRIPTION__TEXTLABEL[LANGUAGE],
        onSelect: (code) => openEditWindow(code.id),
      },
    ],
    onDelete: (code) => handleDeleteCode(code.id),
    deleteLabel: DELETECODE__TEXTLABEL[LANGUAGE],
    deleteAriaLabel: (code) => DELETE__TEMPLATE[LANGUAGE].replace('{code}', code.code),
  }), [handleCopyCode, handleDeleteCode, openEditWindow, LANGUAGE]);

  return (
    <SectionPageLayout
      className="page-unavailable members-page members-code-page"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
      toolbar={(
        <>
          <div className="maq-section-page__toolbar-start">
            <Button
              variant="primary"
              size="md"
              className="members-code-page__add-btn"
              onClick={openGenerateWindow}
            >
              {GENERATEBUTTON__TEXTLABEL[LANGUAGE]}
            </Button>
          </div>
          <div className="maq-section-page__toolbar-end">
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={SEARCHPLACEHOLDER__TEXTLABEL[LANGUAGE]}
              name="enrollment-code-search"
              className="members-page__search"
              aria-label={SEARCH__TEXTLABEL[LANGUAGE]}
            />
          </div>
        </>
      )}
    >
      {errorMessage ? (
        <p className="members-code-page__error" role="alert">{errorMessage}</p>
      ) : null}

      {isLoading ? (
        <p className="members-code-page__loading page-unavailable__notice" role="status">{LOADING__TEXTLABEL[LANGUAGE]}</p>
      ) : codes.length === 0 ? (
        <p className="members-code-page__empty page-unavailable__notice">
          {EMPTY__TEXTLABEL[LANGUAGE].replace('{button}', GENERATEBUTTON__TEXTLABEL[LANGUAGE])}
        </p>
      ) : (
        <DataTable
          columns={codeColumns}
          data={codes}
          rowKey="id"
          rowActions={rowActions}
          renderRow={CodeTableRow}
          getMobileItemClassName={(code) => (
            code.isActive ? 'members-code-table__row--active' : 'members-code-table__row--inactive'
          )}
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
    </SectionPageLayout>
  );
}
