import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

const ToastContext = createContext(null);

const DEFAULT_DURATION_MS = 4000;
const EXIT_ANIMATION_MS = 450;

let toastCounter = 0;

function parseToastMessage(message, variant = 'success') {
  if (Array.isArray(message)) {
    const detail = message.map((item) => String(item).trim()).filter(Boolean).join(', ');
    return detail
      ? { emphasis: variant === 'error' ? 'Błąd' : '', detail }
      : { emphasis: variant === 'error' ? 'Błąd' : '', detail: 'Operacja nie powiodła się' };
  }

  if (message && typeof message === 'object') {
    return {
      emphasis: message.title ?? message.emphasis ?? '',
      detail: message.detail ?? message.body ?? message.message ?? '',
    };
  }

  const text = String(message ?? '').trim();
  if (!text) {
    return { emphasis: '', detail: '' };
  }

  const colonIndex = text.indexOf(': ');
  if (colonIndex > 0) {
    return {
      emphasis: text.slice(0, colonIndex),
      detail: text.slice(colonIndex + 2).trim(),
    };
  }

  const dashMatch = text.match(/^(.+?)\s[—–-]\s(.+)$/);
  if (dashMatch) {
    return {
      emphasis: dashMatch[1].trim(),
      detail: dashMatch[2].trim(),
    };
  }

  if (variant === 'error') {
    return { emphasis: 'Błąd', detail: text };
  }

  return { emphasis: text, detail: '' };
}

function ToastItem({ toast, onRemove, onRegisterDismiss }) {
  const [phase, setPhase] = useState('enter');

  const beginDismiss = useCallback(() => {
    setPhase((current) => {
      if (current === 'exit') {
        return current;
      }
      window.setTimeout(() => onRemove(toast.id), EXIT_ANIMATION_MS);
      return 'exit';
    });
  }, [onRemove, toast.id]);

  useEffect(() => {
    onRegisterDismiss(toast.id, beginDismiss);
    return () => onRegisterDismiss(toast.id, null);
  }, [toast.id, beginDismiss, onRegisterDismiss]);

  const { emphasis, detail } = parseToastMessage(toast.message, toast.variant);

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
      <div className="maq-toast__content">
        {emphasis ? (
          <p className="maq-toast__emphasis">{emphasis}</p>
        ) : null}
        {detail ? (
          <p className="maq-toast__detail">{detail}</p>
        ) : null}
      </div>
      <button
        type="button"
        className="maq-toast__close"
        aria-label="Zamknij komunikat"
        onClick={beginDismiss}
      >
        ×
      </button>
    </div>
  );
}

function ToastViewport({ toasts, onRemove, onRegisterDismiss }) {
  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="maq-toast-viewport" aria-label="Powiadomienia">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          onRegisterDismiss={onRegisterDismiss}
        />
      ))}
    </div>,
    document.body,
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());
  const dismissHandlersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
    const timerId = timersRef.current.get(id);
    if (timerId) {
      window.clearTimeout(timerId);
      timersRef.current.delete(id);
    }
    dismissHandlersRef.current.delete(id);
  }, []);

  const registerDismissHandler = useCallback((id, handler) => {
    if (handler) {
      dismissHandlersRef.current.set(id, handler);
      return;
    }
    dismissHandlersRef.current.delete(id);
  }, []);

  const requestDismiss = useCallback((id) => {
    const handler = dismissHandlersRef.current.get(id);
    if (handler) {
      handler();
      return;
    }
    removeToast(id);
  }, [removeToast]);

  const showToast = useCallback(({ message, variant = 'success', durationMs = DEFAULT_DURATION_MS }) => {
    if (!message) {
      return null;
    }

    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, message, variant }]);

    const timerId = window.setTimeout(() => requestDismiss(id), durationMs);
    timersRef.current.set(id, timerId);

    return id;
  }, [requestDismiss]);

  const value = useMemo(() => ({
    showToast,
    showSuccess: (message, durationMs) => showToast({ message, variant: 'success', durationMs }),
    showError: (message, durationMs) => showToast({ message, variant: 'error', durationMs }),
    dismissToast: requestDismiss,
  }), [showToast, requestDismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        onRemove={removeToast}
        onRegisterDismiss={registerDismissHandler}
      />
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
