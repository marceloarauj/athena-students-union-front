import { LoginRequest } from '../models/loginRequest';
import { LoginResponse } from '../models/loginResponse';
import { ILoginService } from './loginInterface';

export class LoginMockService implements ILoginService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      user: {
        firstName: 'Mock',
        lastName: 'User',
        email: 'mock@example.com',
        role: 'user',
      },
      token: 'mock-token',
    };
  }
}
