import { useEffect, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import { MEMBER_RANKS } from '../membersMockData.js';
import './memberModals.css';

export default function MemberRankModal({
  isOpen,
  member,
  onClose,
  onConfirm,
}) {
  const [selectedRank, setSelectedRank] = useState('');

  useEffect(() => {
    if (!isOpen || !member) return;
    setSelectedRank(member.rank);
  }, [isOpen, member]);

  const handleConfirm = () => {
    onConfirm?.(selectedRank);
    onClose();
  };

  if (!member) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj rangę"
      subtitle={member.name}
      onConfirm={handleConfirm}
      size="sm"
      className="member-modal"
    >
      <ul className="member-modal__rank-list" role="radiogroup" aria-label="Wybierz rangę">
        {MEMBER_RANKS.map((rank) => {
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
                />
                <span className="member-modal__rank-name">{rank}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
