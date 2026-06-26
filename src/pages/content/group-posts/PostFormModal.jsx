import { useEffect, useMemo, useState } from 'react';
import { Modal, TextField } from '../../../components/ui/index.js';
import '../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = {
  title: '',
  text: '',
  startHidden: false,
  schedulePublish: false,
  publishAt: '',
};

export default function PostFormModal({
  isOpen,
  post,
  onClose,
  onConfirm,
  isLoading = false,
}) {
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
          <label className="rewards-modal__checkbox-label">
            <input
              type="checkbox"
              checked={form.startHidden}
              onChange={(event) => setForm((prev) => ({
                ...prev,
                startHidden: event.target.checked,
                schedulePublish: event.target.checked ? false : prev.schedulePublish,
              }))}
            />
            <span>Ukryj wpis (niepublikowany)</span>
          </label>
        </div>
        <div className="rewards-modal__field">
          <label className="rewards-modal__checkbox-label">
            <input
              type="checkbox"
              checked={form.schedulePublish}
              disabled={form.startHidden}
              onChange={(event) => setForm((prev) => ({
                ...prev,
                schedulePublish: event.target.checked,
              }))}
            />
            <span>Opublikuj o wybranej dacie</span>
          </label>
        </div>
        {form.schedulePublish && !form.startHidden ? (
          <div className="rewards-modal__field">
            <label htmlFor="post-publish-at" className="rewards-modal__label">
              Data publikacji
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
