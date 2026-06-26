import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AUTH_CARD_TRANSITION_ENTER_MS,
  AUTH_CARD_TRANSITION_EXIT_MS,
} from '../../constants/authTransition.constants.js';

export const AUTH_TRANSITION_PHASE = {
  IDLE: 'idle',
  EXIT: 'exit',
  ENTER: 'enter',
};

/**
 * Sequential slide: exit completes, then enter starts (never two panes at once).
 * @param {Object} options
 * @param {string} options.locationKey
 * @param {React.ReactNode} options.currentNode
 * @param {(from: { key: string, node: React.ReactNode }, to: { key: string, node: React.ReactNode }) => ({ from: object, to: object, direction: 'forward' | 'back' } | null)} options.resolveTransition
 */
export function useAuthSequentialTransition({ locationKey, currentNode, resolveTransition }) {
  const commitRef = useRef({ key: locationKey, node: currentNode });
  const [state, setState] = useState({ phase: AUTH_TRANSITION_PHASE.IDLE, payload: null });

  useLayoutEffect(() => {
    if (state.phase !== AUTH_TRANSITION_PHASE.IDLE) {
      return;
    }

    if (locationKey !== commitRef.current.key) {
      const payload = resolveTransition(
        { key: commitRef.current.key, node: commitRef.current.node },
        { key: locationKey, node: currentNode },
      );
      if (payload !== null) {
        setState({ phase: AUTH_TRANSITION_PHASE.EXIT, payload });
        return;
      }
      commitRef.current = { key: locationKey, node: currentNode };
      return;
    }

    commitRef.current.node = currentNode;
  }, [locationKey, currentNode, resolveTransition, state.phase]);

  useEffect(() => {
    if (state.phase === AUTH_TRANSITION_PHASE.EXIT) {
      const timer = window.setTimeout(() => {
        setState((previous) => ({
          ...previous,
          phase: AUTH_TRANSITION_PHASE.ENTER,
        }));
      }, AUTH_CARD_TRANSITION_EXIT_MS);
      return () => window.clearTimeout(timer);
    }

    if (state.phase === AUTH_TRANSITION_PHASE.ENTER && state.payload !== null) {
      const timer = window.setTimeout(() => {
        commitRef.current = {
          key: state.payload.to.key,
          node: state.payload.to.node,
        };
        setState({ phase: AUTH_TRANSITION_PHASE.IDLE, payload: null });
      }, AUTH_CARD_TRANSITION_ENTER_MS);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [state.phase, state.payload]);

  return {
    phase: state.phase,
    payload: state.payload,
    settledNode: currentNode,
  };
}
