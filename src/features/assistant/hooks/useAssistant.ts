'use client';

import { useCallback, useRef, useState } from 'react';
import { ChatMessage } from '../models/assistantModel';
import { getAssistantService } from '../services/assistantInterface';

export function useAssistant(institution: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const streamingIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || loading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: prompt,
      };

      const assistantId = crypto.randomUUID();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        streaming: true,
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setLoading(true);
      streamingIdRef.current = assistantId;

      const service = getAssistantService(institution);

      await service.sendMessage(
        prompt,
        chunk => {
          setMessages(prev =>
            prev.map(m => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
          );
        },
        () => {
          setMessages(prev =>
            prev.map(m => (m.id === assistantId ? { ...m, streaming: false } : m)),
          );
          setLoading(false);
          streamingIdRef.current = null;
        },
        error => {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId ? { ...m, content: `Erro: ${error}`, streaming: false } : m,
            ),
          );
          setLoading(false);
          streamingIdRef.current = null;
        },
      );
    },
    [institution, loading],
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, loading, sendMessage, clearMessages };
}
