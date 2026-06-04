import { IAssistantService } from './assistantInterface';

const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL ?? 'http://localhost:5037';

export class AssistantService implements IAssistantService {
  async sendMessage(
    prompt: string,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await fetch(`${AI_API_URL}/api/chat/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        onError(`Erro ${response.status}: ${response.statusText}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onError('Stream indisponível');
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      const processLine = (line: string) => {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data && data !== '[DONE]') onChunk(data);
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) processLine(buffer);
          onDone();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        lines.forEach(processLine);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  }
}
