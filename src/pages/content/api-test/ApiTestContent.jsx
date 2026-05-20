import { useState } from 'react';

import EndpointCard from './EndpointCard.jsx';
import '../RouteContent.css';
import './ApiTestContent.css';

/** Default example payloads matching the backend DTOs (camelCase). */
const BADGE_PAYLOAD = {
  name: 'Odznaka Pierwszych Kroków',
  icon: '🏅',
  educationalDescription: 'Przyznawana za ukończenie pierwszego etapu kursu.',
  storyDescription: 'Bohater stawia pierwsze kroki w Akademii Magii...',
  rewardAmount: 50,
};

const RANK_PAYLOAD = {
  name: 'Adept',
  icon: '⭐',
  requiredPoints: 100,
  storyDescription: 'Adept to ktoś, kto opanował podstawy magii arkanowej.',
  storeDiscount: 5,
  uniqueStoreItems: ['Zwój Mądrości', 'Eliksir Skupienia'],
};

/**
 * Developer-only API test dashboard for gamification endpoints.
 */
export default function ApiTestContent() {
  const [groupId, setGroupId] = useState('1');

  const badgesPath = `/groups/${groupId}/badges`;
  const ranksPath = `/groups/${groupId}/ranks`;

  return (
    <section className="route-content api-test-content" aria-labelledby="api-test-title">
      <h1 id="api-test-title" className="route-content__title">
        🧪 API Test Dashboard
      </h1>
      <p className="api-test-content__subtitle">
        Strona deweloperska — testuj endpointy gamifikacji bezpośrednio z przeglądarki.
      </p>

      <div className="api-test-content__group-row">
        <label htmlFor="api-test-group-id" className="api-test-content__group-label">
          Group ID:
        </label>
        <input
          id="api-test-group-id"
          className="api-test-content__group-input"
          type="number"
          min="1"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
      </div>

      <EndpointCard
        method="POST"
        path={badgesPath}
        description="Tworzy nową odznakę (badge) w kontekście grupy. Wymaga: name, icon, educationalDescription. Opcjonalne: storyDescription, rewardAmount."
        payload={BADGE_PAYLOAD}
      />

      <EndpointCard
        method="POST"
        path={ranksPath}
        description="Tworzy nową rangę (rank) w kontekście grupy. Wymaga: name, icon, requiredPoints. Opcjonalne: storyDescription, storeDiscount, uniqueStoreItems (string[])."
        payload={RANK_PAYLOAD}
      />
    </section>
  );
}
