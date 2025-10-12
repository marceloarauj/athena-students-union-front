import { ProfileResponseModel } from '../models/profileResponseModel';
import { ProfileMockService } from './profileMockService';

export interface IProfileService {
  getProfile(): Promise<ProfileResponseModel>;
}

export const profileService: IProfileService = new ProfileMockService();
