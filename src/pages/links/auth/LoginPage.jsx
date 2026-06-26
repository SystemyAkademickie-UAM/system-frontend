import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthStepTransition from '../../../components/layout/AuthStepTransition.jsx';
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
import { isLogoutAvailable, logoutUser } from '../../../services/authService.js';
import { homePath } from '../../../routes/pathRegistry.js';
import AuthLogoutConfirmOverlay from '../../content/auth/AuthLogoutConfirmOverlay.jsx';
import {
  LoginInstitution,
  LoginEmail,
  LoginPionierId,
  RegisterEula,
  RegisterProfile,
} from '../../content/auth/index.js';

export default function LoginPage() {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (session?.isLoading || session?.isAuthenticated) {
      return;
    }
    if (samlRecoveryAttemptedRef.current) {
      return;
    }

    samlRecoveryAttemptedRef.current = true;
    void session?.refetchSession?.();
  }, [session?.isAuthenticated, session?.isLoading, session?.refetchSession]);

  useEffect(() => {
    if (session?.isLoading) {
      return;
    }

    if (!session?.isAuthenticated) {
      setRegistrationCheckDone(true);
      return;
    }

    let cancelled = false;

    async function resolveRegistrationStep() {
      const baseUrl = getApiBaseUrl();
      if (baseUrl.length === 0) {
        if (!cancelled) {
          setStep(LOGIN_FLOW_STEP_REGISTER);
          setRegistrationCheckDone(true);
        }
        return;
      }

      try {
        const status = await fetchRegistrationStatus();
        if (!cancelled) {
          if (isRegistrationComplete(status)) {
            navigate(homePath(), { replace: true });
            return;
          }
          setProfileData({
            nickname: typeof status?.nickname === 'string' ? status.nickname : '',
            avatarId: typeof status?.avatarId === 'number' ? status.avatarId : 1,
          });
          setStep(resolveRegistrationWizardStep(status));
          setRegistrationCheckDone(true);
        }
      } catch {
        if (!cancelled) {
          setStep(LOGIN_FLOW_STEP_REGISTER);
          setRegistrationCheckDone(true);
        }
      }
    }

    setRegistrationCheckDone(false);
    resolveRegistrationStep();

    return () => {
      cancelled = true;
    };
  }, [session?.isAuthenticated, session?.isLoading, navigate]);

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
    setIsLogoutConfirmOpen(false);
  }, []);

  const handleLogoutFailed = useCallback(async () => {
    setIsLogoutBusy(false);
    await session?.refetchSession?.();
    resetLoginWizardAfterLogout();
  }, [resetLoginWizardAfterLogout, session]);

  const handleLogoutConfirm = useCallback(() => {
    setLogoutError(null);
    if (!isLogoutAvailable()) {
      setLogoutError('Nie udało się wylogować.');
      return;
    }
    setIsLogoutBusy(true);
    void logoutUser(() => {
      void handleLogoutFailed();
    });
  }, [handleLogoutFailed]);

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
      navigate(homePath());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udało się utworzyć konta.';
      setEulaError(message);
    } finally {
      setIsEulaSubmitting(false);
    }
  }, [navigate, refetchProfile, session]);

  const stepContent = useMemo(() => {
    if (session?.isAuthenticated && !registrationCheckDone) {
      return null;
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

  return (
    <>
      <AuthStepTransition activeKey={step} stepOrder={LOGIN_FLOW_STEP_ORDER}>
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
