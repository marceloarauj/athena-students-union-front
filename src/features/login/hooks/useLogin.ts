import { useUserStore } from '@/entities/userStore';
import { useInstitutionStore } from '@/entities/institution';
import { getLoginService } from '../services/loginInterface';
import { LoginRequest } from '../models/loginRequest';
import { decodeJwtPermissions } from '@/lib/jwt';

export function useLogin() {
  const setUser = useUserStore(state => state.setUser);
  const { institution } = useInstitutionStore();

  async function login(data: LoginRequest) {
    const service = getLoginService(institution?.alias ?? '');
    const response = await service.login(data);
    const permissions = decodeJwtPermissions(response.token);

    setUser({
      FirstName: response.user.firstName,
      LastName: response.user.lastName,
      Email: response.user.email,
      Role: response.user.role,
      Token: response.token,
      Permissions: permissions,
    });
  }

  return { login };
}

export function useLoggout() {
  const clearUser = useUserStore(state => state.clearUser);

  function logout() {
    clearUser();
  }

  return { logout };
}
