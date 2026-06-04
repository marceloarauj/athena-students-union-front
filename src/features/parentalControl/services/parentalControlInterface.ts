import { Child } from '../models/parentalControlModel';
import { ParentalControlMockService } from './parentalControlMockService';
import { ParentalControlService } from './parentalControlService';
import { isMock } from '@/lib/serviceFactory';

export interface IParentalControlService {
  getChildren(): Promise<Child[]>;
}

export function getParentalControlService(institution: string): IParentalControlService {
  return isMock(institution) ? new ParentalControlMockService() : new ParentalControlService();
}
