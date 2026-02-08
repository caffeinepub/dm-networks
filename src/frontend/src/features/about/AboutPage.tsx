import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, User, Shield, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Welcome to DM Networks
        </h1>
        <p className="text-lg text-muted-foreground">
          A secure, decentralized chat platform built on the Internet Computer
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            What is DM Networks?
          </CardTitle>
          <CardDescription>
            A real-time chat application where authenticated users can communicate securely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            DM Networks is a decentralized messaging platform that leverages blockchain technology
            to provide secure, transparent communication. All messages are stored on-chain and
            visible to authenticated users, creating a public yet secure chat environment.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            How to Get Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                1
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-semibold text-sm mb-1">Sign In with Internet Identity</h3>
                <p className="text-sm text-muted-foreground">
                  Click the "Login" button in the header to authenticate using Internet Identity,
                  a secure, privacy-preserving authentication system. No passwords or personal
                  information required.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                2
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-semibold text-sm mb-1">Set Up Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  After signing in, you'll be prompted to create your profile. Choose a display
                  name that will be shown alongside your messages. You can also add a bio and
                  social links to personalize your profile.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                3
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-semibold text-sm mb-1">Start Chatting</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate to the Chat section to view all messages and participate in
                  conversations. All authenticated users can see and post messages in the live
                  chat feed.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong className="text-foreground">User Profiles:</strong> Create and customize
                your profile with a display name, bio, and social links
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong className="text-foreground">Live Chat:</strong> Real-time messaging with
                automatic updates and message history
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong className="text-foreground">Secure Authentication:</strong> Internet
                Identity provides cryptographic authentication without passwords
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                <strong className="text-foreground">Decentralized Storage:</strong> All data is
                stored on the Internet Computer blockchain
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-foreground mb-1">
                Managed by DMC Technologies
              </p>
              <p className="text-xs text-muted-foreground">
                Professional web development and digital solutions
              </p>
            </div>
            <a
              href="https://www.dmc-technologies.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Visit DMC Technologies
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
