import { useState, useRef } from 'react';
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: newMessages[lastIndex].content + textChunk,
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
    <div className="flex flex-col h-150 w-full border rounded-lg bg-background">
      <ScrollArea className="flex-1 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {m.content ||
                (isLoading && i === messages.length - 1 ? '...' : '')}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>
      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your document..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
