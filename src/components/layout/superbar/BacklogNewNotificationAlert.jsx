import { useEffect, useState } from 'react';
import { useToast } from '../../ui/Toast/Toast.jsx';
import { useOptionalGroupId } from '../../../hooks/useOptionalGroupId.js';
import {
  ensureBacklogUnreadCountPolling,
  subscribeBacklogNotificationSync,
} from '../../../utils/notifications/backlogNotificationsSync.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const NEWNOTIFICATIONMESSAGE__TEXTLABEL = {
  polish: 'Masz nowe powiadomienie',
  english: 'You have a new notification',
};

/**
 * Wyświetla niebieski toast, gdy liczba nieprzeczytanych powiadomień wzrośnie.
 * Odpytywanie licznika jest współdzielone z dzwonkiem (ten sam sync bus).
 */
export default function BacklogNewNotificationAlert() {
  const groupId = useOptionalGroupId();
  const { showInfo } = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    return ensureBacklogUnreadCountPolling(groupId);
  }, [groupId]);

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    return subscribeBacklogNotificationSync(groupId, (event) => {
      if (event.type !== 'newArrived') {
        return;
      }

      showInfo(NEWNOTIFICATIONMESSAGE__TEXTLABEL[LANGUAGE]);
    });
  }, [LANGUAGE, groupId, showInfo]);

  return null;
}
