import { useState } from 'react';
import { Divider, InfoTooltip } from '../../../../components/ui/index.js';
import { sanitizeWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const SHOWITEMLABEL__TEXTLABEL = {
  polish: 'Pokaż przedmiot',
  english: 'Show Item'
};

const SHOWITEMTOOLTIP__TEXTLABEL = {
  polish: 'Domyślnie, bez zaznaczenia tej opcji, przedmiot będzie ukryty w sklepie (niepubliczny).',
  english: 'By default, without selecting this option, the item will be hidden in the shop (unpublished).'
};

const RESTRICTACCESSLABEL__TEXTLABEL = {
  polish: 'Ogranicz dostęp. Przedmiot będzie dostępny po osiągnięciu rangi:',
  english: 'Restrict access. Item will be available after reaching rank:'
};

const RESTRICTACCESSTOOLTIP__TEXTLABEL = {
  polish: 'Przedmiot w sklepie będzie widoczny/odblokowany wyłącznie dla studentów posiadających wskazaną rangę (lub wyższą).',
  english: 'The item in the shop will be visible/unlocked only for students who have reached the specified rank (or higher).'
};

const GROUPLIMITLABEL__TEXTLABEL = {
  polish: 'Limit sztuk na grupę',
  english: 'Items per group limit'
};

const GROUPLIMITTOOLTIP__TEXTLABEL = {
  polish: 'Ogranicza łączną liczbę sztuk dostępnych w sklepie dla całej grupy.',
  english: 'Limits the total number of items available in the shop for the entire group.'
};

const STUDENTLIMITLABEL__TEXTLABEL = {
  polish: 'Limit sztuk na studenta',
  english: 'Items per student limit'
};

const STUDENTLIMITTOOLTIP__TEXTLABEL = {
  polish: 'Ogranicza ile razy każdy ze studentów może kupić ten przedmiot.',
  english: 'Limits how many times each student can purchase this item.'
};

const NORANKSAVAILABLE__TEXTLABEL = {
  polish: 'Brak zdefiniowanych rang w tej grupie.',
  english: 'No ranks defined in this group.'
};

/**
 * Krok 3/4 kreatora przedmiotu: Dostępność, ograniczenia rangą i limity.
 */
export default function ShopItemStepAvailability({
  isVisible,
  setIsVisible,
  restrictRankEnabled,
  setRestrictRankEnabled,
  unlockRankId,
  setUnlockRankId,
  ranks = [],
  groupLimitEnabled,
  setGroupLimitEnabled,
  groupLimit,
  setGroupLimit,
  studentLimitEnabled,
  setStudentLimitEnabled,
  studentLimit,
  setStudentLimit,
  groupLimitError = '',
  studentLimitError = '',
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const handleGroupLimitToggle = () => {
    if (groupLimitEnabled) {
      setGroupLimitEnabled(false);
      setGroupLimit('');
    } else {
      setGroupLimitEnabled(true);
      if (!groupLimit) setGroupLimit('10');
    }
  };

  const handleStudentLimitToggle = () => {
    if (studentLimitEnabled) {
      setStudentLimitEnabled(false);
      setStudentLimit('');
    } else {
      setStudentLimitEnabled(true);
      if (!studentLimit) setStudentLimit('1');
    }
  };

  const handleRestrictRankToggle = () => {
    if (restrictRankEnabled) {
      setRestrictRankEnabled(false);
      setUnlockRankId('');
    } else {
      setRestrictRankEnabled(true);
      if (!unlockRankId && ranks.length > 0) {
        setUnlockRankId(String(ranks[0].id));
      }
    }
  };

  return (
    <div className="shop-item-step shop-item-step--availability">
      {/* 1. Widoczność przedmiotu (domyślnie odznaczony) */}
      <div className="shop-item-availability__visibility-row">
        <label className="shop-item-form__label shop-item-availability__checkbox-label" htmlFor="shop-item-is-visible">
          <input
            id="shop-item-is-visible"
            type="checkbox"
            checked={isVisible}
            onChange={(event) => setIsVisible(event.target.checked)}
          />
          <span className="shop-item-form__label--heading">{SHOWITEMLABEL__TEXTLABEL[LANGUAGE]}</span>
          <InfoTooltip text={SHOWITEMTOOLTIP__TEXTLABEL[LANGUAGE]} />
        </label>
      </div>

      <Divider />

      {/* 2. Ograniczenie rangi */}
      <div className="shop-item-availability__rank-section">
        <label className="shop-item-form__label shop-item-availability__checkbox-label" htmlFor="shop-item-restrict-rank">
          <input
            id="shop-item-restrict-rank"
            type="checkbox"
            checked={restrictRankEnabled}
            onChange={handleRestrictRankToggle}
          />
          <span>{RESTRICTACCESSLABEL__TEXTLABEL[LANGUAGE]}</span>
          <InfoTooltip text={RESTRICTACCESSTOOLTIP__TEXTLABEL[LANGUAGE]} />
        </label>

        {restrictRankEnabled ? (
          <div className="shop-item-availability__rank-options">
            {ranks.length === 0 ? (
              <p className="shop-item-form__empty">{NORANKSAVAILABLE__TEXTLABEL[LANGUAGE]}</p>
            ) : (
              <div className="shop-item-availability__radio-group">
                {ranks.map((rank) => (
                  <label key={`rank-radio-${rank.id}`} className="shop-item-availability__radio-option">
                    <input
                      type="radio"
                      name="unlockRankRadio"
                      value={String(rank.id)}
                      checked={String(unlockRankId) === String(rank.id)}
                      onChange={(event) => setUnlockRankId(event.target.value)}
                    />
                    <span className="shop-item-availability__rank-icon" aria-hidden="true">
                      {rank.icon || '⭐'}
                    </span>
                    <span className="shop-item-availability__rank-title">{rank.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      <Divider />

      {/* 3. Limity ilościowe */}
      <div className="shop-item-availability__limits-grid">
        {/* Limit grupy */}
        <div className="shop-item-form__field">
          <label className="shop-item-form__label shop-item-availability__checkbox-label" htmlFor="shop-item-group-limit-toggle">
            <input
              id="shop-item-group-limit-toggle"
              type="checkbox"
              checked={groupLimitEnabled}
              onChange={handleGroupLimitToggle}
            />
            <span>{GROUPLIMITLABEL__TEXTLABEL[LANGUAGE]}</span>
            <InfoTooltip text={GROUPLIMITTOOLTIP__TEXTLABEL[LANGUAGE]} />
          </label>
          <input
            id="shop-item-group-limit"
            className={`shop-item-form__input ${groupLimitError ? 'shop-item-form__input--error' : ''}`}
            value={groupLimit}
            placeholder={groupLimitEnabled ? 'Wpisz limit' : 'Bez limitu'}
            disabled={!groupLimitEnabled}
            onInput={(event) => setGroupLimit(sanitizeWholeNumberInput(event.target.value))}
          />
          {groupLimitError ? (
            <span className="shop-item-form__field-error" role="alert">{groupLimitError}</span>
          ) : null}
        </div>

        {/* Limit studenta */}
        <div className="shop-item-form__field">
          <label className="shop-item-form__label shop-item-availability__checkbox-label" htmlFor="shop-item-student-limit-toggle">
            <input
              id="shop-item-student-limit-toggle"
              type="checkbox"
              checked={studentLimitEnabled}
              onChange={handleStudentLimitToggle}
            />
            <span>{STUDENTLIMITLABEL__TEXTLABEL[LANGUAGE]}</span>
            <InfoTooltip text={STUDENTLIMITTOOLTIP__TEXTLABEL[LANGUAGE]} />
          </label>
          <input
            id="shop-item-student-limit"
            className={`shop-item-form__input ${studentLimitError ? 'shop-item-form__input--error' : ''}`}
            value={studentLimit}
            placeholder={studentLimitEnabled ? 'Wpisz limit' : 'Bez limitu'}
            disabled={!studentLimitEnabled}
            onInput={(event) => setStudentLimit(sanitizeWholeNumberInput(event.target.value))}
          />
          {studentLimitError ? (
            <span className="shop-item-form__field-error" role="alert">{studentLimitError}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
