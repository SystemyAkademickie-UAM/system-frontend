import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, TextField } from '../../../components/ui/index.js';
import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import '../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = {
  title: '',
  text: '',
  startHidden: false,
  schedulePublish: false,
  publishDate: '',
  publishTime: '',
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

function splitPublishAt(value) {
  if (!value) {
    return { publishDate: '', publishTime: '' };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { publishDate: '', publishTime: '' };
  }

  return {
    publishDate: toLocalDateValue(date),
    publishTime: toLocalTimeValue(date),
  };
}

function PostOptionCheckbox({
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

export default function PostFormModal({
  isOpen,
  post,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const isEdit = Boolean(post);

  useEffect(() => {
    if (!isOpen) return;

    if (post) {
      const hasFuturePublishAt = post.publishAt && new Date(post.publishAt) > new Date();
      const { publishDate, publishTime } = splitPublishAt(post.publishAt);
      setForm({
        title: post.title ?? '',
        text: post.text ?? '',
        startHidden: post.isPublished === false && !hasFuturePublishAt,
        schedulePublish: Boolean(hasFuturePublishAt),
        publishDate,
        publishTime,
      });
      return;
    }

    setForm(EMPTY_FORM);
  }, [isOpen, post]);

  const isValid = useMemo(
    () => form.title.trim().length > 0 && form.text.trim().length > 0,
    [form.title, form.text],
  );

  const scheduleInputsDisabled = !form.schedulePublish;
  const datetimeRowClassName = [
    'rewards-modal__datetime-row',
    scheduleInputsDisabled ? 'rewards-modal__datetime-row--disabled' : '',
  ].filter(Boolean).join(' ');

  const handleConfirm = () => {
    if (!isValid || isLoading) return;

    const hasScheduledDateTime = form.schedulePublish
      && form.publishDate.trim().length > 0
      && form.publishTime.trim().length > 0;

    onConfirm?.({
      title: form.title.trim(),
      text: form.text.trim(),
      startHidden: form.startHidden,
      schedulePublish: form.schedulePublish,
      publishAt: hasScheduledDateTime
        ? new Date(`${form.publishDate}T${form.publishTime}`).toISOString()
        : null,
      isPublished: !form.startHidden && !form.schedulePublish,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edytuj wpis' : 'Dodaj wpis'}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid || isLoading}
      confirmLabel={isLoading ? 'Zapisywanie…' : 'Zapisz'}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <TextField
          id="post-title"
          label="Temat"
          fieldKind="postTitle"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Temat wpisu"
          className="rewards-modal__field"
          inputClassName="rewards-modal__input"
        />
        <TextField
          id="post-text"
          label="Treść"
          fieldKind="postContent"
          value={form.text}
          onChange={(event) => setForm((prev) => ({ ...prev, text: event.target.value }))}
          placeholder="Treść wpisu"
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />
        <div className="rewards-modal__field">
          <PostOptionCheckbox
            id="post-start-hidden"
            checked={form.startHidden}
            onChange={(checked) => setForm((prev) => ({
              ...prev,
              startHidden: checked,
            }))}
          >
            Ukryj wpis (niepublikowany)
          </PostOptionCheckbox>
        </div>
        <div className="rewards-modal__field">
          <PostOptionCheckbox
            id="post-schedule-publish"
            checked={form.schedulePublish}
            onChange={(checked) => setForm((prev) => ({
              ...prev,
              schedulePublish: checked,
              startHidden: checked ? true : prev.startHidden,
            }))}
          >
            Opublikuj o wybranej dacie
          </PostOptionCheckbox>
        </div>
        <div className="rewards-modal__field">
          <span className="rewards-modal__label">Data publikacji</span>
          <div className={datetimeRowClassName}>
            <input
              ref={dateInputRef}
              id="post-publish-date"
              type="date"
              className="rewards-modal__input rewards-modal__input--date"
              value={form.publishDate}
              disabled={scheduleInputsDisabled}
              onChange={(event) => setForm((prev) => ({ ...prev, publishDate: event.target.value }))}
              onClick={(event) => openDateTimePicker(event, dateInputRef, scheduleInputsDisabled)}
              aria-label="Wybierz datę publikacji"
            />
          </div>
          <div className={datetimeRowClassName}>
            <input
              ref={timeInputRef}
              id="post-publish-time"
              type="time"
              className="rewards-modal__input rewards-modal__input--time"
              value={form.publishTime}
              disabled={scheduleInputsDisabled}
              onChange={(event) => setForm((prev) => ({ ...prev, publishTime: event.target.value }))}
              onClick={(event) => openDateTimePicker(event, timeInputRef, scheduleInputsDisabled)}
              step={60}
              aria-label="Wybierz godzinę publikacji"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
