import { LoginRequest } from '../models/loginRequest';
import { LoginResponse } from '../models/loginResponse';
import { LoginMockService } from './loginMockService';
import { LoginService } from './loginService';
import { isMock } from '@/lib/serviceFactory';

export interface ILoginService {
  login(data: LoginRequest): Promise<LoginResponse>;
}

export function getLoginService(institution: string): ILoginService {
  return isMock(institution) ? new LoginMockService() : new LoginService();
}
