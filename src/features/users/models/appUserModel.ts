import type { AlteracoesPermissionKey, SistemaPermissionKey } from '@/lib/permissions';

export type UserPermissions = {
  alteracoes: AlteracoesPermissionKey[];
  sistema: SistemaPermissionKey[];
};

export type AppUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  childrenIds?: number[];
  permissions: UserPermissions;
  phone?: string;
  period?: string;
  register?: string;
  birthdate?: string;
  shift?: string;
  responsibleName?: string;
};
