/**
 * @file GroupDeleteConfirmModal.jsx
 * @description Modal potwierdzenia usunięcia grupy przez administratora/nadzorcę.
 */

import { useState } from 'react';
import { Button, Modal, useToast } from '../../../../components/ui/index.js';
import { deleteGroup } from '../../../../services/groups.api.js';

export default function GroupDeleteConfirmModal({
  isOpen,
  group,
  onClose,
  onDeleted,
}) {
  const { showSuccess, showError } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!group) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteGroup(group.id);
    setIsDeleting(false);

    if (result.ok) {
      showSuccess(`Grupa „${group.storyName || group.name}” została trwale usunięta.`);
      onDeleted?.();
      onClose();
      return;
    }

    showError(result.error || 'Nie udało się usunąć grupy.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isDeleting) onClose();
      }}
      title="Usuń grupę"
      confirmLabel={isDeleting ? 'Usuwanie...' : 'Usuń grupę'}
      confirmVariant="danger"
      confirmDisabled={isDeleting}
      onConfirm={handleDelete}
      size="md"
    >
      <div className="group-delete-modal-content">
        <p>
          Czy na pewno chcesz trwale usunąć grupę <strong>{group.storyName || group.name}</strong>?
        </p>
        <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Ta operacja jest nieodwracalna. Wszystkie przypisania studentów, zadania, historia ekwipunku,
          posty i konfiguracja nagród w tej grupie zostaną usunięte.
        </p>
      </div>
    </Modal>
  );
}

