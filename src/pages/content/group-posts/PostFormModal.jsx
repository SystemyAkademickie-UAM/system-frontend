import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../components/ui/index.js';
import '../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = { title: '', text: '' };

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
      setForm({ title: post.title ?? '', text: post.text ?? '' });
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
    onConfirm?.({ title: form.title.trim(), text: form.text.trim() });
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
        <div className="rewards-modal__field">
          <label className="rewards-modal__label" htmlFor="post-title">
            Temat
          </label>
          <input
            id="post-title"
            className="rewards-modal__input"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Temat wpisu"
          />
        </div>
        <div className="rewards-modal__field">
          <label className="rewards-modal__label" htmlFor="post-text">
            Treść
          </label>
          <textarea
            id="post-text"
            className="rewards-modal__textarea"
            value={form.text}
            onChange={(event) => setForm((prev) => ({ ...prev, text: event.target.value }))}
            placeholder="Treść wpisu"
          />
        </div>
      </div>
    </Modal>
  );
}
