import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

const ToastContext = createContext(null);

const DEFAULT_DURATION_MS = 4000;
const EXIT_ANIMATION_MS = 450;

let toastCounter = 0;

function ToastItem({ toast, onDismiss }) {
  const [phase, setPhase] = useState('enter');

  const handleDismiss = useCallback(() => {
    setPhase('exit');
    window.setTimeout(() => onDismiss(toast.id), EXIT_ANIMATION_MS);
  }, [onDismiss, toast.id]);

  return (
    <div
      className={[
        'maq-toast',
        `maq-toast--${toast.variant}`,
        phase === 'enter' ? 'maq-toast--enter' : '',
        phase === 'exit' ? 'maq-toast--exit' : '',
      ].filter(Boolean).join(' ')}
      role={toast.variant === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <p className="maq-toast__message">{toast.message}</p>
      <button
        type="button"
        className="maq-toast__close"
        aria-label="Zamknij komunikat"
        onClick={handleDismiss}
      >
        ×
      </button>
    </div>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="maq-toast-viewport" aria-label="Powiadomienia">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
    const timerId = timersRef.current.get(id);
    if (timerId) {
      window.clearTimeout(timerId);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(({ message, variant = 'success', durationMs = DEFAULT_DURATION_MS }) => {
    if (!message) {
      return null;
    }

    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, message, variant }]);

    const timerId = window.setTimeout(() => dismissToast(id), durationMs);
    timersRef.current.set(id, timerId);

    return id;
  }, [dismissToast]);

  const value = useMemo(() => ({
    showToast,
    showSuccess: (message, durationMs) => showToast({ message, variant: 'success', durationMs }),
    showError: (message, durationMs) => showToast({ message, variant: 'error', durationMs }),
    dismissToast,
  }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
