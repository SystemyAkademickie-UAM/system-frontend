/**
 * @file DevApiTestPage.jsx
 * @description Główny komponent widoku strony dla obszaru DevApiTestPage.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { Navigate } from 'react-router-dom';
import { homePath } from '../../routes/pathRegistry.js';
import { isNodeProduction } from '../../utils/nodeEnv.js';

import ApiTestWorkspace from './ApiTestWorkspace.jsx';

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function DevApiTestPage() {
  if (isNodeProduction()) {
    return <Navigate to={homePath()} replace />;
  }

// === RENDEROWANIE WIDOKU ===
  return <ApiTestWorkspace />;
}
