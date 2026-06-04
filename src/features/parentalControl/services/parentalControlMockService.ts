import { IParentalControlService } from './parentalControlInterface';
import { Child } from '../models/parentalControlModel';
import data from '@/seeds/parental_control_data.json';

export class ParentalControlMockService implements IParentalControlService {
  async getChildren(): Promise<Child[]> {
    return data as Child[];
  }
}
