import type { AlteracoesPermissionKey, FieldPermissionKey, SistemaPermissionKey } from '@/lib/permissions';

export type RoleField = {
  key: FieldPermissionKey;
  required: boolean;
};

export type RoleModel = {
  id: number;
  name: string;
  alias: string;
  defaultPermissions: {
    alteracoes: AlteracoesPermissionKey[];
    sistema: SistemaPermissionKey[];
  };
  fields: RoleField[];
};
