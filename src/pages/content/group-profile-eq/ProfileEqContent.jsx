import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfilePageLayout from '../group-profile/ProfilePageLayout.jsx';
import ProfileEqContentContent from './ProfileEqContentContent.jsx';
import ProfileEqContentWindow, {
  clearShopPurchaseSummary,
  getShopPurchaseSummary,
} from './ProfileEqContentWindow.jsx';

export default function ProfileEqContent() {
  const { groupId } = useParams();
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const [purchaseSummary, setPurchaseSummary] = useState(null);

  useEffect(() => {
    const summary = getShopPurchaseSummary(groupId);

    if (summary != null && summary.items != null && summary.items.length > 0) {
      setPurchaseSummary(summary);
      setShowPurchasePopup(true);
    }
  }, [groupId]);

  return (
    <ProfilePageLayout>
      <ProfileEqContentContent />

      {showPurchasePopup && purchaseSummary != null ? (
        <ProfileEqContentWindow
          popupclose = {() => {
            clearShopPurchaseSummary(groupId);
            setShowPurchasePopup(false);
            setPurchaseSummary(null);
          }}
          groupId = {groupId}
          purchaseditems = {purchaseSummary.items}
          currencyemoji = {purchaseSummary.currencyEmoji}
        />
      ) : null}
    </ProfilePageLayout>
  );
}
