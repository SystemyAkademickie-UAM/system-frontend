import { useCallback } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { resolveAuthRouteStep } from '../../utils/resolveAuthRouteStep.js';
import AuthSlideTransitionView from './AuthSlideTransitionView.jsx';
import { useAuthSequentialTransition } from './useAuthSequentialTransition.js';
import './authTransition.css';

export default function AuthAnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();

  const resolveTransition = useCallback((from, to) => {
    const fromStep = resolveAuthRouteStep(from.key);
    const toStep = resolveAuthRouteStep(to.key);
    if (fromStep === null || toStep === null || fromStep === toStep) {
      return null;
    }
    return {
      from: { key: from.key, node: from.node },
      to: { key: to.key, node: to.node },
      direction: toStep > fromStep ? 'forward' : 'back',
    };
  }, []);

  const { phase, payload, settledNode } = useAuthSequentialTransition({
    locationKey: location.pathname,
    currentNode: outlet,
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
