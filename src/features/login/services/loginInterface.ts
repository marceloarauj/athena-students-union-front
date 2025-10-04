import { LoginRequest } from '../models/loginRequest';
import { LoginResponse } from '../models/loginResponse';
import { LoginMockService } from './loginMockService';
import { LoginService } from './loginService';

export interface ILoginService {
  login(data: LoginRequest): Promise<LoginResponse>;
}

export const loginService: ILoginService = new LoginMockService();
