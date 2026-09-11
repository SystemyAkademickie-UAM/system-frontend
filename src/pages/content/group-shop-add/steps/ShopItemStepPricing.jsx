import { useState, useMemo } from 'react';
import { Button, Divider, InfoTooltip, useToast } from '../../../../components/ui/index.js';
import { CurrencyIcon } from '../../../../components/ui/Currency/CurrencyDisplay.jsx';
import { sanitizeWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const PRICELABEL__TEXTLABEL = {
  polish: 'Cena bazowa*',
  english: 'Base Price*'
};

const PRICETOOLTIP__TEXTLABEL = {
  polish: 'Podstawowy koszt przedmiotu w sklepie przed naliczeniem zniżek.',
  english: 'Base cost of the item in the shop before discounts.'
};

const MINPRICELABEL__TEXTLABEL = {
  polish: 'Cena minimalna',
  english: 'Minimum Price'
};

const MINPRICETOOLTIP__TEXTLABEL = {
  polish: 'Cena minimalna to próg, poniżej którego nie zejdzie wartość przedmiotu po jakichkolwiek zniżkach (odznak lub rang).',
  english: 'Minimum price is the threshold below which the final price will never drop after any discounts.'
};

const BADGEDISCOUNTLABEL__TEXTLABEL = {
  polish: 'Zniżki za odznaki',
  english: 'Badge Discounts'
};

const BADGEDISCOUNTTOOLTIP__TEXTLABEL = {
  polish: 'Wybierz odznakę i określ zniżkę stałą w walucie grupy lub procentową (%).',
  english: 'Select a badge and specify a fixed currency discount or percentage (%).'
};

const SELECTBADGE__TEXTLABEL = {
  polish: 'Wybierz odznakę',
  english: 'Select Badge'
};

const ADDDISCOUNT__TEXTLABEL = {
  polish: 'Dodaj zniżkę',
  english: 'Add Discount'
};

const REMOVE__TEXTLABEL = {
  polish: 'Usuń',
  english: 'Remove'
};

const PREVIEWLABEL__TEXTLABEL = {
  polish: 'Podgląd kalkulacji zniżek',
  english: 'Discounts Calculation Preview'
};

const PREVIEWTOOLTIP__TEXTLABEL = {
  polish: 'Dynamiczny podgląd działania zniżek na podstawie ceny bazowej, odznak, wybranej rangi oraz ceny minimalnej.',
  english: 'Dynamic preview of discount calculations based on base price, badges, selected rank, and min price.'
};

const PREVIEWRANKLABEL__TEXTLABEL = {
  polish: 'Testuj z rangą:',
  english: 'Test with rank:'
};

const NORANKSELECTED__TEXTLABEL = {
  polish: 'Brak rangi',
  english: 'No rank'
};

const RANKDISCOUNTSLABEL__TEXTLABEL = {
  polish: 'Zniżki za rangi w grupie',
  english: 'Group Rank Discounts'
};

const RANKDISCOUNTSTOOLTIP__TEXTLABEL = {
  polish: 'Podgląd automatycznych lub dostosowanych cen dla poszczególnych rang w danej grupie.',
  english: 'Preview of automatic or customized prices for specific ranks in this group.'
};

const NORANKS__TEXTLABEL = {
  polish: 'Brak rang skonfigurowanych w tej grupie.',
  english: 'No ranks configured in this group.'
};

const NOBADGEDISCOUNTSYET__TEXTLABEL = {
  polish: 'Brak zdefiniowanych zniżek za odznaki. Dodaj pierwszą powyżej.',
  english: 'No badge discounts defined yet. Add the first one above.'
};

/**
 * Krok 2/4 kreatora przedmiotu: Wycena, zniżki i dynamiczny podgląd.
 */
export default function ShopItemStepPricing({
  cost,
  setCost,
  minPrice,
  setMinPrice,
  minPriceEnabled,
  setMinPriceEnabled,
  badges = [],
  badgeDiscounts = [],
  setBadgeDiscounts,
  ranks = [],
  setRanks,
  costError = '',
  setCostError,
  minPriceError = '',
  setMinPriceError,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { showError, showSuccess } = useToast();

  const [selectedBadgeName, setSelectedBadgeName] = useState('');
  const [pendingDiscountValue, setPendingDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState('fixed'); // 'fixed' | 'percent'
  const [previewRankId, setPreviewRankId] = useState('');
  const [rankDiscountsExpanded, setRankDiscountsExpanded] = useState(false);

  const basePriceNum = Number(cost) || 0;
  const minPriceNum = minPriceEnabled && minPrice !== '' ? Number(minPrice) : null;

  const handleCostChange = (val) => {
    const cleaned = sanitizeWholeNumberInput(val);
    setCost(cleaned);
    if (costError && Number(cleaned) >= 0) {
      setCostError?.('');
    }
    if (minPriceEnabled && minPrice !== '') {
      if (cleaned !== '' && Number(minPrice) > Number(cleaned)) {
        setMinPriceError?.('Cena minimalna nie może być większa niż cena bazowa.');
      } else {
        setMinPriceError?.('');
      }
    }
  };

  const handleMinPriceChange = (val) => {
    const cleaned = sanitizeWholeNumberInput(val);
    setMinPrice(cleaned);
    if (minPriceEnabled && cleaned !== '' && cost !== '' && Number(cleaned) > Number(cost)) {
      setMinPriceError?.('Cena minimalna nie może być większa niż cena bazowa.');
    } else {
      setMinPriceError?.('');
    }
  };

  const handleMinPriceToggle = () => {
    if (minPriceEnabled) {
      setMinPriceEnabled(false);
      setMinPrice('');
      setMinPriceError?.('');
    } else {
      setMinPriceEnabled(true);
      if (!minPrice && cost) {
        setMinPrice(cost);
      }
    }
  };

  const handleAddBadgeDiscount = () => {
    if (!selectedBadgeName || selectedBadgeName === SELECTBADGE__TEXTLABEL[LANGUAGE]) {
      showError('Proszę wybrać odznakę.');
      return;
    }

    if (badgeDiscounts.some((d) => d.badgename === selectedBadgeName)) {
      showError('Zniżka dla tej odznaki już istnieje.');
      return;
    }

    if (!pendingDiscountValue || Number(pendingDiscountValue) <= 0) {
      showError('Proszę wpisać poprawną wartość zniżki.');
      return;
    }

    const badgeObj = badges.find((b) => b.name === selectedBadgeName);
    const badgeId = badgeObj ? badgeObj.id : 0;

    const formattedValue = discountType === 'percent'
      ? `${pendingDiscountValue}%`
      : pendingDiscountValue;

    setBadgeDiscounts([
      ...badgeDiscounts,
      {
        id: Date.now(),
        badgeid: badgeId,
        badgename: selectedBadgeName,
        value: formattedValue,
        type: discountType,
      },
    ]);

    setSelectedBadgeName('');
    setPendingDiscountValue('');
    setDiscountType('fixed');
    showSuccess('Zniżka za odznakę została dodana.');
  };

  const handleDeleteBadgeDiscount = (discountId) => {
    setBadgeDiscounts(badgeDiscounts.filter((d) => d.id !== discountId));
    showSuccess('Zniżka za odznakę została usunięta.');
  };

  // Obliczenia dla wybranej rangi do podglądu
  const selectedPreviewRank = useMemo(() => {
    if (!previewRankId) return null;
    return ranks.find((r) => String(r.id) === String(previewRankId)) || null;
  }, [previewRankId, ranks]);

  // Kalkulacja podglądu dla każdej zniżki odznaki
  const calculatedBadgePreviews = useMemo(() => {
    if (basePriceNum <= 0) return [];

    return badgeDiscounts.map((discount) => {
      const isPercent = String(discount.value).endsWith('%');
      const valNumber = Number(String(discount.value).replace('%', '')) || 0;

      let badgeDiscountAmount = 0;
      if (isPercent) {
        badgeDiscountAmount = Math.round((basePriceNum * valNumber) / 100);
      } else {
        badgeDiscountAmount = valNumber;
      }

      let rankDiscountAmount = 0;
      let rankPercent = 0;
      if (selectedPreviewRank) {
        rankPercent = selectedPreviewRank.discount || 0;
        rankDiscountAmount = Math.round((basePriceNum * rankPercent) / 100);
      }

      const totalDiscountAmount = badgeDiscountAmount + rankDiscountAmount;
      let calculatedPrice = basePriceNum - totalDiscountAmount;
      if (calculatedPrice < 0) calculatedPrice = 0;

      let isMinPriceCapped = false;
      if (minPriceNum != null && calculatedPrice < minPriceNum) {
        calculatedPrice = minPriceNum;
        isMinPriceCapped = true;
      }

      return {
        ...discount,
        isPercent,
        valNumber,
        badgeDiscountAmount,
        rankDiscountAmount,
        rankPercent,
        calculatedPrice,
        isMinPriceCapped,
      };
    });
  }, [basePriceNum, badgeDiscounts, selectedPreviewRank, minPriceNum]);

  return (
    <div className="shop-item-step shop-item-step--pricing">
      {/* Wiersz: Cena bazowa + Cena minimalna */}
      <div className="shop-item-pricing__row">
        <div className="shop-item-form__field shop-item-pricing__field">
          <label className="shop-item-form__label" htmlFor="shop-item-price">
            {PRICELABEL__TEXTLABEL[LANGUAGE]}
            <InfoTooltip text={PRICETOOLTIP__TEXTLABEL[LANGUAGE]} />
          </label>
          <div className="shop-item-pricing__input-wrapper">
            <input
              id="shop-item-price"
              className={`shop-item-form__input ${costError ? 'shop-item-form__input--error' : ''}`}
              value={cost}
              placeholder="0"
              onInput={(event) => handleCostChange(event.target.value)}
              autoFocus
            />
            <span className="shop-item-pricing__currency-adornment" aria-hidden="true">
              <CurrencyIcon size="sm" />
            </span>
          </div>
          {costError ? (
            <span className="shop-item-form__field-error" role="alert">{costError}</span>
          ) : null}
        </div>

        <div className={`shop-item-form__field shop-item-pricing__field ${!minPriceEnabled ? 'shop-item-pricing__field--dimmed' : ''}`}>
          <label className="shop-item-form__label shop-item-pricing__checkbox-label" htmlFor="shop-item-min-price-toggle">
            <input
              id="shop-item-min-price-toggle"
              type="checkbox"
              checked={minPriceEnabled}
              onChange={handleMinPriceToggle}
            />
            <span>{MINPRICELABEL__TEXTLABEL[LANGUAGE]}</span>
            <InfoTooltip text={MINPRICETOOLTIP__TEXTLABEL[LANGUAGE]} />
          </label>
          <div className="shop-item-pricing__input-wrapper">
            <input
              id="shop-item-min-price"
              className={`shop-item-form__input ${minPriceError ? 'shop-item-form__input--error' : ''}`}
              value={minPrice}
              placeholder={minPriceEnabled ? '0' : '—'}
              disabled={!minPriceEnabled}
              onInput={(event) => handleMinPriceChange(event.target.value)}
            />
            <span className="shop-item-pricing__currency-adornment" aria-hidden="true">
              <CurrencyIcon size="sm" />
            </span>
          </div>
          {minPriceError ? (
            <span className="shop-item-form__field-error" role="alert">{minPriceError}</span>
          ) : null}
        </div>
      </div>

      <Divider />

      {/* Sekcja: Zniżki za odznaki */}
      <div className="shop-item-pricing__discounts-section">
        <div className="shop-item-form__label-wrapper">
          <span className="shop-item-form__label shop-item-form__label--heading">
            {BADGEDISCOUNTLABEL__TEXTLABEL[LANGUAGE]}
            <InfoTooltip text={BADGEDISCOUNTTOOLTIP__TEXTLABEL[LANGUAGE]} />
          </span>
        </div>

        <div className="shop-item-pricing__badge-toolbar">
          <select
            className="shop-item-form__select shop-item-pricing__badge-select"
            value={selectedBadgeName}
            onChange={(event) => setSelectedBadgeName(event.target.value)}
          >
            <option value="">{SELECTBADGE__TEXTLABEL[LANGUAGE]}</option>
            {badges.map((badge) => (
              <option key={`badge-${badge.id}`} value={badge.name}>
                {badge.name}
              </option>
            ))}
          </select>

          <input
            className="shop-item-form__input shop-item-pricing__value-input"
            placeholder="Wartość"
            value={pendingDiscountValue}
            onInput={(event) => setPendingDiscountValue(sanitizeWholeNumberInput(event.target.value))}
          />

          {/* Przełącznik typu zniżki: Waluta vs % */}
          <div className="shop-item-pricing__type-toggle" role="radiogroup" aria-label="Typ zniżki">
            <button
              type="button"
              className={`shop-item-pricing__type-btn ${discountType === 'fixed' ? 'shop-item-pricing__type-btn--active' : ''}`}
              onClick={() => setDiscountType('fixed')}
              title="Zniżka kwotowa w walucie"
            >
              <CurrencyIcon size="sm" />
            </button>
            <button
              type="button"
              className={`shop-item-pricing__type-btn ${discountType === 'percent' ? 'shop-item-pricing__type-btn--active' : ''}`}
              onClick={() => setDiscountType('percent')}
              title="Zniżka procentowa (%)"
            >
              %
            </button>
          </div>

          <Button type="button" variant="primary" size="md" onClick={handleAddBadgeDiscount}>
            {ADDDISCOUNT__TEXTLABEL[LANGUAGE]}
          </Button>
        </div>

        {/* Lista dodanych odznak */}
        {badgeDiscounts.length > 0 ? (
          <ul className="shop-item-pricing__badge-list">
            {badgeDiscounts.map((discount) => (
              <li key={`badge-discount-${discount.id}`} className="shop-item-pricing__badge-item">
                <span className="shop-item-pricing__badge-item-name">{discount.badgename}</span>
                <span className="shop-item-pricing__badge-item-value">
                  {discount.value.endsWith('%') ? discount.value : `${discount.value} `}
                  {!discount.value.endsWith('%') && <CurrencyIcon size="sm" />}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteBadgeDiscount(discount.id)}
                >
                  {REMOVE__TEXTLABEL[LANGUAGE]}
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Podgląd kalkulacji na żywo */}
      <div className="shop-item-pricing__live-preview">
        <div className="shop-item-pricing__preview-header">
          <span className="shop-item-form__label shop-item-form__label--heading">
            {PREVIEWLABEL__TEXTLABEL[LANGUAGE]}
            <InfoTooltip text={PREVIEWTOOLTIP__TEXTLABEL[LANGUAGE]} />
          </span>

          <div className="shop-item-pricing__preview-rank-selector">
            <label htmlFor="preview-rank-select" className="shop-item-pricing__preview-rank-label">
              {PREVIEWRANKLABEL__TEXTLABEL[LANGUAGE]}
            </label>
            <select
              id="preview-rank-select"
              className="shop-item-form__select shop-item-pricing__preview-rank-select"
              value={previewRankId}
              onChange={(event) => setPreviewRankId(event.target.value)}
            >
              <option value="">{NORANKSELECTED__TEXTLABEL[LANGUAGE]}</option>
              {ranks.map((rank) => (
                <option key={`preview-rank-${rank.id}`} value={String(rank.id)}>
                  {rank.name} (-{rank.discount}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="shop-item-pricing__preview-body">
          {calculatedBadgePreviews.length === 0 ? (
            <p className="shop-item-pricing__preview-empty">
              {basePriceNum <= 0
                ? 'Wpisz cenę bazową powyżej, aby zobaczyć podgląd kalkulacji.'
                : NOBADGEDISCOUNTSYET__TEXTLABEL[LANGUAGE]}
            </p>
          ) : (
            <div className="shop-item-pricing__preview-formulas">
              {calculatedBadgePreviews.map((item) => (
                <div key={`preview-formula-${item.id}`} className="shop-item-pricing__formula-row">
                  <span className="shop-item-pricing__formula-badge-title">{item.badgename}:</span>
                  <div className="shop-item-pricing__formula-content">
                    {/* Cena bazowa */}
                    <InfoTooltip text="Cena bazowa przedmiotu">
                      <span className="shop-item-pricing__formula-token">
                        {basePriceNum}<CurrencyIcon size="sm" />
                      </span>
                    </InfoTooltip>

                    {/* Zniżka odznaki */}
                    <InfoTooltip
                      text={
                        item.isPercent
                          ? `Zniżka za odznakę „${item.badgename}”: -${item.valNumber}% (kwota zniżki: ${item.badgeDiscountAmount})`
                          : `Zniżka za odznakę „${item.badgename}”: -${item.valNumber} w walucie grupy`
                      }
                    >
                      <span className="shop-item-pricing__formula-token">
                        - {item.isPercent ? `${item.valNumber}% (${item.badgeDiscountAmount}` : `${item.valNumber}`}
                        <CurrencyIcon size="sm" />
                        {item.isPercent ? ')' : ''}
                      </span>
                    </InfoTooltip>

                    {/* Zniżka rangi jeśli wybrana */}
                    {selectedPreviewRank && item.rankDiscountAmount > 0 ? (
                      <InfoTooltip
                        text={`Zniżka za rangę „${selectedPreviewRank.name}”: -${item.rankPercent}% (kwota zniżki: ${item.rankDiscountAmount})`}
                      >
                        <span className="shop-item-pricing__formula-token shop-item-pricing__formula-token--rank">
                          - {item.rankPercent}% ({item.rankDiscountAmount}<CurrencyIcon size="sm" />)
                        </span>
                      </InfoTooltip>
                    ) : null}

                    <span className="shop-item-pricing__formula-operator">=</span>

                    {/* Wynik */}
                    <InfoTooltip
                      text={
                        item.isMinPriceCapped
                          ? `Cena końcowa po zniżkach: ${item.calculatedPrice} (ograniczona ustawioną ceną minimalną)`
                          : `Cena końcowa po odliczeniu zniżek: ${item.calculatedPrice}`
                      }
                    >
                      <span
                        className={`shop-item-pricing__formula-result ${item.isMinPriceCapped ? 'shop-item-pricing__formula-result--capped' : ''}`}
                      >
                        {item.calculatedPrice} <CurrencyIcon size="sm" />
                        {item.isMinPriceCapped ? (
                          <span className="shop-item-pricing__capped-badge">Min.</span>
                        ) : null}
                      </span>
                    </InfoTooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sekcja zwijana: Zniżki za rangi */}
      <div className={`shop-item-pricing__ranks-accordion ${rankDiscountsExpanded ? 'shop-item-pricing__ranks-accordion--expanded' : ''}`}>
        <button
          type="button"
          className="shop-item-pricing__ranks-accordion-toggle"
          onClick={() => setRankDiscountsExpanded(!rankDiscountsExpanded)}
          aria-expanded={rankDiscountsExpanded}
        >
          <span className="shop-item-pricing__ranks-chevron" aria-hidden="true" />
          <span className="shop-item-form__label shop-item-form__label--heading">
            {RANKDISCOUNTSLABEL__TEXTLABEL[LANGUAGE]}
          </span>
          <InfoTooltip text={RANKDISCOUNTSTOOLTIP__TEXTLABEL[LANGUAGE]} />
        </button>

        {rankDiscountsExpanded ? (
          <div className="shop-item-pricing__ranks-content">
            {ranks.length === 0 ? (
              <p className="shop-item-form__empty">{NORANKS__TEXTLABEL[LANGUAGE]}</p>
            ) : (
              <div className="shop-item-pricing__ranks-grid">
                {ranks.map((rank) => {
                  const rankDiscountVal = rank.discount || 0;
                  const discountAmount = Math.round((basePriceNum * rankDiscountVal) / 100);
                  let autoCost = basePriceNum - discountAmount;
                  if (autoCost < 0) autoCost = 0;
                  const isCapped = minPriceNum != null && autoCost < minPriceNum && basePriceNum - discountAmount < minPriceNum;
                  if (minPriceNum != null && autoCost < minPriceNum) {
                    autoCost = minPriceNum;
                  }

                  return (
                    <div key={`rank-${rank.id}`} className="shop-item-pricing__rank-card">
                      <div className="shop-item-pricing__rank-info">
                        <span className="shop-item-pricing__rank-icon" aria-hidden="true">
                          {rank.icon || '⭐'}
                        </span>
                        <span className="shop-item-pricing__rank-name">{rank.name}</span>
                        <span className="shop-item-pricing__rank-badge-percent">(-{rankDiscountVal}%)</span>
                      </div>

                      <div className="shop-item-pricing__rank-calc">
                        {basePriceNum > 0 ? (
                          <div className="shop-item-pricing__rank-calc-formula">
                            <InfoTooltip text="Cena bazowa przedmiotu">
                              <span className="shop-item-pricing__rank-calc-token">{basePriceNum}<CurrencyIcon size="sm" /></span>
                            </InfoTooltip>
                            <span className="shop-item-pricing__rank-calc-op">-</span>
                            <InfoTooltip text={`Zniżka za rangę „${rank.name}”: -${rankDiscountVal}% (kwota zniżki: ${discountAmount})`}>
                              <span className="shop-item-pricing__rank-calc-token">{rankDiscountVal}% ({discountAmount}<CurrencyIcon size="sm" />)</span>
                            </InfoTooltip>
                            <span className="shop-item-pricing__rank-calc-op">=</span>
                          </div>
                        ) : null}

                        {basePriceNum > 0 ? (
                          <InfoTooltip
                            text={
                              isCapped
                                ? `Cena dla rangi „${rank.name}”: ${autoCost} (ograniczona ustawioną ceną minimalną)`
                                : `Cena dla rangi „${rank.name}” po zniżce ${rankDiscountVal}%: ${autoCost}`
                            }
                          >
                            <div className="shop-item-pricing__rank-calc-result">
                              <span className={`shop-item-pricing__rank-calc-final ${isCapped ? 'shop-item-pricing__rank-calc-final--capped' : ''}`}>
                                {autoCost}
                              </span>
                              <CurrencyIcon size="sm" />
                              {isCapped ? (
                                <span className="shop-item-pricing__capped-badge">Min.</span>
                              ) : null}
                            </div>
                          </InfoTooltip>
                        ) : (
                          <div className="shop-item-pricing__rank-calc-result">
                            <span className="shop-item-pricing__rank-calc-placeholder">—</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
