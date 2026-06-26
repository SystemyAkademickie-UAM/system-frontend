import { getTemplateSummaryStats } from '../../../pages/content/templates/groupSnapshotForTemplate.js';
import './TemplateDetailPanel.css';

/**
 * @param {Object} props
 * @param {import('../../../services/groupTemplates.api.js').GroupTemplateData | null | undefined} props.data
 * @param {boolean} [props.isLoading=false]
 * @param {string} [props.className]
 */
export default function TemplateDetailPanel({ data, isLoading = false, className = '' }) {
  if (isLoading) {
    return (
      <div className={['maq-template-detail-panel', className].filter(Boolean).join(' ')}>
        <p className="maq-template-detail-panel__loading">Ładowanie podglądu szablonu…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={['maq-template-detail-panel', className].filter(Boolean).join(' ')}>
        <p className="maq-template-detail-panel__empty">Brak danych podglądu.</p>
      </div>
    );
  }

  const stats = getTemplateSummaryStats(data);
  const { group, badges, ranks, items, posts, stages } = data;

  return (
    <div className={['maq-template-detail-panel', className].filter(Boolean).join(' ')}>
      <section className="maq-template-detail-panel__section">
        <h3 className="maq-template-detail-panel__section-title">Ustawienia grupy</h3>
        <dl className="maq-template-detail-panel__kv">
          <div><dt>Nazwa</dt><dd>{group.name || '—'}</dd></div>
          <div><dt>Przedmiot</dt><dd>{group.subjectName || '—'}</dd></div>
          <div><dt>Waluta</dt><dd>{group.currency ? `${group.currencyEmoji ?? ''} ${group.currency}`.trim() : '—'}</dd></div>
          <div><dt>Życia</dt><dd>{group.lives != null ? `${group.startingLives ?? 0}/${group.lives}` : '—'}</dd></div>
        </dl>
        {group.description ? <p className="maq-template-detail-panel__text">{group.description}</p> : null}
      </section>

      <section className="maq-template-detail-panel__section">
        <h3 className="maq-template-detail-panel__section-title">Podsumowanie</h3>
        <ul className="maq-template-detail-panel__chips">
          <li>{stats.badges} odznak</li>
          <li>{stats.ranks} rang</li>
          <li>{stats.items} przedmiotów</li>
          <li>{stats.stages} etapów</li>
          <li>{stats.activities} aktywności</li>
          <li>{stats.posts} wpisów</li>
        </ul>
      </section>

      {badges.length > 0 ? (
        <section className="maq-template-detail-panel__section">
          <h3 className="maq-template-detail-panel__section-title">Odznaki ({badges.length})</h3>
          <table className="maq-template-detail-panel__table">
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Rzadkość</th>
                <th>Nagroda</th>
              </tr>
            </thead>
            <tbody>
              {badges.map((badge) => (
                <tr key={badge.id ?? badge.name}>
                  <td>{badge.name}</td>
                  <td>{badge.rarity}</td>
                  <td>{badge.rewardAmount ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {ranks.length > 0 ? (
        <section className="maq-template-detail-panel__section">
          <h3 className="maq-template-detail-panel__section-title">Rangi ({ranks.length})</h3>
          <table className="maq-template-detail-panel__table">
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Punkty</th>
                <th>Zniżka</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((rank) => (
                <tr key={rank.id ?? rank.name}>
                  <td>{rank.name}</td>
                  <td>{rank.requiredPoints}</td>
                  <td>
                    {rank.globalDiscountValue != null
                      ? `${rank.globalDiscountValue}${rank.globalDiscountType === 'percent' ? '%' : ''}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {items.length > 0 ? (
        <section className="maq-template-detail-panel__section">
          <h3 className="maq-template-detail-panel__section-title">Sklep ({items.length})</h3>
          <table className="maq-template-detail-panel__table">
            <thead>
              <tr>
                <th>Przedmiot</th>
                <th>Cena</th>
                <th>Stan</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id ?? item.name}>
                  <td>{item.name}</td>
                  <td>{item.listing?.basePrice ?? '—'}</td>
                  <td>{item.listing?.stockQuantity ?? '∞'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section className="maq-template-detail-panel__section">
          <h3 className="maq-template-detail-panel__section-title">Wpisy ({posts.length})</h3>
          <ul className="maq-template-detail-panel__list">
            {posts.map((post, index) => (
              <li key={`${post.title}-${index}`}>
                <strong>{post.title || 'Bez tytułu'}</strong>
                {post.content ? <p>{post.content}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {stages.length > 0 ? (
        <section className="maq-template-detail-panel__section">
          <h3 className="maq-template-detail-panel__section-title">Etapy i aktywności ({stages.length})</h3>
          <div className="maq-template-detail-panel__stages">
            {stages.map((stage) => (
              <article key={stage.id ?? stage.name} className="maq-template-detail-panel__stage">
                <h4>{stage.name}</h4>
                {stage.activities?.length ? (
                  <ul>
                    {stage.activities.map((activity, index) => (
                      <li key={`${activity.name}-${index}`}>
                        {activity.name}
                        <span>{activity.currency} waluty</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="maq-template-detail-panel__muted">Brak aktywności</p>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
