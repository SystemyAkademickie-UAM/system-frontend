import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * @typedef {Object} AppNotification
 * @property {string} id
 * @property {string} title
 * @property {string} [message]
 * @property {string} [createdAt]
 * @property {boolean} [read]
 */

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [items, setItems] = useState(/** @type {AppNotification[]} */ ([]));

  const addNotification = useCallback((notification) => {
    const id = notification.id ?? `notification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setItems((current) => [{ ...notification, id, read: notification.read ?? false }, ...current]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setItems((current) => current.map((item) => (
      item.id === id ? { ...item, read: true } : item
    )));
  }, []);

  const clearNotifications = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(() => ({
    items,
    addNotification,
    removeNotification,
    markAsRead,
    clearNotifications,
  }), [items, addNotification, removeNotification, markAsRead, clearNotifications]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
}
