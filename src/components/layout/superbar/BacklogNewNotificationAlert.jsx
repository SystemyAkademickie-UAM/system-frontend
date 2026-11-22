/**
 * @file BacklogNewNotificationAlert.jsx
 * @description Komponent interfejsu użytkownika BacklogNewNotificationAlert.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useEffect, useState } from 'react';
import { useToast } from '../../ui/Toast/Toast.jsx';
import { useOptionalGroupId } from '../../../hooks/useOptionalGroupId.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';

import {

  ensureBacklogUnreadCountPolling,

  subscribeBacklogNotificationSync,

} from '../../../utils/notifications/backlogNotificationsSync.js';

import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const notificationSound = new Audio('/assets/sounds/bell_02.ogg');

const NEWNOTIFICATIONMESSAGE__TEXTLABEL = {

  polish: 'Masz nowe powiadomienie',

  english: 'You have a new notification',

};

/**

 * Wyświetla niebieski toast, gdy liczba nieprzeczytanych powiadomień wzrośnie.

 * Odpytywanie licznika jest współdzielone z dzwonkiem (ten sam sync bus).

 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function BacklogNewNotificationAlert() {
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const { showInfo } = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const isAdminOrSuper = role === APP_ROLE.ADMIN || role === APP_ROLE.SUPERADMIN;

  useEffect(() => {
    if (!groupId || isAdminOrSuper) {
      return undefined;
    }
    return ensureBacklogUnreadCountPolling(groupId);
  }, [groupId, isAdminOrSuper]);

  useEffect(() => {
    if (!groupId || isAdminOrSuper) {
      return undefined;
    }

    return subscribeBacklogNotificationSync(groupId, (event) => {

      if (event.type !== 'newArrived') {

        return;

      }

      notificationSound.play();

      showInfo(NEWNOTIFICATIONMESSAGE__TEXTLABEL[LANGUAGE]);

    });

  }, [LANGUAGE, groupId, showInfo]);

// === RENDEROWANIE WIDOKU ===
  return null;

}
