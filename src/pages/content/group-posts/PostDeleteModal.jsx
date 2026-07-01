import { useState } from 'react';
import { Modal } from '../../../components/ui/index.js';
import '../group-rewards/shared/rewardsModals.css';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const DELETEMODALTITLE__TEXTLABEL = {
  polish: 'Usuń wpis',
  english: 'Delete Post',
};

const DELETEMODALCONFIRM__TEXTLABEL = {
  polish: 'Usuń',
  english: 'Delete',
};

const DELETEMODALDEFAULTTITLE__TEXTLABEL = {
  polish: 'Bez tytułu',
  english: 'Untitled',
};

const DELETECONFIRMMESSAGE__TEXTLABEL = {
  polish: 'Czy na pewno chcesz usunąć wpis',
  english: 'Are you sure you want to delete the post',
};

export default function PostDeleteModal({
  isOpen,
  post,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  if (!post) return null;

  const title = post.title?.trim() || DELETEMODALDEFAULTTITLE__TEXTLABEL[LANGUAGE];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={DELETEMODALTITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={onConfirm}
      confirmLabel={DELETEMODALCONFIRM__TEXTLABEL[LANGUAGE]}
      confirmVariant="danger"
      confirmDisabled={isLoading}
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        {DELETECONFIRMMESSAGE__TEXTLABEL[LANGUAGE]}
        {' '}
        <strong>{title}</strong>
        ?
      </p>
    </Modal>
  );
}
