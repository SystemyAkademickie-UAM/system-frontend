import { useEffect, useRef, useState } from 'react';
import { Modal, ShopToggleButton } from '../../../../components/ui/index.js';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import '../../group-rewards/shared/rewardsModals.css';
import './shopAccessModal.css';

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
 * @param {() => Promise<{ ok: boolean, error?: string }>} props.onToggleShopOpen
 * @param {(isoDate: string | null) => Promise<{ ok: boolean, error?: string }>} props.onScheduleShopOpen
 * @param {boolean} [props.isLoading]
 */
export default function ShopAccessModal({
  isOpen,
  isShopOpen,
  shopOpensAt = null,
  onClose,
  onToggleShopOpen,
  onScheduleShopOpen,
  isLoading = false,
}) {
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

    if (shopOpensAt) {
      const { date, time } = splitIsoDateTime(shopOpensAt);
      setScheduleEnabled(true);
      setOpenDate(date);
      setOpenTime(time);
      return;
    }

    setScheduleEnabled(false);
    setOpenDate('');
    setOpenTime('');
  }, [isOpen, shopOpensAt]);

  const handleToggle = async () => {
    setLocalLoading(true);
    await onToggleShopOpen();
    setLocalLoading(false);
  };

  const handleSaveSchedule = async () => {
    setLocalLoading(true);
    const iso = scheduleEnabled && openDate && openTime
      ? new Date(`${openDate}T${openTime}`).toISOString()
      : null;
    await onScheduleShopOpen(iso);
    setLocalLoading(false);
    onClose();
  };

  const busy = isLoading || localLoading;
  const scheduleInputsDisabled = !scheduleEnabled || busy;
  const datetimeRowClassName = [
    'rewards-modal__datetime-row',
    scheduleInputsDisabled ? 'rewards-modal__datetime-row--disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dostęp do sklepu"
      onConfirm={handleSaveSchedule}
      confirmLabel={busy ? 'Zapisywanie…' : 'Zapisz harmonogram'}
      confirmDisabled={busy || (scheduleEnabled && (!openDate || !openTime))}
      size="sm"
      className="rewards-modal shop-access-modal"
    >
      <div className="shop-access-modal__body">
        <section className="shop-access-modal__section" aria-label="Status sklepu">
          <div className="shop-access-modal__row">
            <p className="rewards-modal__label">Status sklepu</p>
            <ShopToggleButton
              isShopOpen={isShopOpen}
              onToggle={handleToggle}
              disabled={busy}
            />
          </div>
        </section>

        <div className="shop-access-modal__divider" role="separator" aria-hidden="true" />

        <section className="shop-access-modal__section" aria-label="Harmonogram otwarcia sklepu">
          <div className="rewards-modal__field">
            <ShopOptionCheckbox
              id="shop-schedule-open"
              checked={scheduleEnabled}
              disabled={busy}
              onChange={setScheduleEnabled}
            >
              Ustal datę otwarcia sklepu
            </ShopOptionCheckbox>
          </div>

          <div className="rewards-modal__field">
            <span className="rewards-modal__label">Data otwarcia sklepu</span>
            <div className={datetimeRowClassName}>
              <input
                ref={dateInputRef}
                id="shop-open-date"
                type="date"
                className="rewards-modal__input rewards-modal__input--date"
                value={openDate}
                disabled={scheduleInputsDisabled}
                onChange={(event) => setOpenDate(event.target.value)}
                onClick={(event) => openDateTimePicker(event, dateInputRef, scheduleInputsDisabled)}
                aria-label="Wybierz datę otwarcia sklepu"
              />
            </div>
            <div className={datetimeRowClassName}>
              <input
                ref={timeInputRef}
                id="shop-open-time"
                type="time"
                className="rewards-modal__input rewards-modal__input--time"
                value={openTime}
                disabled={scheduleInputsDisabled}
                onChange={(event) => setOpenTime(event.target.value)}
                onClick={(event) => openDateTimePicker(event, timeInputRef, scheduleInputsDisabled)}
                step={60}
                aria-label="Wybierz godzinę otwarcia sklepu"
              />
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
}
