import { IAssistantService } from './assistantInterface';

const MOCK_RESPONSES: Record<string, string> = {
  default: `Olá! Sou o **Assistente Athena**. Posso te ajudar com:

- **Notas e boletins** — consulte suas avaliações e médias
- **Horários e calendário** — veja aulas, provas e eventos
- **Frequência** — acompanhe sua presença nas disciplinas
- **Documentos** — solicite declarações e históricos
- **Dúvidas acadêmicas** — tire dúvidas sobre conteúdos

Como posso te ajudar hoje?`,
};

export class AssistantMockService implements IAssistantService {
  async sendMessage(
    _prompt: string,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    _onError: (error: string) => void,
  ): Promise<void> {
    const response = MOCK_RESPONSES.default;
    const chars = response.split('');

    for (let i = 0; i < chars.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 12));
      onChunk(chars[i]);
    }

    onDone();
  }
}
