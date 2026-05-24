import './ActivityCard.css';

/**
 * Kompaktowy kafelek ze szczegółami aktywności (podgląd przy najechaniu).
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.storyDescription
 * @param {string} props.didacticDescription
 * @param {number} [props.rewardAmount]
 * @param {string} [props.rewardEmoji='🥕']
 * @param {string} [props.className]
 */
export default function ActivityCard({
  name,
  storyDescription,
  didacticDescription,
  rewardAmount = 0,
  rewardEmoji = '🥕',
  className = '',
}) {
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
        <span aria-hidden="true">{rewardEmoji}</span>
      </p>
    </article>
  );
}
