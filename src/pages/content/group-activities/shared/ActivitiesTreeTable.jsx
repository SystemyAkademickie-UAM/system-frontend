import { Fragment, useMemo } from 'react';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { Button, CurrencyDisplay } from '../../../../components/ui/index.js';
import { DataTableRowActions } from '../../../../components/ui/DataTable/DataTable.jsx';
import '../../../../components/ui/DataTable/DataTable.css';
import './activitiesShared.css';

function StageRow({
  stage,
  onToggleExpand,
  stageRowActions,
}) {
  const activityCount = stage.activities?.length ?? 0;

  return (
    <tr className="data-table__row activities-tree-table__row activities-tree-table__row--stage">
      <td className="data-table__cell activities-tree-table__cell--name">
        <div className="activities-tree-table__name-cell">
          <button
            type="button"
            className={[
              'activities-tree-table__expand-btn',
              stage.expanded ? 'activities-tree-table__expand-btn--open' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => onToggleExpand(stage.id)}
            aria-label={stage.expanded ? `Zwiń etap ${stage.name}` : `Rozwiń etap ${stage.name}`}
            aria-expanded={stage.expanded}
          >
            <AssetSvg name="ui-chevron-right.svg" width={18} height={18} alt="" />
          </button>
          <span className="activities-tree-table__stage-name">{stage.name}</span>
          <span className="activities-tree-table__activity-count">
            {activityCount}
            {' '}
            {activityCount === 1 ? 'aktywność' : 'aktywności'}
          </span>
        </div>
      </td>
      <td className="data-table__cell data-table__cell--hide-below-768 activities-tree-table__cell--truncate">
        <span className="activities-tree-table__cell-text activities-tree-table__cell-text--muted">—</span>
      </td>
      <td className="data-table__cell data-table__cell--hide-below-768 activities-tree-table__cell--truncate">
        <span className="activities-tree-table__cell-text activities-tree-table__cell-text--muted">—</span>
      </td>
      <td className="data-table__cell">
        <span className="activities-tree-table__cell-text activities-tree-table__cell-text--muted">—</span>
      </td>
      <td className="data-table__cell data-table__cell--actions">
        <DataTableRowActions row={stage} rowActions={stageRowActions} />
      </td>
    </tr>
  );
}

function ActivityRow({ stage, activity, activityRowActions }) {
  return (
    <tr className="data-table__row activities-tree-table__row activities-tree-table__row--activity">
      <td className="data-table__cell activities-tree-table__cell--name">
        <div className="activities-tree-table__name-cell">
          <span className="activities-tree-table__expand-spacer" aria-hidden="true" />
          <span className="activities-tree-table__activity-name">{activity.name}</span>
        </div>
      </td>
      <td className="data-table__cell data-table__cell--hide-below-768 activities-tree-table__cell--truncate">
        <span className="activities-tree-table__cell-text" title={activity.description0}>
          {activity.description0 || '—'}
        </span>
      </td>
      <td className="data-table__cell data-table__cell--hide-below-768 activities-tree-table__cell--truncate">
        <span className="activities-tree-table__cell-text" title={activity.description1}>
          {activity.description1 || '—'}
        </span>
      </td>
      <td className="data-table__cell">
        <CurrencyDisplay amount={activity.reward ?? 0} size="sm" />
      </td>
      <td className="data-table__cell data-table__cell--actions">
        <DataTableRowActions row={{ stage, activity }} rowActions={activityRowActions} />
      </td>
    </tr>
  );
}

function AddActivityRow({ stage, onAddActivity }) {
  return (
    <tr className="data-table__row activities-tree-table__row activities-tree-table__row--footer">
      <td className="data-table__cell" colSpan={5}>
        <Button
          variant="secondary"
          size="md"
          className="activities-tree-table__add-row-btn"
          onClick={() => onAddActivity(stage)}
        >
          Dodaj aktywność
        </Button>
      </td>
    </tr>
  );
}

export default function ActivitiesTreeTable({
  stages,
  onToggleExpand,
  onAddActivity,
  stageRowActions,
  activityRowActions,
}) {
  const visibleStages = useMemo(() => stages, [stages]);

  return (
    <div className="data-table-wrap activities-tree-table">
      <div className="data-table__content">
        <div className="data-table-card">
          <div className="data-table-header-bar">
            <div className="data-table-header-scroll">
              <table className="data-table data-table--header data-table--compact">
                <colgroup>
                  <col style={{ width: '28%' }} />
                  <col style={{ width: '24%' }} className="data-table__col--hide-below-768" />
                  <col style={{ width: '24%' }} className="data-table__col--hide-below-768" />
                  <col style={{ width: '12%' }} />
                  <col className="data-table__col data-table__col--actions" style={{ width: '100px' }} />
                </colgroup>
                <thead className="data-table__head">
                  <tr>
                    <th className="data-table__th" scope="col">Nazwa</th>
                    <th className="data-table__th data-table__th--hide-below-768" scope="col">Opis fabularny</th>
                    <th className="data-table__th data-table__th--hide-below-768" scope="col">Opis dydaktyczny</th>
                    <th className="data-table__th" scope="col">Nagroda</th>
                    <th className="data-table__th data-table__th--actions" scope="col">
                      <span className="visually-hidden">Akcje</span>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          <div className="data-table-viewport">
            <table className="data-table data-table--body data-table--compact">
              <colgroup>
                <col style={{ width: '28%' }} />
                <col style={{ width: '24%' }} className="data-table__col--hide-below-768" />
                <col style={{ width: '24%' }} className="data-table__col--hide-below-768" />
                <col style={{ width: '12%' }} />
                <col className="data-table__col data-table__col--actions" style={{ width: '100px' }} />
              </colgroup>
              <tbody className="data-table__body">
                {visibleStages.map((stage) => (
                  <Fragment key={`stage-group-${stage.id}`}>
                    <StageRow
                      stage={stage}
                      onToggleExpand={onToggleExpand}
                      stageRowActions={stageRowActions}
                    />
                    {stage.expanded ? (
                      <>
                        {stage.activities.map((activity) => (
                          <ActivityRow
                            key={`activity-${stage.id}-${activity.id}`}
                            stage={stage}
                            activity={activity}
                            activityRowActions={activityRowActions}
                          />
                        ))}
                        <AddActivityRow
                          stage={stage}
                          onAddActivity={onAddActivity}
                        />
                      </>
                    ) : null}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
