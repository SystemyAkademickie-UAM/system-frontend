/**
 * @file ActivityCard.jsx
 * @description Komponent karty ActivityCard prezentujący dane w spójnym formacie wizualnym.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import './ActivityCard.css';
import { CurrencyIcon } from '../Currency/CurrencyDisplay.jsx';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * Kompaktowy kafelek ze szczegółami aktywności (podgląd przy najechaniu).
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.storyDescription
 * @param {string} props.didacticDescription
 * @param {number} [props.rewardAmount]
 * @param {string} [props.rewardEmoji] — opcjonalne nadpisanie symbolu waluty
 * @param {string} [props.className]
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function ActivityCard({
  name,
  storyDescription,
  didacticDescription,
  rewardAmount = 0,
  rewardEmoji,
  className = '',
}) {

// === RENDEROWANIE WIDOKU ===
return (
    <article className={['maq-activity-card', className].filter(Boolean).join(' ')}>
      <h3 className="maq-activity-card__name">{name}</h3>
      {storyDescription ? (
        <p className="maq-activity-card__story">{storyDescription}</p>
      ) : null}
      {didacticDescription ? (
        <p className="maq-activity-card__didactic">{didacticDescription}</p>
      ) : null}
      <p className="maq-activity-card__reward">
        {rewardAmount}
        {' '}
        <CurrencyIcon symbol={rewardEmoji} size="sm" ariaLabel="Waluta" />
      </p>
    </article>
  );
}
