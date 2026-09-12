import { useEffect, useRef, useState } from 'react';
import { Divider, Modal, ShopToggleButton } from '../../../../components/ui/index.js';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../group-rewards/shared/rewardsModals.css';
import './shopAccessModal.css';

const ACCESS_MODAL_TITLE__TEXTLABEL = {
  polish: 'Dostęp do sklepu',
  english: 'Shop Access'
};

const SAVING_LABEL__TEXTLABEL = {
  polish: 'Zapisywanie…',
  english: 'Saving…'
};

const SAVE_BUTTON__TEXTLABEL = {
  polish: 'Zapisz',
  english: 'Save'
};

const SHOP_STATUS_SECTION_LABEL__TEXTLABEL = {
  polish: 'Status sklepu',
  english: 'Shop Status'
};

const SCHEDULE_SECTION_LABEL__TEXTLABEL = {
  polish: 'Harmonogram otwarcia sklepu',
  english: 'Shop Opening Schedule'
};

const SCHEDULE_CHECKBOX_LABEL__TEXTLABEL = {
  polish: 'Ustal datę otwarcia sklepu',
  english: 'Set shop opening date'
};

const OPEN_DATE_LABEL__TEXTLABEL = {
  polish: 'Data i godzina otwarcia sklepu',
  english: 'Shop opening date and time'
};

const OPEN_DATE_ARIA_LABEL__TEXTLABEL = {
  polish: 'Wybierz datę otwarcia sklepu',
  english: 'Select shop opening date'
};

const OPEN_TIME_ARIA_LABEL__TEXTLABEL = {
  polish: 'Wybierz godzinę otwarcia sklepu',
  english: 'Select shop opening time'
};

function toLocalDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toLocalTimeValue(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function splitIsoDateTime(value) {
  if (!value) {
    return { date: '', time: '' };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '', time: '' };
  }

  return {
    date: toLocalDateValue(parsed),
    time: toLocalTimeValue(parsed),
  };
}

function openDateTimePicker(event, inputRef, disabled) {
  event?.preventDefault?.();
  event?.stopPropagation?.();

  if (disabled || !inputRef.current) {
    return;
  }

  const input = inputRef.current;
  input.focus({ preventScroll: true });

  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker();
      return;
    } catch {
      // Niektóre przeglądarki rzucają wyjątek poza bezpośrednim gestem użytkownika.
    }
  }

  input.click();
}

