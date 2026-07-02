import { useCallback, useEffect, useState } from 'react';
import { Modal, Rank } from '../../../../components/ui/index.js';
import { AUTO_RANK_OPTION } from '../../../../utils/ranks/autoRankAssignment.js';
import { mapRankDiscountValue } from '../../group-main-ranks/rankPathModel.js';
import { normalizeRankBadgeIcon, DEFAULT_RANK_EMOJI } from '../../../../utils/ranks/rankBadgeIcon.js';
import './memberModals.css';

const MOBILE_RANK_PICKER_MAX_WIDTH_PX = 768;

function useMobileRankPickerLayout() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia(`(max-width: ${MOBILE_RANK_PICKER_MAX_WIDTH_PX}px)`).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_RANK_PICKER_MAX_WIDTH_PX}px)`);
    const onChange = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

export default function MemberRankModal({
  isOpen,
  member,
  ranks = [],
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [selectedRank, setSelectedRank] = useState('');
  const [expandedRankName, setExpandedRankName] = useState(null);
  const isMobilePicker = useMobileRankPickerLayout();

  useEffect(() => {
    if (!isOpen || !member) {
      return;
    }

    const initialRank = member.autoRankEnabled === false ? (member.rank || '') : AUTO_RANK_OPTION;
    setSelectedRank(initialRank);
    setExpandedRankName(member.autoRankEnabled === false ? initialRank : null);
  }, [isOpen, member]);

  const handleConfirm = () => {
    onConfirm?.(selectedRank);
  };

  const handleSelectAutomatic = useCallback(() => {
    setSelectedRank(AUTO_RANK_OPTION);
    setExpandedRankName(null);
  }, []);

  const handleSelectRank = useCallback((rankName) => {
    setSelectedRank(rankName);
    if (isMobilePicker) {
      setExpandedRankName(rankName);
    }
  }, [isMobilePicker]);

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
      size="md"
      className="member-modal member-modal--rank-picker"
    >
      {rankOptions.length === 0 ? (
        <p className="member-modal__empty">Brak zdefiniowanych rang w tej grupie.</p>
      ) : (
        <ul className="member-modal__rank-grid" role="radiogroup" aria-label="Wybierz rangę">
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
                onChange={handleSelectAutomatic}
                disabled={isLoading}
              />
              <span className="member-modal__rank-name">Automatyczna</span>
            </label>
          </li>
          {rankOptions.map((rank) => {
            const isSelected = selectedRank === rank.name;
            const isExpanded = !isMobilePicker || expandedRankName === rank.name;

            return (
              <li key={rank.id ?? rank.name}>
                <label
                  className={[
                    'member-modal__rank-tile',
                    isSelected ? 'member-modal__rank-tile--selected' : '',
                    isMobilePicker && !isExpanded ? 'member-modal__rank-tile--collapsed' : '',
                    isMobilePicker && isExpanded ? 'member-modal__rank-tile--expanded' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <input
                    type="radio"
                    name="member-rank"
                    className="member-modal__rank-tile-radio"
                    value={rank.name}
                    checked={isSelected}
                    onChange={() => handleSelectRank(rank.name)}
                    disabled={isLoading}
                  />
                  <Rank
                    name={rank.name}
                    costAmount={rank.requiredPoints ?? 0}
                    storyDescription={rank.storyDescription || '—'}
                    shopItems={rank.uniqueStoreItems || []}
                    discountPercent={mapRankDiscountValue(rank)}
                    iconFile={normalizeRankBadgeIcon(rank.icon, DEFAULT_RANK_EMOJI)}
                    className="member-modal__rank-preview"
                  />
                </label>
              </li>
            );
          })}
        </ul>
      )}
      {isLoading ? <p className="member-modal__loading">Zapisywanie...</p> : null}
    </Modal>
  );
}
