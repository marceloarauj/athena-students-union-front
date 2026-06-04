import { IParentalControlService } from './parentalControlInterface';
import { Child } from '../models/parentalControlModel';

export class ParentalControlService implements IParentalControlService {
  async getChildren(): Promise<Child[]> {
    const response = await fetch('/api/parental-control/children');
    return response.json();
  }
}
