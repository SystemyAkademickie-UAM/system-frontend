import { useState, useMemo } from 'react';
import { Divider } from '../../../../components/ui/index.js';
import { CurrencyIcon } from '../../../../components/ui/Currency/CurrencyDisplay.jsx';
import { useGroupLives } from '../../../../context/GroupLivesContext.jsx';
import { resolveExtraLifeItemIcon } from '../../../../utils/shop/extraLifeItem.js';
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

const EDITBUTTON__TEXTLABEL = {
  polish: 'Edytuj',
  english: 'Edit'
};

const NAME__TEXTLABEL = {
  polish: 'Nazwa:',
  english: 'Name:'
};

const CATEGORY__TEXTLABEL = {
  polish: 'Kategorie:',
  english: 'Categories:'
};

const NOCATEGORIES__TEXTLABEL = {
  polish: 'Brak przypisanych kategorii',
  english: 'No categories assigned'
};

const STORYDESCRIPTION__TEXTLABEL = {
  polish: 'Opis fabularny:',
  english: 'Story description:'
};

const DIDACTICDESCRIPTION__TEXTLABEL = {
  polish: 'Opis dydaktyczny:',
  english: 'Didactic description:'
};

const BASEPRICE__TEXTLABEL = {
  polish: 'Cena bazowa:',
  english: 'Base price:'
};

const MINIMALPRICE__TEXTLABEL = {
  polish: 'Cena minimalna:',
  english: 'Minimum price:'
};

const MINIMALPRICEDISABLED__TEXTLABEL = {
  polish: 'Nie (Brak ograniczenia minimalnego)',
  english: 'No (No minimum limit)'
};

const MINIMALPRICEDISABLEDVALUE__TEXTLABEL = {
  polish: 'Tak',
  english: 'Yes'
};

const BADGEDISCOUNTS__TEXTLABEL = {
  polish: 'Zniżki za odznaki:',
  english: 'Badge discounts:'
};

const NONE__TEXTLABEL = {
  polish: 'Brak',
  english: 'None'
};

const VISIBLE__TEXTLABEL = {
  polish: 'Pokaż przedmiot (opublikowany):',
  english: 'Show item (published):'
};

const VISIBLEYES__TEXTLABEL = {
  polish: 'Tak (Widoczny w sklepie)',
  english: 'Yes (Visible in shop)'
};

const VISIBLENO__TEXTLABEL = {
  polish: 'Nie (Ukryty w sklepie)',
  english: 'No (Hidden from shop)'
};

const RANKRESTRICTION__TEXTLABEL = {
  polish: 'Ograniczenie rangą:',
  english: 'Rank restriction:'
};

const RANKRESTRICTIONYES__TEXTLABEL = {
  polish: 'Tak (Wymagana ranga:)',
  english: 'Yes (Required rank:'
};

const RANKRESTRICTIONNO__TEXTLABEL = {
  polish: 'Nie (Dostępny dla wszystkich)',
  english: 'No (Available to everyone)'
};

const GROUPLIMIT__TEXTLABEL = {
  polish: 'Limit sztuk na grupę:',
  english: 'Items limit per group:'
};

const GROUPLIMITENABLED__TEXTLABEL = {
  polish: 'Tak',
  english: 'Yes'
};

const GROUPLIMITNUMBER__TEXTLABEL = {
  polish: 'szt.',
  english: 'pcs'
};

const GROUPLIMITDISABLED__TEXTLABEL = {
  polish: 'Nie (Bez limitu)',
  english: 'No (No limit)'
};

const STUDENTLIMIT__TEXTLABEL = {
  polish: 'Limit sztuk na osobę:',
  english: 'Items limit per student:'
};

const STUDENTLIMITENABLED__TEXTLABEL = {
  polish: 'Tak',
  english: 'Yes'
};

