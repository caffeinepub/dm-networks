import { useInternetIdentity } from './useInternetIdentity';

export function useAuth() {
  const { identity, loginStatus } = useInternetIdentity();

  return {
    isAuthenticated: !!identity,
    principal: identity?.getPrincipal(),
    isInitializing: loginStatus === 'initializing',
    isLoggingIn: loginStatus === 'logging-in',
  };
}

