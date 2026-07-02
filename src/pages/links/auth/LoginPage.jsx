import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AuthStepTransition from '../../../components/layout/AuthStepTransition.jsx';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import {
  AUTH_LOGIN_ACCEPT_EULA_PATH,
  AUTH_LOGIN_PROFILE_PATH,
} from '../../../constants/authPaths.constants.js';
import {
  fetchRegistrationStatus,
  isRegistrationComplete,
  resolveRegistrationWizardStep,
} from '../../../services/registrationStatus.api.js';
import {
  LOGIN_FLOW_STEP_EULA,
  LOGIN_FLOW_STEP_EMAIL,
  LOGIN_FLOW_STEP_INSTITUTION,
  LOGIN_FLOW_STEP_ORDER,
  LOGIN_FLOW_STEP_PIONIER,
  LOGIN_FLOW_STEP_REGISTER,
} from '../../../constants/loginFlow.constants.js';
import { useSessionOptional } from '../../../context/SessionContext.jsx';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import {
  clearClientAuthState,
  endClientLogout,
} from '../../../auth/clientAuthState.js';
import { prefetchAvatarList } from '../../../services/avatarListCache.js';
import { isLogoutAvailable, logoutUser } from '../../../services/authService.js';
import { invalidateRegistrationStatusCache } from '../../../hooks/useRegistrationComplete.js';
import { homePath, loginPath } from '../../../routes/pathRegistry.js';
import AuthLogoutConfirmOverlay from '../../content/auth/AuthLogoutConfirmOverlay.jsx';
import {
  LoginInstitution,
  LoginEmail,
  LoginPionierId,
  RegisterEula,
  RegisterProfile,
  AuthWizardResolvingPanel,
} from '../../content/auth/index.js';

