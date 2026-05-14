import ApiSmokeTest from './ApiSmokeTest.jsx';
import { AuthProvider } from './AuthContext.jsx';
import { getApiBaseUrl } from '../../../../constants/api.constants.js';
import { SAML_BYPASS_LECTURER_PATH, SAML_BYPASS_STUDENT_PATH } from './mockConstants.js';
import './MockApp.css';

/**
 * Integration tests: API smoke tools and dev SAML bypass entry points.
 * Wrapped with AuthProvider for standalone usage.
 */
export default function MockTestPage() {
  const base = getApiBaseUrl();
  const studentBypassUrl = `${base}${SAML_BYPASS_STUDENT_PATH}`;
  const lecturerBypassUrl = `${base}${SAML_BYPASS_LECTURER_PATH}`;

  return (
    <AuthProvider>
      <div className="mock-app mock-app--wide">
        <h2>Mock / Integration tests</h2>

        <section className="smoke__fieldset" aria-labelledby="bypass-heading">
          <h3 id="bypass-heading" className="smoke__subheading">
            Dev SAML bypass
          </h3>
          <p className="smoke__hint">
            Backend must have <code className="smoke__code">NODE_ENV</code> not <code className="smoke__code">production</code> and{' '}
            <code className="smoke__code">SAML_BYPASS_ENABLED=true</code>. GET links set <code className="smoke__code">maqSamlSession</code> and{' '}
            redirect to <code className="smoke__code">SAML_LOGIN_SUCCESS_REDIRECT_URL</code> — use the{' '}
            <strong>same host</strong> as this UI (e.g. <code className="smoke__code">http://127.0.0.1:3000/loginnikita</code> when the app is on{' '}
            <code className="smoke__code">127.0.0.1</code>). Prefer <strong>Establish dev session</strong> in the smoke test (POST, no redirect).
          </p>
          <p className="smoke__hint">
            Seeds <code className="smoke__code">auth.uzytkownicy</code> + <code className="smoke__code">auth.konta</code> (fake student / fake lecturer).
          </p>
          <div className="smoke__actions">
            <a className="smoke__button" href={studentBypassUrl}>
              Bypass as fake student
            </a>
            <a className="smoke__button smoke__button--secondary" href={lecturerBypassUrl}>
              Bypass as fake lecturer
            </a>
          </div>
        </section>

        <ApiSmokeTest />
      </div>
    </AuthProvider>
  );
}
