import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthStepTransition from '../../../components/layout/AuthStepTransition.jsx';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import {
  AUTH_LOGIN_ACCEPT_EULA_PATH,
  AUTH_LOGIN_PROFILE_PATH,
  AUTH_LOGIN_REGISTRATION_STATUS_PATH,
} from '../../../constants/authPaths.constants.js';
import {
  LOGIN_FLOW_STEP_EULA,
  LOGIN_FLOW_STEP_INSTITUTION,
  LOGIN_FLOW_STEP_ORDER,
  LOGIN_FLOW_STEP_PIONIER,
  LOGIN_FLOW_STEP_REGISTER,
} from '../../../constants/loginFlow.constants.js';
import { useSessionOptional } from '../../../context/SessionContext.jsx';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import { logoutUser } from '../../../services/authService.js';
import { homePath } from '../../../routes/pathRegistry.js';
import AuthLogoutConfirmOverlay from '../../content/auth/AuthLogoutConfirmOverlay.jsx';
import {
  LoginInstitution,
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
  const [isEulaSubmitting, setIsEulaSubmitting] = useState(false);
  const [registrationCheckDone, setRegistrationCheckDone] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLogoutBusy, setIsLogoutBusy] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

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

      const browserId = getOrCreateBrowserId();
      try {
        const response = await fetch(`${baseUrl}${AUTH_LOGIN_REGISTRATION_STATUS_PATH}`, {
          credentials: 'include',
          headers: { 'X-Browser-ID': browserId },
        });
        if (!response.ok) {
          if (!cancelled) {
            setStep(LOGIN_FLOW_STEP_REGISTER);
            setRegistrationCheckDone(true);
          }
          return;
        }

        const status = await response.json();
        if (!cancelled) {
          const isComplete = status.registrationCompleted === true && status.eulaAccepted === true;
          setStep(isComplete ? LOGIN_FLOW_STEP_PIONIER : LOGIN_FLOW_STEP_REGISTER);
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
  }, [session?.isAuthenticated, session?.isLoading]);

  const handlePionierContinue = useCallback(() => {
    setStep(LOGIN_FLOW_STEP_INSTITUTION);
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

  const handleLogoutConfirm = useCallback(() => {
    setLogoutError(null);
    const didLogout = logoutUser(() => {
      setIsLogoutBusy(false);
      setLogoutError('Nie udało się wylogować.');
    });
    if (!didLogout) {
      setLogoutError('Nie udało się wylogować.');
      return;
    }
    setIsLogoutBusy(true);
  }, []);

  const handleProfileContinue = useCallback(({ nickname, avatarId }) => {
    setProfileData({ nickname, avatarId });
    setStep(LOGIN_FLOW_STEP_EULA);
    setEulaError(null);
  }, []);

  const handleEulaBack = useCallback(() => {
    setStep(LOGIN_FLOW_STEP_REGISTER);
    setEulaError(null);
  }, []);

  const handleEulaAccept = useCallback(async () => {
    setIsEulaSubmitting(true);
    setEulaError(null);
    const browserId = getOrCreateBrowserId();
    const baseUrl = getApiBaseUrl();
    try {
      const profileResponse = await fetch(`${baseUrl}${AUTH_LOGIN_PROFILE_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });
      if (!profileResponse.ok) {
        throw new Error('Nie udało się zapisać profilu.');
      }

      const eulaResponse = await fetch(`${baseUrl}${AUTH_LOGIN_ACCEPT_EULA_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        credentials: 'include',
      });
      if (!eulaResponse.ok) {
        throw new Error('Nie udało się utworzyć konta.');
      }

      await session?.refetchSession?.();
      // Wymuś świeży fetch profilu z backendu — `UserProfileContext` był
      // załadowany przed zapisem wizarda i trzyma stary nick / avatarId,
      // więc bez tego SuperBar pokazywałby zaseedowane wartości do czasu
      // ręcznego zapisu w /settings.
      await refetchProfile?.();
      navigate(homePath());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udało się utworzyć konta.';
      setEulaError(message);
    } finally {
      setIsEulaSubmitting(false);
    }
  }, [navigate, profileData, refetchProfile, session]);

  const stepContent = useMemo(() => {
    if (session?.isAuthenticated && !registrationCheckDone) {
      return null;
    }

    if (step === LOGIN_FLOW_STEP_INSTITUTION) {
      return <LoginInstitution onBack={handleInstitutionBack} />;
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
        />
      );
    }

    return <LoginPionierId onContinue={handlePionierContinue} />;
  }, [
    step,
    session?.isAuthenticated,
    registrationCheckDone,
    handlePionierContinue,
    handleInstitutionBack,
    handleRegisterBack,
    handleProfileContinue,
    handleEulaBack,
    handleEulaAccept,
    isEulaSubmitting,
    eulaError,
    profileData.nickname,
    profileData.avatarId,
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