function ShopOptionCheckbox({
  id,
  checked,
  onChange,
  disabled = false,
  children,
}) {
  return (
    <label
      className={[
        'rewards-modal__option-label',
        disabled ? 'rewards-modal__option-label--disabled' : '',
      ].filter(Boolean).join(' ')}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        className="rewards-modal__option-input"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        className={[
          'rewards-modal__option-checkbox',
          checked ? 'rewards-modal__option-checkbox--checked' : '',
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        {checked ? (
          <AssetSvg name={SVG_ICONS.status.check} width={18} height={18} alt="" />
        ) : null}
      </span>
      <span className="rewards-modal__option-text">{children}</span>
    </label>
  );
}

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {boolean} props.isShopOpen
 * @param {string | null} [props.shopOpensAt]
 * @param {() => void} props.onClose
 * @param {(payload: { shopOpen: boolean, shopOpensAtIso: string | null }) => Promise<{ ok: boolean, error?: string }>} props.onSave
 * @param {boolean} [props.isLoading]
 */
export default function ShopAccessModal({
  isOpen,
  isShopOpen,
  shopOpensAt = null,
  onClose,
  onSave,
  isLoading = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [pendingShopOpen, setPendingShopOpen] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [openDate, setOpenDate] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setPendingShopOpen(isShopOpen);

    if (shopOpensAt && !isShopOpen) {
      const { date, time } = splitIsoDateTime(shopOpensAt);
      setScheduleEnabled(true);
      setOpenDate(date);
      setOpenTime(time);
      return;
    }

    setScheduleEnabled(false);
    setOpenDate('');
    setOpenTime('');
  }, [isOpen, isShopOpen, shopOpensAt]);

  const handleToggle = () => {
    setPendingShopOpen((current) => {
      const nextOpen = !current;
      if (nextOpen) {
        setScheduleEnabled(false);
        setOpenDate('');
        setOpenTime('');
      }
      return nextOpen;
    });
  };

  const handleSave = async () => {
    setLocalLoading(true);

    const shopOpensAtIso = !pendingShopOpen && scheduleEnabled && openDate && openTime
      ? new Date(`${openDate}T${openTime}`).toISOString()
      : null;

    const result = await onSave({
      shopOpen: pendingShopOpen,
      shopOpensAtIso,
    });

    setLocalLoading(false);

    if (result?.ok) {
      onClose();
    }
  };

  const busy = isLoading || localLoading;
  const scheduleSectionDisabled = pendingShopOpen || busy;
  const scheduleInputsDisabled = scheduleSectionDisabled || !scheduleEnabled;
  const datetimeRowClassName = [
    'rewards-modal__datetime-row',
    scheduleInputsDisabled ? 'rewards-modal__datetime-row--disabled' : '',
  ].filter(Boolean).join(' ');

  const shopStatusChanged = pendingShopOpen !== isShopOpen;
  const currentScheduleIso = shopOpensAt ?? null;
  const nextScheduleIso = !pendingShopOpen && scheduleEnabled && openDate && openTime
    ? new Date(`${openDate}T${openTime}`).toISOString()
    : null;
  const scheduleChanged = !pendingShopOpen && (
    (scheduleEnabled && nextScheduleIso !== currentScheduleIso)
    || (!scheduleEnabled && currentScheduleIso != null)
  );
  const hasChanges = shopStatusChanged || scheduleChanged || (pendingShopOpen && currentScheduleIso != null);

  const confirmDisabled = busy
    || !hasChanges
    || (!pendingShopOpen && scheduleEnabled && (!openDate || !openTime));

  const confirmLabel = busy
    ? SAVING_LABEL__TEXTLABEL[LANGUAGE]
    : SAVE_BUTTON__TEXTLABEL[LANGUAGE];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ACCESS_MODAL_TITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleSave}
      confirmLabel={confirmLabel}
      confirmDisabled={confirmDisabled}
      size="sm"
      className="rewards-modal shop-access-modal"
    >
      <div className="shop-access-modal__body">
        <section className="shop-access-modal__section" aria-label={SHOP_STATUS_SECTION_LABEL__TEXTLABEL[LANGUAGE]}>
          <div className="shop-access-modal__status-card">
            <div className="shop-access-modal__status-info">
              <span className="rewards-modal__label">{SHOP_STATUS_SECTION_LABEL__TEXTLABEL[LANGUAGE]}</span>
              <p className="shop-access-modal__status-description">
                {pendingShopOpen
                  ? (LANGUAGE === 'polish' ? 'Sklep jest otwarty dla studentów' : 'Shop is open for students')
                  : (LANGUAGE === 'polish' ? 'Sklep jest zamknięty' : 'Shop is closed')}
              </p>
            </div>
            <ShopToggleButton
              isShopOpen={pendingShopOpen}
              onToggle={handleToggle}
              disabled={busy}
              className="shop-access-modal__toggle-btn"
            />
          </div>
        </section>

        <Divider className="shop-access-modal__divider" />

        <section
          className={[
            'shop-access-modal__section',
            scheduleSectionDisabled ? 'shop-access-modal__section--disabled' : '',
          ].filter(Boolean).join(' ')}
          aria-label={SCHEDULE_SECTION_LABEL__TEXTLABEL[LANGUAGE]}
          aria-disabled={scheduleSectionDisabled}
        >
          <div className="rewards-modal__field">
            <ShopOptionCheckbox
              id="shop-schedule-open"
              checked={scheduleEnabled}
              disabled={scheduleSectionDisabled}
              onChange={setScheduleEnabled}
            >
              {SCHEDULE_CHECKBOX_LABEL__TEXTLABEL[LANGUAGE]}
            </ShopOptionCheckbox>
          </div>

          <div className="rewards-modal__field">
            <span className="rewards-modal__label">{OPEN_DATE_LABEL__TEXTLABEL[LANGUAGE]}</span>
            <div className="shop-access-modal__datetime-grid">
              <div className={datetimeRowClassName}>
                <input
                  ref={dateInputRef}
                  id="shop-open-date"
                  type="date"
                  className="rewards-modal__input shop-access-modal__input"
                  value={openDate}
                  disabled={scheduleInputsDisabled}
                  onChange={(event) => setOpenDate(event.target.value)}
                  onClick={(event) => openDateTimePicker(event, dateInputRef, scheduleInputsDisabled)}
                  aria-label={OPEN_DATE_ARIA_LABEL__TEXTLABEL[LANGUAGE]}
                />
              </div>
              <div className={datetimeRowClassName}>
                <input
                  ref={timeInputRef}
                  id="shop-open-time"
                  type="time"
                  className="rewards-modal__input shop-access-modal__input"
                  value={openTime}
                  disabled={scheduleInputsDisabled}
                  onChange={(event) => setOpenTime(event.target.value)}
                  onClick={(event) => openDateTimePicker(event, timeInputRef, scheduleInputsDisabled)}
                  step={60}
                  aria-label={OPEN_TIME_ARIA_LABEL__TEXTLABEL[LANGUAGE]}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
}
