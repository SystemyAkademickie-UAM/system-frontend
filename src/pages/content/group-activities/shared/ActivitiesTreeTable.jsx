import { useMemo } from 'react';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { CurrencyDisplay } from '../../../../components/ui/index.js';
import { DataTableRowActions } from '../../../../components/ui/DataTable/DataTable.jsx';
import '../../../../components/ui/DataTable/DataTable.css';
import './activitiesShared.css';

function StageIsland({
  stage,
  onToggleExpand,
  stageRowActions,
  activityRowActions,
}) {
  const activityCount = stage.activities?.length ?? 0;
  const activityLabel = activityCount === 1 ? 'aktywność' : 'aktywności';

  const handleHeaderKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggleExpand(stage.id);
    }
  };

  return (
    <article
      className={[
        'activities-island',
        stage.expanded ? 'activities-island--expanded' : '',
      ].filter(Boolean).join(' ')}
    >
      <header
        className="activities-island__header"
        onClick={() => onToggleExpand(stage.id)}
        onKeyDown={handleHeaderKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={stage.expanded}
      >
        <div className="activities-island__header-start">
          <span className="activities-island__icon" aria-hidden="true">
            {stage.name.trim().charAt(0).toUpperCase() || '?'}
          </span>
          <div className="activities-island__heading">
            <div className="activities-island__title-row">
              <h3 className="activities-island__title">{stage.name}</h3>
              <span className="activities-island__count">
                {activityCount}
                {' '}
                {activityLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="activities-island__header-end">
          <div
            className="activities-island__actions"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <DataTableRowActions row={stage} rowActions={stageRowActions} />
          </div>
          <span
            className={[
              'activities-island__chevron',
              stage.expanded ? 'activities-island__chevron--open' : '',
            ].filter(Boolean).join(' ')}
            aria-hidden="true"
          >
            <AssetSvg name={SVG_ICONS.controls.chevronRight} width={20} height={20} alt="" />
          </span>
        </div>
      </header>

      {stage.expanded ? (
        <div className="activities-island__body">
          {activityCount === 0 ? (
            <p className="activities-island__empty">Brak aktywności w tym etapie.</p>
          ) : (
            <div className="activities-island__table-wrap">
              <table className="activities-island__table">
                <thead>
                  <tr>
                    <th className="activities-island__th" scope="col">Nazwa</th>
                    <th className="activities-island__th activities-island__th--hide-mobile" scope="col">
                      Opis fabularny
                    </th>
                    <th className="activities-island__th activities-island__th--hide-mobile" scope="col">
                      Opis dydaktyczny
                    </th>
                    <th className="activities-island__th" scope="col">Nagroda</th>
                    <th className="activities-island__th activities-island__th--actions" scope="col">
                      <span className="visually-hidden">Akcje</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stage.activities.map((activity) => (
                    <tr key={`activity-${stage.id}-${activity.id}`} className="activities-island__row">
                      <td className="activities-island__cell activities-island__cell--name">
                        <span className="activities-island__activity-name">{activity.name}</span>
                      </td>
                      <td className="activities-island__cell activities-island__cell--hide-mobile activities-island__cell--truncate">
                        <span className="activities-island__cell-text" title={activity.description0}>
                          {activity.description0 || '—'}
                        </span>
                      </td>
                      <td className="activities-island__cell activities-island__cell--hide-mobile activities-island__cell--truncate">
                        <span className="activities-island__cell-text" title={activity.description1}>
                          {activity.description1 || '—'}
                        </span>
                      </td>
                      <td className="activities-island__cell">
                        <CurrencyDisplay amount={activity.reward ?? 0} size="sm" />
                      </td>
                      <td className="activities-island__cell activities-island__cell--actions">
                        <DataTableRowActions
                          row={{ stage, activity }}
                          rowActions={activityRowActions}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}

export default function ActivitiesTreeTable({
  stages,
  onToggleExpand,
  stageRowActions,
  activityRowActions,
}) {
  const visibleStages = useMemo(() => stages, [stages]);

  return (
    <div className="activities-islands">
      {visibleStages.map((stage) => (
        <StageIsland
          key={`stage-${stage.id}`}
          stage={stage}
          onToggleExpand={onToggleExpand}
          stageRowActions={stageRowActions}
          activityRowActions={activityRowActions}
        />
      ))}
    </div>
  );
}
