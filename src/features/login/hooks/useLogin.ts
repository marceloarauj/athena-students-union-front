import { useUserStore } from '@/entities/userStore';
import { loginService } from '../services/loginInterface';
import { LoginRequest } from '../models/loginRequest';

export function useLogin() {
  const setUser = useUserStore(state => state.setUser);

  async function login(login: LoginRequest) {
    const response = await loginService.login(login);

    setUser({
      FirstName: response.user.firstName,
      LastName: response.user.lastName,
      Email: response.user.email,
      Role: response.user.role,
    });
  }

  return { login };
}
