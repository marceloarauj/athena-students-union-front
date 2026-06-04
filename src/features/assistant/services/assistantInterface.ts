import { isMock } from '@/lib/serviceFactory';
import { AssistantMockService } from './assistantMockService';
import { AssistantService } from './assistantService';

export interface IAssistantService {
  sendMessage(
    prompt: string,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (error: string) => void,
  ): Promise<void>;
}

export function getAssistantService(institution: string): IAssistantService {
  return isMock(institution) ? new AssistantMockService() : new AssistantService();
}
