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
  LOGIN_FLOW_STEP_AVATAR,
  LOGIN_FLOW_STEP_EMAIL,
  LOGIN_FLOW_STEP_INSTITUTION,
  LOGIN_FLOW_STEP_ORDER,
  LOGIN_FLOW_STEP_PIONIER,
  LOGIN_FLOW_STEP_REGISTER,
  LOGIN_FLOW_STEP_SETTINGS,
} from '../../../constants/loginFlow.constants.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { useSessionOptional } from '../../../context/SessionContext.jsx';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import {
  clearClientAuthState,
  endClientLogout,
} from '../../../auth/clientAuthState.js';
import { prefetchAvatarList } from '../../../services/avatarListCache.js';
import { isLogoutAvailable, logoutUser } from '../../../services/authService.js';
import { updateProfile } from '../../../services/profile.api.js';
import { setLeaderShowNickname } from '../../../hooks/useLeaderDisplayPreferences.js';
import { applyTheme } from '../../../services/themeService.js';
import { invalidateRegistrationStatusCache } from '../../../hooks/useRegistrationComplete.js';
import { homePath, loginPath } from '../../../routes/pathRegistry.js';
import AuthLogoutConfirmOverlay from '../../content/auth/AuthLogoutConfirmOverlay.jsx';
import {
  LoginInstitution,
  LoginEmail,
  LoginPionierId,
  RegisterProfile,
  RegisterAvatar,
  RegisterEula,
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
  const [profileData, setProfileData] = useState({ nickname: '', avatarId: 1, showNickname: true });
  const [settingsError, setSettingsError] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          setProfileData((prev) => ({
            ...prev,
            nickname: typeof status?.nickname === 'string' ? status.nickname : '',
            avatarId: typeof status?.avatarId === 'number' ? status.avatarId : 1,
          }));
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
    setProfileData({ nickname: '', avatarId: 1, showNickname: true });
    setSettingsError(null);
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

  // Ekran 1 -> Ekran 2
  const handleNicknameContinue = useCallback(({ nickname, showNickname }) => {
    setProfileError(null);
    setProfileData((prev) => ({
      ...prev,
      nickname,
      showNickname: showNickname !== false,
    }));
    setStep(LOGIN_FLOW_STEP_AVATAR);
  }, []);

  // Ekran 2 -> Ekran 1
  const handleAvatarBack = useCallback(() => {
    setStep(LOGIN_FLOW_STEP_REGISTER);
  }, []);

  // Ekran 2 -> Ekran 3
  const handleAvatarContinue = useCallback(({ avatarId }) => {
    setProfileData((prev) => ({
      ...prev,
      avatarId,
    }));
    setStep(LOGIN_FLOW_STEP_SETTINGS);
  }, []);

  // Ekran 3 -> Ekran 2
  const handleSettingsBack = useCallback(() => {
    setStep(LOGIN_FLOW_STEP_AVATAR);
    setSettingsError(null);
  }, []);

  // Ekran 3: Zakończenie rejestracji
  const handleSettingsAccept = useCallback(async ({ theme }) => {
    setIsSubmitting(true);
    setSettingsError(null);
    const baseUrl = getApiBaseUrl();

    try {
      // 1. Zapis profilu w kreatorze (POST /login/profile)
      if (baseUrl.length > 0) {
        const profileResponse = await fetch(`${baseUrl}${AUTH_LOGIN_PROFILE_PATH}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            nickname: profileData.nickname,
            avatarId: profileData.avatarId,
          }),
        });
        if (!profileResponse.ok) {
          throw new Error('Nie udało się zapisać profilu.');
        }

        // Zapis widoczności ksywki w preferencjach i backendzie
        if (profileData.showNickname !== undefined) {
          setLeaderShowNickname(profileData.showNickname);
          await updateProfile({ showNickname: profileData.showNickname }).catch(() => {
            // Ignoruj opcjonalny błąd PATCH w fazie rejestracji
          });
        }

        // 2. Akceptacja EULA (POST /login/accept-eula)
        const eulaResponse = await fetch(`${baseUrl}${AUTH_LOGIN_ACCEPT_EULA_PATH}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!eulaResponse.ok) {
          throw new Error('Nie udało się utworzyć konta.');
        }
      } else {
        if (profileData.showNickname !== undefined) {
          setLeaderShowNickname(profileData.showNickname);
        }
      }

      // 3. Zapis motywu
      if (theme) {
        applyTheme(theme);
      }

      await session?.refetchSession?.({ force: true });
      await refetchProfile?.();
      invalidateRegistrationStatusCache();
      navigate(postLoginPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udało się utworzyć konta.';
      setSettingsError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, postLoginPath, profileData, refetchProfile, session]);

  const stepContent = useMemo(() => {
    if (session?.isLoading) {
      return <AuthWizardResolvingPanel />;
    }

    if (session?.isAuthenticated && !registrationCheckDone) {
      return (
        <RegisterProfile
          isBootstrapping
          onContinue={handleNicknameContinue}
          onBack={handleRegisterBack}
          initialNickname={profileData.nickname}
          initialShowNickname={profileData.showNickname}
          showNicknameToggle={session?.role === APP_ROLE.LECTURER}
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

    // Ekran 3: Ustawienia konta (Wybór motywu + Dokumentacja + Polityka prywatności)
    if (step === LOGIN_FLOW_STEP_SETTINGS) {
      return (
        <RegisterEula
          onAccept={handleSettingsAccept}
          onBack={handleSettingsBack}
          isSubmitting={isSubmitting}
          errorMessage={settingsError}
        />
      );
    }

    // Ekran 2: Awatar
    if (step === LOGIN_FLOW_STEP_AVATAR) {
      return (
        <RegisterAvatar
          onContinue={handleAvatarContinue}
          onBack={handleAvatarBack}
          initialAvatarId={profileData.avatarId}
        />
      );
    }

    // Ekran 1: Pierwsze logowanie (Ksywka + widoczność)
    if (step === LOGIN_FLOW_STEP_REGISTER) {
      return (
        <RegisterProfile
          onContinue={handleNicknameContinue}
          onBack={handleRegisterBack}
          initialNickname={profileData.nickname}
          initialShowNickname={profileData.showNickname}
          showNicknameToggle={session?.role === APP_ROLE.LECTURER}
          errorMessage={profileError}
        />
      );
    }

    return <LoginPionierId onContinue={handlePionierContinue} onEmailLogin={handleEmailLogin} />;
  }, [
    step,
    session?.isAuthenticated,
    session?.role,
    registrationCheckDone,
    handlePionierContinue,
    handleEmailLogin,
    handleEmailBack,
    handleInstitutionBack,
    handleRegisterBack,
    handleNicknameContinue,
    handleAvatarContinue,
    handleAvatarBack,
    handleSettingsBack,
    handleSettingsAccept,
    isSubmitting,
    settingsError,
    profileData.nickname,
    profileData.showNickname,
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
