import { useEffect, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import { AUTO_RANK_OPTION } from '../../../../utils/ranks/autoRankAssignment.js';
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
    setSelectedRank(member.autoRankEnabled === false ? (member.rank || '') : AUTO_RANK_OPTION);
  }, [isOpen, member]);

  const handleConfirm = () => {
    onConfirm?.(selectedRank);
  };

  if (!member) {
    return null;
  }

  const rankOptions = ranks.length > 0 ? ranks : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edytuj rangę"
      subtitle={member.name}
      onConfirm={handleConfirm}
      confirmDisabled={isLoading || (rankOptions.length === 0 && selectedRank !== AUTO_RANK_OPTION)}
      size="sm"
      className="member-modal"
    >
      {rankOptions.length === 0 ? (
        <p className="member-modal__empty">Brak zdefiniowanych rang w tej grupie.</p>
      ) : (
        <ul className="member-modal__rank-list" role="radiogroup" aria-label="Wybierz rangę">
          <li>
            <label
              className={[
                'member-modal__rank-option',
                selectedRank === AUTO_RANK_OPTION ? 'member-modal__rank-option--selected' : '',
              ].join(' ')}
            >
              <input
                type="radio"
                name="member-rank"
                className="member-modal__rank-radio"
                value={AUTO_RANK_OPTION}
                checked={selectedRank === AUTO_RANK_OPTION}
                onChange={() => setSelectedRank(AUTO_RANK_OPTION)}
                disabled={isLoading}
              />
              <span className="member-modal__rank-name">Automatyczna</span>
            </label>
          </li>
          {rankOptions.map((rank) => {
            const isSelected = selectedRank === rank.name;

            return (
              <li key={rank.id ?? rank.name}>
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
                    value={rank.name}
                    checked={isSelected}
                    onChange={() => setSelectedRank(rank.name)}
                    disabled={isLoading}
                  />
                  <span className="member-modal__rank-name">{rank.name}</span>
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
