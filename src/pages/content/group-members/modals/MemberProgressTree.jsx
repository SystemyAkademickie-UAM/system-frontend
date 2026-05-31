import { Fragment, useMemo, useState } from 'react';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import ActivityCard from '../../../../components/ui/ActivityCard/ActivityCard.jsx';
import { CurrencyDisplay } from '../../../../components/ui/index.js';
import './memberModals.css';

function ProgressActivityRow({ activity, completed, onToggle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="member-progress-tree__activity-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <label className="member-progress-tree__activity-label">
        <input
          type="checkbox"
          className="member-progress-tree__checkbox"
          checked={completed}
          onChange={onToggle}
        />
        <span className="member-progress-tree__activity-name">{activity.name}</span>
      </label>
      <CurrencyDisplay amount={activity.currency ?? 0} size="sm" />
      {hovered ? (
        <div className="member-progress-tree__preview" aria-hidden="true">
          <ActivityCard
            name={activity.name}
            storyDescription={activity.storyDescription}
            didacticDescription={activity.educationalDescription}
            rewardAmount={activity.currency ?? 0}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function MemberProgressTree({ stages, progress, onToggleActivity }) {
  const [expandedStages, setExpandedStages] = useState(() => (
    Object.fromEntries(stages.map((stage) => [stage.id, true]))
  ));

  const visibleStages = useMemo(() => stages, [stages]);

  const toggleStage = (stageId) => {
    setExpandedStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  return (
    <div className="member-progress-tree">
      <table className="member-progress-tree__table">
        <thead>
          <tr>
            <th>Aktywność</th>
            <th>Nagroda</th>
          </tr>
        </thead>
        <tbody>
          {visibleStages.map((stage) => {
            const isExpanded = expandedStages[stage.id] !== false;

            return (
              <Fragment key={stage.id}>
                <tr className="member-progress-tree__stage-row">
                  <td colSpan={2}>
                    <button
                      type="button"
                      className={[
                        'member-progress-tree__stage-toggle',
                        isExpanded ? 'member-progress-tree__stage-toggle--open' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => toggleStage(stage.id)}
                      aria-expanded={isExpanded}
                    >
                      <AssetSvg name="ui-chevron-right.svg" width={16} height={16} alt="" />
                      <span>{stage.name}</span>
                    </button>
                  </td>
                </tr>
                {isExpanded
                  ? stage.activities.map((activity) => (
                    <tr key={activity.id} className="member-progress-tree__activity-item">
                      <td colSpan={2}>
                        <ProgressActivityRow
                          activity={activity}
                          completed={Boolean(progress[activity.id])}
                          onToggle={() => onToggleActivity(activity.id)}
                        />
                      </td>
                    </tr>
                  ))
                  : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
