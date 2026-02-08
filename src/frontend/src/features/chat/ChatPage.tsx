import { useState, useEffect, useRef } from 'react';
import AuthGate from '../../components/auth/AuthGate';
import { useChatMessages, useCreateChatMessage } from '../../hooks/useQueries';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Send, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useAuthorDisplayName } from './useAuthorDisplayNames';
import type { ChatMessage } from '../../backend';

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const displayName = useAuthorDisplayName(message.author);
  const { principal } = useAuth();
  const isOwnMessage = principal?.toString() === message.author.toString();

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

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className={isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className={`flex-1 space-y-1 ${isOwnMessage ? 'text-right' : ''}`}>
        <div className="flex items-baseline gap-2">
          <span className={`text-sm font-medium ${isOwnMessage ? 'order-2' : ''}`}>
            {displayName}
          </span>
          <span className={`text-xs text-muted-foreground ${isOwnMessage ? 'order-1' : ''}`}>
            {timeString}
          </span>
        </div>
        <div
          className={`inline-block rounded-2xl px-4 py-2 max-w-[85%] break-words ${
            isOwnMessage
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { isAuthenticated } = useAuth();
  const { data: messages = [], isLoading, refetch, isFetching } = useChatMessages();
  const createMessage = useCreateChatMessage();
  const [messageContent, setMessageContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, shouldAutoScroll]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50;
    setShouldAutoScroll(isAtBottom);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim()) {
      return;
    }

    try {
      await createMessage.mutateAsync(messageContent.trim());
      setMessageContent('');
      setShouldAutoScroll(true);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Messages refreshed');
  };

  // Sort messages by timestamp (oldest first)
  const sortedMessages = [...messages].sort((a, b) => 
    Number(a.timestamp) - Number(b.timestamp)
  );

  return (
    <>
      <Toaster />
      <Card className="max-w-4xl mx-auto h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">Live Chat</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isFetching}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4" onScrollCapture={handleScroll}>
            <div ref={scrollRef} className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground">Loading messages...</p>
                  </div>
                </div>
              ) : sortedMessages.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground">
                      {isAuthenticated
                        ? 'Be the first to start the conversation!'
                        : 'Sign in to start chatting'}
                    </p>
                  </div>
                </div>
              ) : (
                sortedMessages.map((message, index) => (
                  <ChatMessageItem key={index} message={message} />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border p-4">
            <AuthGate>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message..."
                  rows={1}
                  className="resize-none min-h-[44px] max-h-32"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!messageContent.trim() || createMessage.isPending}
                  className="shrink-0 h-11 w-11"
                >
                  {createMessage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </AuthGate>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

