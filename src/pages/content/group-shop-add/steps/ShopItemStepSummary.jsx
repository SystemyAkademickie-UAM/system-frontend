import { useState, useMemo } from 'react';
import { Divider } from '../../../../components/ui/index.js';
import { CurrencyIcon } from '../../../../components/ui/Currency/CurrencyDisplay.jsx';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const SECTIONINFO__TEXTLABEL = {
  polish: 'Informacje',
  english: 'Information'
};

const SECTIONPRICING__TEXTLABEL = {
  polish: 'Wartość przedmiotu',
  english: 'Item Value'
};

const SECTIONAVAILABILITY__TEXTLABEL = {
  polish: 'Dostępność',
  english: 'Availability'
};

function PencilIcon({ className = '' }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

const EDIT_SECTION_TOOLTIP__TEXTLABEL = {
  polish: 'Edytuj tę sekcję',
  english: 'Edit this section'
};

/**
 * Krok 4/4 kreatora przedmiotu: Podsumowanie wszystkich sekcji i parametrów.
 */
export default function ShopItemStepSummary({
  itemName,
  currentIcon,
  storyDescription,
  didacticDescription,
  categories = [],
  cost,
  minPriceEnabled,
  minPrice,
  badgeDiscounts = [],
  ranks = [],
  isVisible,
  restrictRankEnabled,
  unlockRankId,
  groupLimitEnabled,
  groupLimit,
  studentLimitEnabled,
  studentLimit,
  isEditing = false,
  onJumpToStep,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const selectedCategories = useMemo(() => {
    return categories.filter((c) => c.checked === 1);
  }, [categories]);

  const selectedUnlockRank = useMemo(() => {
    if (!restrictRankEnabled || !unlockRankId) return null;
    return ranks.find((r) => String(r.id) === String(unlockRankId)) || null;
  }, [restrictRankEnabled, unlockRankId, ranks]);

  return (
    <div className="shop-item-step shop-item-step--summary">
      {/* Sekcja 1: Informacje */}
      <div className="shop-item-summary__section">
        <div className="shop-item-summary__section-header">
          <h4 className="shop-item-summary__section-title">{SECTIONINFO__TEXTLABEL[LANGUAGE]}</h4>
          {isEditing && onJumpToStep ? (
            <button
              type="button"
              className="shop-item-summary__edit-btn"
              onClick={() => onJumpToStep(1)}
              title={EDIT_SECTION_TOOLTIP__TEXTLABEL[LANGUAGE]}
              aria-label={`${EDIT_SECTION_TOOLTIP__TEXTLABEL[LANGUAGE]}: ${SECTIONINFO__TEXTLABEL[LANGUAGE]}`}
            >
              <PencilIcon className="shop-item-summary__edit-icon" />
              <span>Edytuj</span>
            </button>
          ) : null}
        </div>
        
        <div className="shop-item-summary__info-grid">
          <div className="shop-item-summary__icon-badge" aria-hidden="true">
            <span className="shop-item-summary__icon-emoji">{currentIcon || '🥕'}</span>
          </div>

          <div className="shop-item-summary__info-details">
            <div className="shop-item-summary__row">
              <span className="shop-item-summary__label">Nazwa:</span>
              <span className="shop-item-summary__value shop-item-summary__value--highlight">{itemName || '—'}</span>
            </div>

            <div className="shop-item-summary__row">
              <span className="shop-item-summary__label">Kategorie:</span>
              <span className="shop-item-summary__value">
                {selectedCategories.length > 0 ? (
                  <span className="shop-item-summary__category-tags">
                    {selectedCategories.map((c) => (
                      <span
                        key={`summary-cat-${c.id}`}
                        className="shop-item-summary__category-tag"
                        style={{ borderLeftColor: c.color ?? 'var(--color-accent)' }}
                      >
                        {c.name}
                      </span>
                    ))}
                  </span>
                ) : (
                  'Brak przypisanych kategorii'
                )}
              </span>
            </div>
          </div>
        </div>

        {storyDescription ? (
          <div className="shop-item-summary__desc-block">
            <span className="shop-item-summary__label">Opis fabularny:</span>
            <p className="shop-item-summary__desc-text">{storyDescription}</p>
          </div>
        ) : null}

        {didacticDescription ? (
          <div className="shop-item-summary__desc-block">
            <span className="shop-item-summary__label">Opis dydaktyczny:</span>
            <p className="shop-item-summary__desc-text">{didacticDescription}</p>
          </div>
        ) : null}
      </div>

      <Divider />

      {/* Sekcja 2: Wartość przedmiotu */}
      <div className="shop-item-summary__section">
        <div className="shop-item-summary__section-header">
          <h4 className="shop-item-summary__section-title">{SECTIONPRICING__TEXTLABEL[LANGUAGE]}</h4>
          {isEditing && onJumpToStep ? (
            <button
              type="button"
              className="shop-item-summary__edit-btn"
              onClick={() => onJumpToStep(2)}
              title={EDIT_SECTION_TOOLTIP__TEXTLABEL[LANGUAGE]}
              aria-label={`${EDIT_SECTION_TOOLTIP__TEXTLABEL[LANGUAGE]}: ${SECTIONPRICING__TEXTLABEL[LANGUAGE]}`}
            >
              <PencilIcon className="shop-item-summary__edit-icon" />
              <span>Edytuj</span>
            </button>
          ) : null}
        </div>

        <div className="shop-item-summary__key-value-list">
          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">Cena bazowa:</span>
            <span className="shop-item-summary__value shop-item-summary__value--price">
              {cost || '0'} <CurrencyIcon size="sm" />
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">Cena minimalna:</span>
            <span className="shop-item-summary__value">
              {minPriceEnabled ? (
                <span className="shop-item-summary__value--price">
                  Tak ({minPrice || '0'} <CurrencyIcon size="sm" />)
                </span>
              ) : (
                'Nie (Brak ograniczenia minimalnego)'
              )}
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">Zniżki za odznaki:</span>
            <span className="shop-item-summary__value">
              {badgeDiscounts.length > 0 ? (
                <ul className="shop-item-summary__sub-list">
                  {badgeDiscounts.map((d) => (
                    <li key={`summary-badge-${d.id}`}>
                      {d.badgename}: -{d.value.endsWith('%') ? d.value : `${d.value} `}
                      {!d.value.endsWith('%') && <CurrencyIcon size="sm" />}
                    </li>
                  ))}
                </ul>
              ) : (
                'Brak'
              )}
            </span>
          </div>
        </div>
      </div>

      <Divider />

      {/* Sekcja 3: Dostępność */}
      <div className="shop-item-summary__section">
        <div className="shop-item-summary__section-header">
          <h4 className="shop-item-summary__section-title">{SECTIONAVAILABILITY__TEXTLABEL[LANGUAGE]}</h4>
          {isEditing && onJumpToStep ? (
            <button
              type="button"
              className="shop-item-summary__edit-btn"
              onClick={() => onJumpToStep(3)}
              title={EDIT_SECTION_TOOLTIP__TEXTLABEL[LANGUAGE]}
              aria-label={`${EDIT_SECTION_TOOLTIP__TEXTLABEL[LANGUAGE]}: ${SECTIONAVAILABILITY__TEXTLABEL[LANGUAGE]}`}
            >
              <PencilIcon className="shop-item-summary__edit-icon" />
              <span>Edytuj</span>
            </button>
          ) : null}
        </div>

        <div className="shop-item-summary__key-value-list">
          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">Pokaż przedmiot (opublikowany):</span>
            <span className={`shop-item-summary__value ${isVisible ? 'shop-item-summary__value--yes' : 'shop-item-summary__value--no'}`}>
              {isVisible ? 'Tak (Widoczny w sklepie)' : 'Nie (Ukryty w sklepie)'}
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">Ograniczenie rangą:</span>
            <span className="shop-item-summary__value">
              {restrictRankEnabled && selectedUnlockRank ? (
                <span className="shop-item-summary__value--yes">
                  Tak (Wymagana ranga: {selectedUnlockRank.icon || '⭐'} {selectedUnlockRank.name})
                </span>
              ) : (
                <span className="shop-item-summary__value--no">Nie (Dostępny dla wszystkich)</span>
              )}
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">Limit sztuk na grupę:</span>
            <span className="shop-item-summary__value">
              {groupLimitEnabled ? (
                <span className="shop-item-summary__value--yes">Tak ({groupLimit} szt.)</span>
              ) : (
                <span className="shop-item-summary__value--no">Nie (Bez limitu)</span>
              )}
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">Limit sztuk na studenta:</span>
            <span className="shop-item-summary__value">
              {studentLimitEnabled ? (
                <span className="shop-item-summary__value--yes">Tak ({studentLimit} szt.)</span>
              ) : (
                <span className="shop-item-summary__value--no">Nie (Bez limitu)</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
