import { LoginRequest } from '../models/loginRequest';
import { LoginResponse } from '../models/loginResponse';
import { ILoginService } from './loginInterface';

const ALL_MOCK_PERMISSIONS = [
  'SHOW_IA_ASSISTANT',
  'SCREEN_HOME_PUBLISH_MESSAGE',
  'SHOW_SCREEN_CALENDAR',
  'SHOW_SCREEN_SCORE',
  'SHOW_SCREEN_PARENTAL_CONTROL',
  'SHOW_SCREEN_PAYMENTS',
  'SHOW_SCREEN_NOTIFICATIONS',
  'SHOW_SCREEN_EVENTS',
  'CREATE_EVENT',
  'SHOW_SCREEN_DISCIPLINE',
  'CREATE_DISCIPLINE',
  'UPDATE_DISCIPLINE',
  'DELETE_DISCIPLINE',
  'UPDATE_DISCIPLINE_TOPICS',
  'SHOW_SCREEN_CLASS',
  'CREATE_CLASS',
  'UPDATE_CLASS',
  'DELETE_CLASS',
  'SHOW_SCREEN_INSTITUTIONAL',
  'SHOW_SCREEN_SUPPORT',
  'OPEN_SUPPORT_TICKET',
  'SHOW_SCREEN_USERS',
  'CREATE_USER',
  'UPDATE_USER',
  'DELETE_USER',
  'SHOW_SCREEN_SETTINGS',
];

function buildMockJwt(permissions: string[]): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: '00000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000001',
      permission: permissions,
      iss: 'mock',
      exp: Math.floor(Date.now() / 1000) + 86400,
    }),
  );
  return `${header}.${payload}.mock-signature`;
}

export class LoginMockService implements ILoginService {
  async login(_data: LoginRequest): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      user: {
        firstName: 'Mock',
        lastName: 'User',
        email: 'mock@example.com',
        role: 'user',
      },
      token: buildMockJwt(ALL_MOCK_PERMISSIONS),
    };
  }
}
