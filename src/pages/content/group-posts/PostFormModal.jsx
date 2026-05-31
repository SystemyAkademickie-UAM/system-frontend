import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/index.js';
import '../group-members/modals/memberModals.css';

export default function PostFormModal({
  isOpen,
  initialValues = { title: '', text: '' },
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialValues.title ?? '');
    setText(initialValues.text ?? '');
  }, [isOpen, initialValues.title, initialValues.text]);

  const isValid = title.trim() && text.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialValues.id ? 'Edytuj wpis' : 'Dodaj wpis'}
      onConfirm={() => onConfirm?.({ title: title.trim(), text: text.trim() })}
      confirmDisabled={!isValid || isLoading}
      confirmLabel={isLoading ? 'Zapisywanie…' : 'Zapisz'}
      size="md"
      className="member-modal"
    >
      <div className="member-modal__form">
        <label className="member-modal__field-label" htmlFor="post-title">Temat</label>
        <input
          id="post-title"
          className="member-modal__input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Temat wpisu"
        />
        <label className="member-modal__field-label" htmlFor="post-text">Treść</label>
        <textarea
          id="post-text"
          className="member-modal__textarea"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Treść wpisu"
        />
      </div>
    </Modal>
  );
}
