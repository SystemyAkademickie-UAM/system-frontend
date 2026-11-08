/**
 * @file ProfileHomeContent.jsx
 * @description Główny komponent widoku strony dla obszaru ProfileHomeContent.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import ProfilePageLayout from './ProfilePageLayout.jsx';
import ProfileBadgesSection from './ProfileBadgesSection.jsx';

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function ProfileHomeContent() {
  return (
    <ProfilePageLayout>
      <ProfileBadgesSection />
    </ProfilePageLayout>
  );
}
