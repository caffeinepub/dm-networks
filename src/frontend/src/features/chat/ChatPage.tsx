import { useState, useEffect, useRef } from 'react';
import AuthGate from '../../components/auth/AuthGate';
import { useChatMessages, useCreateChatMessage, useIsCallerAdmin, useDeleteChatMessage } from '../../hooks/useQueries';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Send, RefreshCw, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useAuthorInfo } from './useAuthorDisplayNames';
import type { ChatMessage } from '../../backend';
import VerifiedBadge from '../../components/user/VerifiedBadge';

function ChatMessageItem({ message, isAdmin }: { message: ChatMessage; isAdmin: boolean }) {
  const { displayName, isVerified } = useAuthorInfo(message.author);
  const { principal } = useAuth();
  const isOwnMessage = principal?.toString() === message.author.toString();
  const deleteMessage = useDeleteChatMessage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const timestamp = new Date(Number(message.timestamp) / 1000000);
  const timeString = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleDelete = async () => {
    try {
      await deleteMessage.mutateAsync(message.id);
      toast.success('Message deleted successfully');
      setShowDeleteDialog(false);
    } catch (error: any) {
      console.error('Failed to delete message:', error);
      toast.error(error.message || 'Failed to delete message. Please try again.');
    }
  };

  return (
    <>
      <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className={`flex-1 space-y-1 ${isOwnMessage ? 'items-end' : ''}`}>
          <div className={`flex items-center gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium">{displayName}</span>
            {isVerified && <VerifiedBadge />}
            <span className="text-xs text-muted-foreground">{timeString}</span>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div
            className={`rounded-lg px-4 py-2 inline-block max-w-[85%] ${
              isOwnMessage
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ChatContent() {
  const { data: messages, isLoading, refetch } = useChatMessages();
  const { data: isAdmin } = useIsCallerAdmin();
  const createMessage = useCreateChatMessage();
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const previousMessageCount = useRef(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > previousMessageCount.current && shouldAutoScroll) {
      const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
    previousMessageCount.current = messages?.length || 0;
  }, [messages, shouldAutoScroll]);

  // Detect if user has scrolled up
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldAutoScroll(isAtBottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await createMessage.mutateAsync(newMessage.trim());
      setNewMessage('');
      setShouldAutoScroll(true);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Messages refreshed');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Live Chat</h1>
          <p className="text-muted-foreground">Connect with other members in real-time</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea ref={scrollAreaRef} className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages && messages.length > 0 ? (
                messages.map((message) => (
                  <ChatMessageItem
                    key={message.id.toString()}
                    message={message}
                    isAdmin={isAdmin || false}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No messages yet. Be the first to say hello!</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          <div className="space-y-3">
            <Textarea
              placeholder="Type your message... (Shift+Enter for new line)"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || createMessage.isPending}
              >
                {createMessage.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ChatPage() {
  return (
    <AuthGate>
      <Toaster />
      <ChatContent />
    </AuthGate>
  );
}
