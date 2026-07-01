import { useEffect, useMemo, useState } from 'react';
import { Modal, SearchBar } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../group-rewards/shared/rewardsModals.css';
import './ReportSelectModal.css';

const GENERATING__TEXTLABEL = {
  polish: 'Generowanie...',
  english: 'Generating...',
};

const GENERATEREPORT__TEXTLABEL = {
  polish: 'Generuj raport',
  english: 'Generate report',
};

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {Array<{ id: number, label: string }>} props.items
 * @param {() => void} props.onClose
 * @param {(selectedId: number) => void} props.onConfirm
 * @param {boolean} [props.isLoading]
 * @param {string} [props.searchPlaceholder]
 * @param {string} [props.emptyMessage]
 */
export default function ReportSelectModal({
  isOpen,
  title,
  subtitle,
  items,
  onClose,
  onConfirm,
  isLoading = false,
  searchPlaceholder = 'Szukaj…',
  emptyMessage = 'Brak pozycji do wyboru.',
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSearchQuery('');
    setSelectedId(null);
  }, [isOpen]);

  const visibleItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return items;
    }

    return items.filter((item) => item.label.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const handleConfirm = () => {
    if (selectedId == null || isLoading) {
      return;
    }

    onConfirm(selectedId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      onConfirm={handleConfirm}
      confirmDisabled={selectedId == null || isLoading}
      confirmLabel={isLoading ? GENERATING__TEXTLABEL[LANGUAGE] : GENERATEREPORT__TEXTLABEL[LANGUAGE]}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={searchPlaceholder}
          name="report-select-search"
          aria-label={searchPlaceholder}
        />
      </div>

      {visibleItems.length === 0 ? (
        <p className="report-select-modal__empty">{emptyMessage}</p>
      ) : (
        <ul className="rewards-modal__item-list report-select-modal__list" role="radiogroup">
          {visibleItems.map((item) => {
            const isSelected = selectedId === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={[
                    'report-select-modal__option',
                    isSelected ? 'report-select-modal__option--selected' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="report-select-modal__option-indicator" aria-hidden="true" />
                  <span className="report-select-modal__option-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
