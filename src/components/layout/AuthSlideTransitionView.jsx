import { AUTH_TRANSITION_PHASE } from './useAuthSequentialTransition.js';

/**
 * @param {Object} props
 * @param {'idle' | 'exit' | 'enter'} props.phase
 * @param {'forward' | 'back'} [props.direction]
 * @param {React.ReactNode} props.settledNode
 * @param {{ from: { node: React.ReactNode }, to: { node: React.ReactNode }, direction: 'forward' | 'back' } | null} props.payload
 */
export default function AuthSlideTransitionView({ phase, direction, settledNode, payload }) {
  return (
    <div className="auth-shell__transition-viewport">
      {phase === AUTH_TRANSITION_PHASE.IDLE && (
        <div className="auth-shell__transition-pane auth-shell__transition-pane--settled">
          {settledNode}
        </div>
      )}

      {phase === AUTH_TRANSITION_PHASE.EXIT && payload !== null && (
        <div
          className={`auth-shell__transition-pane auth-shell__transition-pane--exit auth-shell__transition-pane--${payload.direction}`}
          aria-hidden="true"
        >
          {payload.from.node}
        </div>
      )}

      {phase === AUTH_TRANSITION_PHASE.ENTER && payload !== null && (
        <div
          className={`auth-shell__transition-pane auth-shell__transition-pane--enter auth-shell__transition-pane--${payload.direction}`}
        >
          {payload.to.node}
        </div>
      )}
    </div>
  );
}
