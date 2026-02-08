import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import LoginButton from './LoginButton';
import { Lock } from 'lucide-react';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (loginStatus === 'initializing') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-border bg-card">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Sign In Required</h2>
            <p className="text-muted-foreground">
              Please sign in to access this feature and start chatting with others.
            </p>
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

