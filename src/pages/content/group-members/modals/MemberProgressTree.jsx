import { useEffect, useMemo, useState } from 'react';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import { CurrencyDisplay } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../group-activities/shared/activitiesShared.css';
import './memberModals.css';

const ACTIVITY_COMPLETED__TEXTLABEL = { polish: 'ukończona', english: 'completed' };
const ACTIVITY_INCOMPLETE__TEXTLABEL = { polish: 'nieukończona', english: 'incomplete' };
const NO_ACTIVITIES_MESSAGE__TEXTLABEL = { polish: 'Brak aktywności w tym etapie.', english: 'No activities in this stage.' };
const COLUMN_NAME__TEXTLABEL = { polish: 'Nazwa', english: 'Name' };
const COLUMN_STORY__TEXTLABEL = { polish: 'Opis fabularny', english: 'Story description' };
const COLUMN_EDUCATIONAL__TEXTLABEL = { polish: 'Opis dydaktyczny', english: 'Educational description' };
const COLUMN_REWARD__TEXTLABEL = { polish: 'Nagroda', english: 'Reward' };
const COMPLETED_COLUMN_ARIA__TEXTLABEL = { polish: 'Ukończona', english: 'Completed' };

const LANGUAGE_INSTANCE = (() => { try { return READLANGUAGECOOKIE(); } catch { return 'polish'; } })();

function ProgressActivityRow({ activity, completed, onToggle }) {
  const handleRowClick = () => {
    onToggle();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <tr
      className={[
        'activities-island__row',
        'member-progress-tree__row',
        completed ? 'member-progress-tree__row--completed' : '',
      ].filter(Boolean).join(' ')}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={completed}
      aria-label={`${activity.name} — ${completed ? ACTIVITY_COMPLETED__TEXTLABEL[LANGUAGE_INSTANCE] : ACTIVITY_INCOMPLETE__TEXTLABEL[LANGUAGE_INSTANCE]}`}
    >
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
      <td className="activities-island__cell activities-island__cell--reward">
        <CurrencyDisplay amount={activity.currency ?? 0} size="sm" />
      </td>
      <td className="activities-island__cell activities-island__cell--actions member-progress-tree__cell--status">
        <span
          className={[
            'member-progress-tree__checkbox',
            completed ? 'member-progress-tree__checkbox--checked' : '',
          ].filter(Boolean).join(' ')}
          aria-hidden="true"
        >
          {completed ? (
            <AssetSvg name={SVG_ICONS.status.check} width={18} height={18} alt="" />
          ) : null}
        </span>
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
            <p className="activities-island__empty">{NO_ACTIVITIES_MESSAGE__TEXTLABEL[LANGUAGE_INSTANCE]}</p>
          ) : (
            <div className="activities-island__table-wrap member-progress-tree__table-wrap">
              <table className="activities-island__table member-progress-tree__table">
                <thead>
                  <tr>
                    <th className="activities-island__th member-progress-tree__th--name" scope="col">{COLUMN_NAME__TEXTLABEL[LANGUAGE_INSTANCE]}</th>
                    <th className="activities-island__th activities-island__th--hide-mobile member-progress-tree__th--story" scope="col">
                      {COLUMN_STORY__TEXTLABEL[LANGUAGE_INSTANCE]}
                    </th>
                    <th className="activities-island__th activities-island__th--hide-mobile member-progress-tree__th--edu" scope="col">
                      {COLUMN_EDUCATIONAL__TEXTLABEL[LANGUAGE_INSTANCE]}
                    </th>
                    <th
                      className="activities-island__th activities-island__th--reward member-progress-tree__th--reward"
                      scope="col"
                    >
                      {COLUMN_REWARD__TEXTLABEL[LANGUAGE_INSTANCE]}
                    </th>
                    <th className="activities-island__th activities-island__th--actions member-progress-tree__th--status" scope="col">
                      <span className="visually-hidden">{COMPLETED_COLUMN_ARIA__TEXTLABEL[LANGUAGE_INSTANCE]}</span>
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
