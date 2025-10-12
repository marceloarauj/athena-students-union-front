import { IProfileService } from './profileInterface';
import { ProfileResponseModel } from '../models/profileResponseModel';
import profileData from '@/seeds/full_profile.json';

export class ProfileMockService implements IProfileService {
  async getProfile(): Promise<ProfileResponseModel> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return profileData as ProfileResponseModel;
  }
}
