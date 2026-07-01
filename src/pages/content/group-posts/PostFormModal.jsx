import { useEffect, useMemo, useState } from 'react';
import { Modal, TextField } from '../../../components/ui/index.js';
import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import '../group-rewards/shared/rewardsModals.css';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const ADDTITLE__TEXTLABEL = {
  polish: 'Dodaj wpis',
  english: 'Add Post',
};

const EDITTITLE__TEXTLABEL = {
  polish: 'Edytuj wpis',
  english: 'Edit Post',
};

const SAVING__TEXTLABEL = {
  polish: 'Zapisywanie...',
  english: 'Saving...',
};

const SAVEBUTTON__TEXTLABEL = {
  polish: 'Zapisz',
  english: 'Save',
};

const TITLE__TEXTLABEL = {
  polish: 'Temat',
  english: 'Title',
};

const TITLEPLACEHOLDER__TEXTLABEL = {
  polish: 'Temat wpisu',
  english: 'Post title',
};

const TEXTCONTENT__TEXTLABEL = {
  polish: 'Treść',
  english: 'Content',
};

const TEXTPLACEHOLDER__TEXTLABEL = {
  polish: 'Treść wpisu',
  english: 'Post content',
};

const HIDEOPTION__TEXTLABEL = {
  polish: 'Ukryj wpis (niepublikowany)',
  english: 'Hide post (unpublished)',
};

const SCHEDULEOPTION__TEXTLABEL = {
  polish: 'Opublikuj o wybranej dacie',
  english: 'Publish on selected date',
};

const PUBLISH__TEXTLABEL = {
  polish: 'Data publikacji',
  english: 'Publication date',
};

const EMPTY_FORM = {
  title: '',
  text: '',
  startHidden: false,
  schedulePublish: false,
  publishAt: '',
};

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

export default function PostFormModal({
  isOpen,
  post,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = Boolean(post);

  useEffect(() => {
    if (!isOpen) return;

    if (post) {
      const hasFuturePublishAt = post.publishAt && new Date(post.publishAt) > new Date();
      setForm({
        title: post.title ?? '',
        text: post.text ?? '',
        startHidden: post.isPublished === false && !hasFuturePublishAt,
        schedulePublish: Boolean(hasFuturePublishAt),
        publishAt: post.publishAt
          ? new Date(post.publishAt).toISOString().slice(0, 16)
          : '',
      });
      return;
    }

    setForm(EMPTY_FORM);
  }, [isOpen, post]);

  const isValid = useMemo(
    () => form.title.trim().length > 0 && form.text.trim().length > 0,
    [form.title, form.text],
  );

  const handleConfirm = () => {
    if (!isValid || isLoading) return;
    onConfirm?.({
      title: form.title.trim(),
      text: form.text.trim(),
      startHidden: form.startHidden,
      schedulePublish: form.schedulePublish,
      publishAt: form.schedulePublish && form.publishAt
        ? new Date(form.publishAt).toISOString()
        : null,
      isPublished: !form.startHidden && !form.schedulePublish,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? EDITTITLE__TEXTLABEL[LANGUAGE] : ADDTITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid || isLoading}
      confirmLabel={isLoading ? SAVING__TEXTLABEL[LANGUAGE] : SAVEBUTTON__TEXTLABEL[LANGUAGE]}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <TextField
          id="post-title"
          label={TITLE__TEXTLABEL[LANGUAGE]}
          fieldKind="postTitle"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder={TITLEPLACEHOLDER__TEXTLABEL[LANGUAGE]}
          className="rewards-modal__field"
          inputClassName="rewards-modal__input"
        />
        <TextField
          id="post-text"
          label={TEXTCONTENT__TEXTLABEL[LANGUAGE]}
          fieldKind="postContent"
          value={form.text}
          onChange={(event) => setForm((prev) => ({ ...prev, text: event.target.value }))}
          placeholder={TEXTPLACEHOLDER__TEXTLABEL[LANGUAGE]}
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
              schedulePublish: checked ? false : prev.schedulePublish,
            }))}
          >
            {HIDEOPTION__TEXTLABEL[LANGUAGE]}
          </PostOptionCheckbox>
        </div>
        <div className="rewards-modal__field">
          <PostOptionCheckbox
            id="post-schedule-publish"
            checked={form.schedulePublish}
            disabled={form.startHidden}
            onChange={(checked) => setForm((prev) => ({
              ...prev,
              schedulePublish: checked,
            }))}
          >
            {SCHEDULEOPTION__TEXTLABEL[LANGUAGE]}
          </PostOptionCheckbox>
        </div>
        {form.schedulePublish && !form.startHidden ? (
          <div className="rewards-modal__field">
            <label htmlFor="post-publish-at" className="rewards-modal__label">
              {PUBLISH__TEXTLABEL[LANGUAGE]}
            </label>
            <input
              id="post-publish-at"
              type="datetime-local"
              className="rewards-modal__input"
              value={form.publishAt}
              onChange={(event) => setForm((prev) => ({ ...prev, publishAt: event.target.value }))}
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
