import { useCallback } from 'react';
import AuthSlideTransitionView from './AuthSlideTransitionView.jsx';
import { useAuthSequentialTransition } from './useAuthSequentialTransition.js';
import './authTransition.css';

/**
 * In-page wizard transitions (URL stays on `/login`).
 * @param {Object} props
 * @param {string} props.activeKey
 * @param {Record<string, number>} props.stepOrder
 * @param {React.ReactNode} props.children
 */
export default function AuthStepTransition({ activeKey, stepOrder, children }) {
  const resolveTransition = useCallback((from, to) => {
    const fromOrder = stepOrder[from.key];
    const toOrder = stepOrder[to.key];
    if (fromOrder === undefined || toOrder === undefined || fromOrder === toOrder) {
      return null;
    }
    return {
      from: { key: from.key, node: from.node },
      to: { key: to.key, node: to.node },
      direction: toOrder > fromOrder ? 'forward' : 'back',
    };
  }, [stepOrder]);

  const { phase, payload, settledNode } = useAuthSequentialTransition({
    locationKey: activeKey,
    currentNode: children,
    resolveTransition,
  });

  return (
    <AuthSlideTransitionView
      phase={phase}
      payload={payload}
      settledNode={settledNode}
    />
  );
}
