import { useEffect, useMemo, useState } from 'react';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import { CurrencyDisplay } from '../../../../components/ui/index.js';
import '../../group-activities/shared/activitiesShared.css';
import './memberModals.css';

function ProgressActivityRow({ activity, completed, onToggle }) {
  return (
    <tr className="activities-island__row member-progress-tree__row">
      <td className="activities-island__cell activities-island__cell--name">
        <span className="activities-island__activity-name">{activity.name}</span>
      </td>
      <td className="activities-island__cell activities-island__cell--hide-mobile activities-island__cell--truncate">
        <span className="activities-island__cell-text" title={activity.storyDescription}>
          {activity.storyDescription || '—'}
        </span>
      </td>
      <td className="activities-island__cell activities-island__cell--hide-mobile activities-island__cell--truncate">
        <span className="activities-island__cell-text" title={activity.educationalDescription}>
          {activity.educationalDescription || '—'}
        </span>
      </td>
      <td className="activities-island__cell">
        <CurrencyDisplay amount={activity.currency ?? 0} size="sm" />
      </td>
      <td className="activities-island__cell activities-island__cell--actions member-progress-tree__cell--status">
        <label
          className="member-progress-tree__checkbox-label"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <input
            type="checkbox"
            className="member-progress-tree__checkbox"
            checked={completed}
            onChange={onToggle}
            aria-label={`Oznacz aktywność ${activity.name} jako ukończoną`}
          />
          <span className="member-progress-tree__checkbox-text">
            {completed ? 'Ukończona' : 'Nieukończona'}
          </span>
        </label>
      </td>
    </tr>
  );
}

function ProgressStageIsland({ stage, progress, isExpanded, onToggleExpand, onToggleActivity }) {
  const activityCount = stage.activities?.length ?? 0;
  const activityLabel = activityCount === 1 ? 'aktywność' : 'aktywności';
  const completedCount = stage.activities.filter((activity) => progress[activity.id]).length;

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
        isExpanded ? 'activities-island--expanded' : '',
      ].filter(Boolean).join(' ')}
    >
      <header
        className="activities-island__header"
        onClick={() => onToggleExpand(stage.id)}
        onKeyDown={handleHeaderKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="activities-island__header-start">
          <span className="activities-island__icon" aria-hidden="true">
            {stage.name.trim().charAt(0).toUpperCase() || '?'}
          </span>
          <div className="activities-island__heading">
            <div className="activities-island__title-row">
              <h3 className="activities-island__title">{stage.name}</h3>
              <span className="activities-island__count">
                {completedCount}
                /
                {activityCount}
                {' '}
                {activityLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="activities-island__header-end">
          <span
            className={[
              'activities-island__chevron',
              isExpanded ? 'activities-island__chevron--open' : '',
            ].filter(Boolean).join(' ')}
            aria-hidden="true"
          >
            <AssetSvg name={SVG_ICONS.controls.chevronRight} width={20} height={20} alt="" />
          </span>
        </div>
      </header>

      {isExpanded ? (
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
                      Postęp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stage.activities.map((activity) => (
                    <ProgressActivityRow
                      key={activity.id}
                      activity={activity}
                      completed={Boolean(progress[activity.id])}
                      onToggle={() => onToggleActivity(activity.id)}
                    />
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

export default function MemberProgressTree({ stages, progress, onToggleActivity }) {
  const [expandedStages, setExpandedStages] = useState({});

  useEffect(() => {
    setExpandedStages((prev) => {
      const next = { ...prev };
      stages.forEach((stage) => {
        if (next[stage.id] === undefined) {
          next[stage.id] = true;
        }
      });
      return next;
    });
  }, [stages]);

  const visibleStages = useMemo(() => stages, [stages]);

  const toggleStage = (stageId) => {
    setExpandedStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  return (
    <div className="activities-islands member-progress-tree">
      {visibleStages.map((stage) => (
        <ProgressStageIsland
          key={stage.id}
          stage={stage}
          progress={progress}
          isExpanded={expandedStages[stage.id] !== false}
          onToggleExpand={toggleStage}
          onToggleActivity={onToggleActivity}
        />
      ))}
    </div>
  );
}