const STUDENTLIMITDISABLED__TEXTLABEL = {
  polish: 'Nie (Bez limitu)',
  english: 'No (No limit)'
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
  isEditingExtraLife = false,
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
  const { symbol: livesSymbol } = useGroupLives();

  const resolvedIcon = isEditingExtraLife
    ? resolveExtraLifeItemIcon(livesSymbol).emoji
    : (currentIcon || '🥕');

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
              <span>{EDITBUTTON__TEXTLABEL[LANGUAGE]}</span>
            </button>
          ) : null}
        </div>
        
        <div className="shop-item-summary__info-grid">
          <div className="shop-item-summary__icon-badge" aria-hidden="true">
            <span className="shop-item-summary__icon-emoji">{resolvedIcon}</span>
          </div>

          <div className="shop-item-summary__info-details">
            <div className="shop-item-summary__row">
              <span className="shop-item-summary__label">{NAME__TEXTLABEL[LANGUAGE]}</span>
              <span className="shop-item-summary__value shop-item-summary__value--highlight">{itemName || '—'}</span>
            </div>

            <div className="shop-item-summary__row">
              <span className="shop-item-summary__label">{CATEGORY__TEXTLABEL[LANGUAGE]}</span>
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
                  NOCATEGORIES__TEXTLABEL[LANGUAGE]
                )}
              </span>
            </div>
          </div>
        </div>

        {storyDescription ? (
          <div className="shop-item-summary__desc-block">
            <span className="shop-item-summary__label">{STORYDESCRIPTION__TEXTLABEL[LANGUAGE]}</span>
            <p className="shop-item-summary__desc-text">{storyDescription}</p>
          </div>
        ) : null}

        {didacticDescription ? (
          <div className="shop-item-summary__desc-block">
            <span className="shop-item-summary__label">{DIDACTICDESCRIPTION__TEXTLABEL[LANGUAGE]}</span>
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
              <span>{EDITBUTTON__TEXTLABEL[LANGUAGE]}</span>
            </button>
          ) : null}
        </div>

        <div className="shop-item-summary__key-value-list">
          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">{BASEPRICE__TEXTLABEL[LANGUAGE]}</span>
            <span className="shop-item-summary__value shop-item-summary__value--price">
              {cost || '0'} <CurrencyIcon size="sm" />
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">{MINIMALPRICE__TEXTLABEL[LANGUAGE]}</span>
            <span className="shop-item-summary__value">
              {minPriceEnabled ? (
                <span className="shop-item-summary__value--price">
                  {MINIMALPRICEDISABLEDVALUE__TEXTLABEL[LANGUAGE]} ({minPrice || '0'} <CurrencyIcon size="sm" />)
                </span>
              ) : (
                MINIMALPRICEDISABLED__TEXTLABEL[LANGUAGE]
              )}
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">{BADGEDISCOUNTS__TEXTLABEL[LANGUAGE]}</span>
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
                NONE__TEXTLABEL[LANGUAGE]
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
              <span>{EDITBUTTON__TEXTLABEL[LANGUAGE]}</span>
            </button>
          ) : null}
        </div>

        <div className="shop-item-summary__key-value-list">
          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">{VISIBLE__TEXTLABEL[LANGUAGE]}</span>
            <span className={`shop-item-summary__value ${isVisible ? 'shop-item-summary__value--yes' : 'shop-item-summary__value--no'}`}>
              {isVisible ? VISIBLEYES__TEXTLABEL[LANGUAGE] : VISIBLENO__TEXTLABEL[LANGUAGE]}
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">{RANKRESTRICTION__TEXTLABEL[LANGUAGE]}</span>
            <span className="shop-item-summary__value">
              {restrictRankEnabled && selectedUnlockRank ? (
                <span className="shop-item-summary__value--yes">
                  {RANKRESTRICTIONYES__TEXTLABEL[LANGUAGE]} {selectedUnlockRank.icon || '⭐'} {selectedUnlockRank.name})
                </span>
              ) : (
                <span className="shop-item-summary__value--no">{RANKRESTRICTIONNO__TEXTLABEL[LANGUAGE]}</span>
              )}
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">{GROUPLIMIT__TEXTLABEL[LANGUAGE]}</span>
            <span className="shop-item-summary__value">
              {groupLimitEnabled ? (
                <span className="shop-item-summary__value--yes">{GROUPLIMITENABLED__TEXTLABEL[LANGUAGE]} ({groupLimit} {GROUPLIMITNUMBER__TEXTLABEL[LANGUAGE]})</span>
              ) : (
                <span className="shop-item-summary__value--no">{GROUPLIMITDISABLED__TEXTLABEL[LANGUAGE]}</span>
              )}
            </span>
          </div>

          <div className="shop-item-summary__row">
            <span className="shop-item-summary__label">{STUDENTLIMIT__TEXTLABEL[LANGUAGE]}</span>
            <span className="shop-item-summary__value">
              {studentLimitEnabled ? (
                <span className="shop-item-summary__value--yes">{STUDENTLIMITENABLED__TEXTLABEL[LANGUAGE]} ({studentLimit} {GROUPLIMITNUMBER__TEXTLABEL[LANGUAGE]})</span>
              ) : (
                <span className="shop-item-summary__value--no">{STUDENTLIMITDISABLED__TEXTLABEL[LANGUAGE]}</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