/** Blokuje drugi toast po remouncie (StrictMode) lub ponownym uruchomieniu efektu. */
let logoutSuccessToastHandled = false;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess } = useToast();
  const session = useSessionOptional();
  const { refetchProfile } = useUserProfile();
  const [step, setStep] = useState(LOGIN_FLOW_STEP_PIONIER);
  const [profileData, setProfileData] = useState({ nickname: '', avatarId: 1 });
  const [eulaError, setEulaError] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [isEulaSubmitting, setIsEulaSubmitting] = useState(false);
  const [registrationCheckDone, setRegistrationCheckDone] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLogoutBusy, setIsLogoutBusy] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const samlRecoveryAttemptedRef = useRef(false);
  const postLogoutLandingRef = useRef(false);
  const registrationResolvedRef = useRef(false);

  const postLoginPath = useMemo(() => {
    const fromPath = location.state?.from?.pathname;
    if (typeof fromPath === 'string' && fromPath.startsWith('/') && fromPath !== loginPath()) {
      return fromPath;
    }
    return homePath();
  }, [location.state]);

  useEffect(() => {
    if (searchParams.get('loggedOut') !== '1') {
      logoutSuccessToastHandled = false;
      return;
    }

    postLogoutLandingRef.current = true;
    clearClientAuthState();
    endClientLogout();
    setSearchParams({}, { replace: true });

    if (!logoutSuccessToastHandled) {
      logoutSuccessToastHandled = true;
      showSuccess('Wylogowano pomyślnie.');
    }

    void session?.refetchSession?.({ force: true });
  }, [searchParams, setSearchParams, showSuccess, session?.refetchSession]);

  useEffect(() => {
    if (session?.isLoading || session?.isAuthenticated) {
      return;
    }
    if (samlRecoveryAttemptedRef.current || postLogoutLandingRef.current) {
      return;
    }

    samlRecoveryAttemptedRef.current = true;
    void session?.refetchSession?.();
  }, [session?.isAuthenticated, session?.isLoading, session?.refetchSession]);

  useEffect(() => {
    if (session?.isLoading) {
      return;
    }

    if (postLogoutLandingRef.current) {
      setRegistrationCheckDone(true);
      if (!session?.isAuthenticated) {
        postLogoutLandingRef.current = false;
      }
      return;
    }

    if (!session?.isAuthenticated) {
      registrationResolvedRef.current = false;
      setRegistrationCheckDone(true);
      return;
    }

    if (registrationResolvedRef.current) {
      return;
    }

    let cancelled = false;
    prefetchAvatarList();

    async function resolveRegistrationStep() {
      const baseUrl = getApiBaseUrl();
      if (baseUrl.length === 0) {
        if (!cancelled) {
          setStep(LOGIN_FLOW_STEP_REGISTER);
          setRegistrationCheckDone(true);
          registrationResolvedRef.current = true;
        }
        return;
      }

      try {
        const status = await fetchRegistrationStatus();
        if (!cancelled) {
          if (isRegistrationComplete(status)) {
            navigate(postLoginPath, { replace: true });
            return;
          }
          setProfileData({
            nickname: typeof status?.nickname === 'string' ? status.nickname : '',
            avatarId: typeof status?.avatarId === 'number' ? status.avatarId : 1,
          });
          setStep(resolveRegistrationWizardStep(status));
          setRegistrationCheckDone(true);
          registrationResolvedRef.current = true;
        }
      } catch {
        if (!cancelled) {
          setStep(LOGIN_FLOW_STEP_REGISTER);
          setRegistrationCheckDone(true);
          registrationResolvedRef.current = true;
        }
      }
    }

    void resolveRegistrationStep();

    return () => {
      cancelled = true;
    };
  }, [session?.isAuthenticated, session?.isLoading, navigate, postLoginPath]);

  const handlePionierContinue = useCallback(() => {
    setStep(LOGIN_FLOW_STEP_INSTITUTION);
  }, []);

  const handleEmailLogin = useCallback(() => {
    setStep(LOGIN_FLOW_STEP_EMAIL);
  }, []);

  const handleEmailBack = useCallback(() => {
    setStep(LOGIN_FLOW_STEP_PIONIER);
  }, []);

  const handleInstitutionBack = useCallback(() => {
    setStep(LOGIN_FLOW_STEP_PIONIER);
  }, []);

  const handleRegisterBack = useCallback(() => {
    if (session?.isAuthenticated) {
      setLogoutError(null);
      setIsLogoutConfirmOpen(true);
      return;
    }
    setStep(LOGIN_FLOW_STEP_PIONIER);
  }, [session?.isAuthenticated]);

  const handleLogoutCancel = useCallback(() => {
    if (isLogoutBusy) {
      return;
    }
    setIsLogoutConfirmOpen(false);
    setLogoutError(null);
  }, [isLogoutBusy]);

  const resetLoginWizardAfterLogout = useCallback(() => {
    setProfileData({ nickname: '', avatarId: 1 });
    setEulaError(null);
    setProfileError(null);
    setStep(LOGIN_FLOW_STEP_PIONIER);
    setRegistrationCheckDone(true);
    registrationResolvedRef.current = false;
    setIsLogoutConfirmOpen(false);
  }, []);

  const handleLogoutFailed = useCallback(() => {
    setIsLogoutBusy(false);
    resetLoginWizardAfterLogout();
    void session?.refetchSession?.();
  }, [resetLoginWizardAfterLogout, session]);

  const handleLogoutConfirm = useCallback(() => {
    setLogoutError(null);
    if (!isLogoutAvailable()) {
      setLogoutError('Nie udało się wylogować.');
      return;
    }
    setIsLogoutBusy(true);
    void logoutUser(() => {
      handleLogoutFailed();
    }, { navigate });
  }, [handleLogoutFailed, navigate]);

  const handleProfileContinue = useCallback(async ({ nickname, avatarId }) => {
    setProfileError(null);
    const baseUrl = getApiBaseUrl();
    if (baseUrl.length === 0) {
      setProfileData({ nickname, avatarId });
      setStep(LOGIN_FLOW_STEP_EULA);
      return;
    }
    try {
      const profileResponse = await fetch(`${baseUrl}${AUTH_LOGIN_PROFILE_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nickname, avatarId }),
      });
      if (!profileResponse.ok) {
        throw new Error('Nie udało się zapisać profilu.');
      }
      setProfileData({ nickname, avatarId });
      setStep(LOGIN_FLOW_STEP_EULA);
      setEulaError(null);
      invalidateRegistrationStatusCache();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udało się zapisać profilu.';
      setProfileError(message);
    }
  }, []);

  const handleEulaBack = useCallback(() => {
    setStep(LOGIN_FLOW_STEP_REGISTER);
    setEulaError(null);
  }, []);

  const handleEulaAccept = useCallback(async () => {
    setIsEulaSubmitting(true);
    setEulaError(null);
    const baseUrl = getApiBaseUrl();
    try {
      const eulaResponse = await fetch(`${baseUrl}${AUTH_LOGIN_ACCEPT_EULA_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!eulaResponse.ok) {
        throw new Error('Nie udało się utworzyć konta.');
      }

      await session?.refetchSession?.({ force: true });
      await refetchProfile?.();
      invalidateRegistrationStatusCache();
      navigate(homePath());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udało się utworzyć konta.';
      setEulaError(message);
    } finally {
      setIsEulaSubmitting(false);
    }
  }, [navigate, refetchProfile, session]);

  const stepContent = useMemo(() => {
    if (session?.isLoading) {
      return <AuthWizardResolvingPanel />;
    }

    if (session?.isAuthenticated && !registrationCheckDone) {
      return (
        <RegisterProfile
          isBootstrapping
          onContinue={handleProfileContinue}
          onBack={handleRegisterBack}
          initialNickname={profileData.nickname}
          initialAvatarId={profileData.avatarId}
          errorMessage={profileError}
        />
      );
    }

    if (step === LOGIN_FLOW_STEP_INSTITUTION) {
      return <LoginInstitution onBack={handleInstitutionBack} />;
    }

    if (step === LOGIN_FLOW_STEP_EMAIL) {
      return <LoginEmail onBack={handleEmailBack} />;
    }

    if (step === LOGIN_FLOW_STEP_EULA) {
      return (
        <RegisterEula
          onAccept={handleEulaAccept}
          onBack={handleEulaBack}
          isSubmitting={isEulaSubmitting}
          errorMessage={eulaError}
        />
      );
    }

    if (step === LOGIN_FLOW_STEP_REGISTER) {
      return (
        <RegisterProfile
          onContinue={handleProfileContinue}
          onBack={handleRegisterBack}
          initialNickname={profileData.nickname}
          initialAvatarId={profileData.avatarId}
          errorMessage={profileError}
        />
      );
    }

    return <LoginPionierId onContinue={handlePionierContinue} onEmailLogin={handleEmailLogin} />;
  }, [
    step,
    session?.isAuthenticated,
    registrationCheckDone,
    handlePionierContinue,
    handleEmailLogin,
    handleEmailBack,
    handleInstitutionBack,
    handleRegisterBack,
    handleProfileContinue,
    handleEulaBack,
    handleEulaAccept,
    isEulaSubmitting,
    eulaError,
    profileData.nickname,
    profileData.avatarId,
    profileError,
  ]);

  const transitionKey = session?.isAuthenticated && !registrationCheckDone
    ? LOGIN_FLOW_STEP_REGISTER
    : step;

  return (
    <>
      <AuthStepTransition activeKey={transitionKey} stepOrder={LOGIN_FLOW_STEP_ORDER}>
        {stepContent}
      </AuthStepTransition>

      <AuthLogoutConfirmOverlay
        isOpen={isLogoutConfirmOpen}
        isBusy={isLogoutBusy}
        errorMessage={logoutError}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
}
