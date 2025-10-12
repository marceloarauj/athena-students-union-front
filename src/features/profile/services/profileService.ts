import { IProfileService } from './profileInterface';
import { ProfileResponseModel } from '../models/profileResponseModel';

export class ProfileService implements IProfileService {
  async getProfile(): Promise<ProfileResponseModel> {
    var response = await fetch('/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
}
