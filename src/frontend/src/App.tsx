import { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import LoginButton from './components/auth/LoginButton';
import ProfilePage from './features/profile/ProfilePage';
import ChatPage from './features/chat/ChatPage';
import AboutPage from './features/about/AboutPage';
import MembersPage from './features/members/MembersPage';
import { MessageSquare, User, Info, ExternalLink, Users } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';

type View = 'chat' | 'profile' | 'about' | 'members';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('about');
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DM Networks
            </h1>
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setCurrentView('about')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'about'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <Info className="h-4 w-4" />
                About
              </button>
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => setCurrentView('chat')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === 'chat'
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => setCurrentView('members')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === 'members'
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Members
                  </button>
                  <button
                    onClick={() => setCurrentView('profile')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === 'profile'
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                </>
              )}
            </nav>
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-center gap-2 p-2 border-b border-border bg-card">
        <button
          onClick={() => setCurrentView('about')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'about'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }`}
        >
          <Info className="h-4 w-4" />
          About
        </button>
        {isAuthenticated && (
          <>
            <button
              onClick={() => setCurrentView('chat')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'chat'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </button>
            <button
              onClick={() => setCurrentView('members')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'members'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <Users className="h-4 w-4" />
              Members
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'profile'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <User className="h-4 w-4" />
              Profile
            </button>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 container px-4 md:px-6 py-6">
        {currentView === 'about' ? (
          <AboutPage />
        ) : currentView === 'chat' ? (
          <ChatPage />
        ) : currentView === 'members' ? (
          <MembersPage />
        ) : (
          <ProfilePage />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 mt-auto">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              © 2026. Built with{' '}
              <span className="text-primary">❤</span> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
              >
                <SiCaffeine className="h-3.5 w-3.5" />
                caffeine.ai
              </a>
            </p>
            <span className="hidden sm:inline text-muted-foreground/50">•</span>
            <p className="flex items-center gap-1.5">
              Managed by{' '}
              <a
                href="https://www.dmc-technologies.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
              >
                DMC Technologies
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
