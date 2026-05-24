import { Navigate } from 'react-router-dom';
import { homePath } from '../../../routes/pathRegistry.js';
import { isNodeProduction } from '../../../utils/nodeEnv.js';
import ApiTestWorkspace from '../../content/api-test/ApiTestWorkspace.jsx';

export default function DevApiTestPage() {
  if (isNodeProduction()) {
    return <Navigate to={homePath()} replace />;
  }

  return <ApiTestWorkspace />;
}
