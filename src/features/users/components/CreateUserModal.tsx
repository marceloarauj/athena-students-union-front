'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { AppUser } from '../models/appUserModel';
import type { RoleModel } from '@/features/roles/models/roleModel';
import { FIELD_PERMISSIONS } from '@/lib/permissions';

type Props = {
  roles: RoleModel[];
  onSave: (user: Omit<AppUser, 'id'>) => Promise<void>;
  onClose: () => void;
};

const FIELD_TO_USER_KEY: Record<string, keyof Omit<AppUser, 'id' | 'name' | 'role' | 'avatar' | 'childrenIds' | 'permissions'>> = {
  FIELD_EMAIL: 'email',
  FIELD_PHONE: 'phone',
  FIELD_PERIOD: 'period',
  FIELD_REGISTER: 'register',
  FIELD_BIRTHDATE: 'birthdate',
  FIELD_SHIFT: 'shift',
  RESPONSIBLE_NAME: 'responsibleName',
};

export function CreateUserModal({ roles, onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const [selectedAlias, setSelectedAlias] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const selectedRole = roles.find(r => r.alias === selectedAlias);

  function handleRoleChange(alias: string) {
    setSelectedAlias(alias);
    setFieldValues({});
  }

  function setFieldValue(key: string, value: string) {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  }

  function isValid() {
    if (!name.trim() || !selectedRole) return false;
    return selectedRole.fields
      .filter(f => f.required)
      .every(f => fieldValues[f.key]?.trim());
  }

  async function handleSave() {
    if (!isValid() || !selectedRole) return;
    setSaving(true);

    const dynamicFields: Partial<AppUser> = {};
    for (const rf of selectedRole.fields) {
      const appKey = FIELD_TO_USER_KEY[rf.key];
      if (appKey && fieldValues[rf.key] !== undefined) {
        (dynamicFields as Record<string, string>)[appKey] = fieldValues[rf.key];
      }
    }

    await onSave({
      name: name.trim(),
      email: (dynamicFields.email as string | undefined) ?? '',
      role: selectedRole.alias,
      avatar: '',
      permissions: {
        alteracoes: selectedRole.defaultPermissions.alteracoes,
        sistema: selectedRole.defaultPermissions.sistema,
      },
      ...dynamicFields,
    });

    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <UserPlus size={16} className='text-primary' />
            Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário. Os campos variam conforme o tipo selecionado.
          </DialogDescription>
        </DialogHeader>

        <div className='overflow-y-auto max-h-[60vh] space-y-4 pr-1'>
          <div>
            <label className='text-sm font-medium block mb-1'>
              Nome Completo <span className='text-danger'>*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Nome completo'
              className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
            />
          </div>

          <div>
            <label className='text-sm font-medium block mb-1'>
              Tipo de Usuário <span className='text-danger'>*</span>
            </label>
            <Select value={selectedAlias} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder='Selecione o tipo...' />
              </SelectTrigger>
              <SelectContent>
                {roles.map(r => (
                  <SelectItem key={r.alias} value={r.alias}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRole && selectedRole.fields.length > 0 && (
            <div className='rounded-xl border border-border p-4 space-y-3'>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                Dados do usuário
              </p>
              <div className='grid grid-cols-2 gap-3'>
                {selectedRole.fields.map(rf => {
                  const fpDef = FIELD_PERMISSIONS.find(f => f.key === rf.key);
                  if (!fpDef) return null;
                  return (
                    <div key={rf.key}>
                      <label className='text-sm font-medium block mb-1'>
                        {fpDef.label}
                        {rf.required && <span className='text-danger ml-0.5'>*</span>}
                      </label>
                      <input
                        type={fpDef.inputType}
                        placeholder={fpDef.placeholder}
                        value={fieldValues[rf.key] ?? ''}
                        onChange={e => setFieldValue(rf.key, e.target.value)}
                        className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedRole && (
            <p className='text-xs text-muted-foreground'>
              As permissões padrão de <strong>{selectedRole.name}</strong> serão aplicadas automaticamente. Edite depois se necessário.
            </p>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors'
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isValid()}
            className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
