import { useEffect, useMemo, useRef, useState } from 'react';
import Sortable from 'sortablejs';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { CurrencyDisplay } from '../../../../components/ui/index.js';
import { DataTableRowActions } from '../../../../components/ui/DataTable/DataTable.jsx';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../../../components/ui/DataTable/DataTable.css';
import './activitiesShared.css';

function StageIsland({
  stage,
  onToggleExpand,
  stageRowActions,
  activityRowActions,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const activityCount = stage.activities?.length ?? 0;

  const ACTIVITYCOUNT__TEXTLABEL = {
    polish: activityCount === 1 ? 'aktywność' : 'aktywności',
    english: activityCount === 1 ? 'activity' : 'activities',
  };

  const CHANGEORDER__TEXTLABEL = {
    polish: `Zmień kolejność etapu ${stage.name}`,
    english: `Change stage order ${stage.name}`,
  };
  const HIDDENBADGE__TEXTLABEL = {
    polish: 'Ukryty',
    english: 'Hidden',
  };
  const PUBLICBADGE__TEXTLABEL = {
    polish: 'Publiczny',
    english: 'Public',
  };
  const NOACTIVITIES__TEXTLABEL = {
    polish: 'Brak aktywności w tym etapie.',
    english: 'No activities in this stage.',
  };
  const NAME__TEXTLABEL = {
    polish: 'Nazwa',
    english: 'Name',
  };
  const STORY__TEXTLABEL = {
    polish: 'Opis fabularny',
    english: 'Story Description',
  };
  const EDUCATIONAL__TEXTLABEL = {
    polish: 'Opis dydaktyczny',
    english: 'Educational Description',
  };
  const REWARD__TEXTLABEL = {
    polish: 'Nagroda',
    english: 'Reward',
  };
  const PARTICIPANTS__TEXTLABEL = {
    polish: 'Uczestnicy',
    english: 'Participants',
  };
  const ACTIONS__TEXTLABEL = {
    polish: 'Akcje',
    english: 'Actions',
  };
  const PARTICIPANTSTITLE__TEXTLABEL = {
    polish: 'Uczestnicy z zaliczoną aktywnością',
    english: 'Participants with completed activity',
  };
  const isHidden = stage.visibilityStatus === 0;

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
        isHidden ? 'activities-island--hidden' : '',
      ].filter(Boolean).join(' ')}
      data-stage-id={stage.id}
    >
      <header
        className="activities-island__header"
        onClick={() => onToggleExpand(stage.id)}
        onKeyDown={handleHeaderKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={stage.expanded}
      >
        <button
          type="button"
          className="activities-island__drag-handle"
          aria-label={CHANGEORDER__TEXTLABEL[LANGUAGE]}
          onClick={(event) => event.stopPropagation()}
        >
          <span aria-hidden="true">⋮⋮</span>
        </button>
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
                {ACTIVITYCOUNT__TEXTLABEL[LANGUAGE]}
              </span>
              {isHidden ? (
                <span className="activities-island__visibility-badge">{HIDDENBADGE__TEXTLABEL[LANGUAGE]}</span>
              ) : (
                <span className="activities-island__visibility-badge activities-island__visibility-badge--visible">
                  {PUBLICBADGE__TEXTLABEL[LANGUAGE]}
                </span>
              )}
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
            <p className="activities-island__empty">{NOACTIVITIES__TEXTLABEL[LANGUAGE]}</p>
          ) : (
            <div className="activities-island__table-wrap">
              <table className="activities-island__table">
                <thead>
                  <tr>
                    <th className="activities-island__th" scope="col">{NAME__TEXTLABEL[LANGUAGE]}</th>
                    <th className="activities-island__th activities-island__th--hide-mobile" scope="col">
                      {STORY__TEXTLABEL[LANGUAGE]}
                    </th>
                    <th className="activities-island__th activities-island__th--hide-mobile" scope="col">
                      {EDUCATIONAL__TEXTLABEL[LANGUAGE]}
                    </th>
                    <th className="activities-island__th" scope="col">{REWARD__TEXTLABEL[LANGUAGE]}</th>
                    <th className="activities-island__th activities-island__th--hide-mobile" scope="col">{PARTICIPANTS__TEXTLABEL[LANGUAGE]}</th>
                    <th className="activities-island__th activities-island__th--actions" scope="col">
                      <span className="visually-hidden">{ACTIONS__TEXTLABEL[LANGUAGE]}</span>
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
                      <td className="activities-island__cell activities-island__cell--hide-mobile activities-island__cell--participants">
                        <span className="activities-island__participants-count" title={PARTICIPANTSTITLE__TEXTLABEL[LANGUAGE]}>
                          {activity.completionCount ?? 0}
                        </span>
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
  onReorderStages,
}) {
  const containerRef = useRef(null);
  const visibleStages = useMemo(() => stages, [stages]);

  useEffect(() => {
    if (!containerRef.current || !onReorderStages) {
      return undefined;
    }

    const sortable = Sortable.create(containerRef.current, {
      animation: 150,
      handle: '.activities-island__drag-handle',
      draggable: '.activities-island',
      onEnd() {
        const orderedIds = [...containerRef.current.querySelectorAll('[data-stage-id]')]
          .map((element) => Number(element.getAttribute('data-stage-id')))
          .filter((id) => Number.isFinite(id));

        if (orderedIds.length > 0) {
          onReorderStages(orderedIds);
        }
      },
    });

    return () => {
      sortable.destroy();
    };
  }, [onReorderStages, visibleStages]);

  return (
    <div className="activities-islands" ref={containerRef}>
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
