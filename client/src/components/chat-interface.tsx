import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { useUser } from '@/lib/context/user-context';
import { BASE_URL } from '@/api/client';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; content: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const email = user?.email;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage },
      { role: 'ai', content: '' },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/chats/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage, email }),
      });

      if (!response.ok) throw new Error('Failed to connect to server');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        accumulatedText += textChunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: accumulatedText,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Streaming Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full border rounded-lg bg-background overflow-y-auto">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.role}`} // More robust key than just index
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[85%] wrap-break-words whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {/* Fallback for the thinking state */}
                {m.content === '' && m.role === 'ai' ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          {/* Invisible anchor for scrolling */}
          <div ref={scrollRef} className="h-2 w-full" />
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex gap-2 bg-background">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your document..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
