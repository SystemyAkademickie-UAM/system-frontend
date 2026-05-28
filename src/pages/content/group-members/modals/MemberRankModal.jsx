import { useEffect, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import './memberModals.css';

export default function MemberRankModal({
  isOpen,
  member,
  ranks = [],
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [selectedRank, setSelectedRank] = useState('');

  useEffect(() => {
    if (!isOpen || !member) return;
    setSelectedRank(member.rank || '');
  }, [isOpen, member]);

  const handleConfirm = () => {
    onConfirm?.(selectedRank);
  };

  if (!member) {
    return null;
  }

  const availableRanks = ranks.length > 0 ? ranks : ['Brak rang'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj rangę"
      subtitle={member.name}
      onConfirm={handleConfirm}
      confirmDisabled={isLoading}
      size="sm"
      className="member-modal"
    >
      {ranks.length === 0 ? (
        <p className="member-modal__empty">Brak zdefiniowanych rang w tej grupie.</p>
      ) : (
        <ul className="member-modal__rank-list" role="radiogroup" aria-label="Wybierz rangę">
          {availableRanks.map((rank) => {
            const isSelected = selectedRank === rank;

            return (
              <li key={rank}>
                <label
                  className={[
                    'member-modal__rank-option',
                    isSelected ? 'member-modal__rank-option--selected' : '',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="member-rank"
                    className="member-modal__rank-radio"
                    value={rank}
                    checked={isSelected}
                    onChange={() => setSelectedRank(rank)}
                    disabled={isLoading}
                  />
                  <span className="member-modal__rank-name">{rank}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
      {isLoading && <p className="member-modal__loading">Zapisywanie...</p>}
    </Modal>
  );
}
