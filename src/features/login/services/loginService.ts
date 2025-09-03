import { Login } from '../models/loginModel';

export class LoginService {
  async login(data: Login) {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
