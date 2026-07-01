import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchGroupBacklog,
  fetchGroupBacklogTotalCount,
  fetchGroupBacklogUnreadCount,
  markAllGroupBacklogRead,
  markGroupBacklogItemRead,
} from '../../services/backlog.api.js';
import { formatBacklogNotification } from '../../utils/notifications/formatBacklogNotification.js';
import {
  notifyBacklogNotificationRead,
  notifyBacklogNotificationsAllRead,
  subscribeBacklogNotificationSync,
} from '../../utils/notifications/backlogNotificationsSync.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

const FETCHERROR__TEXTLABEL = {
  polish: 'Nie udało się pobrać powiadomień.',
  english: 'Failed to load notifications.',
};

/**
 * @param {string | number | null | undefined} groupId
 * @param {{ isStudentView?: boolean, take?: number, skip?: number, pollMs?: number }} [options]
 */
export function useGroupBacklogNotifications(groupId, {
  isStudentView = false,
  take = 50,
  skip = 0,
  pollMs = 60000,
} = {}) {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(Boolean(groupId));
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    if (!groupId) {
      setItems([]);
      setTotalCount(0);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const [listResult, totalResult, countResult] = await Promise.all([
        fetchGroupBacklog(groupId, { take, skip, studentView: isStudentView }),
        fetchGroupBacklogTotalCount(groupId),
        fetchGroupBacklogUnreadCount(groupId),
      ]);

      if (!listResult.ok) {
        setError(listResult.error ?? FETCHERROR__TEXTLABEL[LANGUAGE]);
        setItems([]);
      } else {
        setItems(listResult.items);
      }

      if (totalResult.ok) {
        setTotalCount(totalResult.count);
      }

      if (countResult.ok) {
        setUnreadCount(countResult.count);
      }
    } catch {
      setError(FETCHERROR__TEXTLABEL[LANGUAGE]);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [LANGUAGE, groupId, isStudentView, skip, take]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (!groupId || !pollMs) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void refetch();
    }, pollMs);

    return () => window.clearInterval(intervalId);
  }, [groupId, pollMs, refetch]);

  const notifications = useMemo(
    () => items.map((item) => formatBacklogNotification(groupId, item, isStudentView)),
    [groupId, isStudentView, items],
  );

  const applySyncEvent = useCallback((event) => {
    if (event.type === 'itemRead') {
      setItems((current) => {
        const target = current.find((item) => item.id === event.backlogId);
        if (!target || target.isRead) {
          return current;
        }

        setUnreadCount((count) => Math.max(0, count - 1));
        return current.map((item) => (
          item.id === event.backlogId ? { ...item, isRead: true } : item
        ));
      });
      return;
    }

    if (event.type === 'allRead') {
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    return subscribeBacklogNotificationSync(groupId, applySyncEvent);
  }, [applySyncEvent, groupId]);

  const markRead = useCallback(async (backlogId) => {
    if (!groupId) {
      return { ok: false };
    }

    const result = await markGroupBacklogItemRead(groupId, backlogId);
    if (result.ok) {
      notifyBacklogNotificationRead(groupId, backlogId);
    }
    return result;
  }, [groupId]);

  const markAllRead = useCallback(async () => {
    if (!groupId) {
      return { ok: false };
    }

    const result = await markAllGroupBacklogRead(groupId);
    if (result.ok) {
      notifyBacklogNotificationsAllRead(groupId);
    }
    return result;
  }, [groupId]);

  return {
    items,
    notifications,
    totalCount,
    unreadCount,
    isLoading,
    error,
    refetch,
    markRead,
    markAllRead,
  };
}
