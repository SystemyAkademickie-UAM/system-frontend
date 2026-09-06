import { useState } from 'react';
import { Button } from '../../../../components/ui/index.js';
import {
  areAllRewardsItemsPublished,
  getBulkVisibilityToggleLabel,
} from '../../../../utils/rewards/bulkVisibilityToggle.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const SAVINGLABEL__TEXTLABEL = {
  polish: 'Zapisywanie…',
  english: 'Saving…'
};

/**
 * @param {{
 *   items: Array<{ isPublished?: boolean }>,
 *   isLoading?: boolean,
 *   disabled?: boolean,
 *   onToggleAll: () => void | Promise<void>,
 *   className?: string,
 * }} props
 */
export default function RewardsBulkVisibilityButton({
  items,
  isLoading = false,
  disabled = false,
  onToggleAll,
  className = '',
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const allPublished = areAllRewardsItemsPublished(items);
  const label = getBulkVisibilityToggleLabel(items);

  return (
    <Button
      type="button"
      variant={allPublished ? 'secondary' : 'primary'}
      size="md"
      className={['rewards-page__bulk-visibility-btn', className].filter(Boolean).join(' ')}
      disabled={disabled || isLoading || items.length === 0}
      onClick={onToggleAll}
    >
      {isLoading ? SAVINGLABEL__TEXTLABEL[LANGUAGE] : label}
    </Button>
  );
}
