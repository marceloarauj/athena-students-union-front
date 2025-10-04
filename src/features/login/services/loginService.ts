import { LoginRequest } from '../models/loginRequest';
import { LoginResponse } from '../models/loginResponse';
import { ILoginService } from './loginInterface';

export class LoginService implements ILoginService {
  async login(login: LoginRequest): Promise<LoginResponse> {
    var response = await fetch('api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login),
    });

    if (!response.ok) throw new Error('Login failed');

    const data: LoginResponse = await response.json();
    return data;
  }
}
