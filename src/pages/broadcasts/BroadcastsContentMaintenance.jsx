import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../auth/browserIdStorage.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../navigation/shellTemplates.config.js';
import { updateCachedMaintenanceStatus } from '../../services/maintenance.api.js';
import { maintenancePath } from '../../routes/pathRegistry.js';

export default function BroadcastsContentMaintenance() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAppRole();

  async function onFetchSystemStatus() {
    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const url = base + '/system/status';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
      });

      if (!response.ok) {
        return;
      }

      const receiveddata = await response.json().catch(() => null);
      if (!receiveddata?.maintenance) {
        return;
      }

      const isEnabled = receiveddata.maintenance.enabled === true;
      updateCachedMaintenanceStatus({
        enabled: isEnabled,
        message: receiveddata.maintenance.message || '',
        estimatedEndAt: receiveddata.maintenance.estimatedEndAt || null,
        updatedAt: receiveddata.maintenance.updatedAt || null,
      });

      if (isEnabled && role !== APP_ROLE.SUPERADMIN) {
        navigate(maintenancePath(), { replace: true });
      }
    } catch {
      // Ignore network errors in status probe
    }
  }

  useEffect(() => {
    void onFetchSystemStatus();
  }, [location.pathname, role]);

  return null;
}
