'use client';

import { useState } from 'react';
import { Pencil, Info } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AppUser } from '../models/appUserModel';
import type { RoleModel } from '@/features/roles/models/roleModel';
import {
  ALTERACOES_PERMISSIONS, SISTEMA_PERMISSIONS,
  type AlteracoesPermissionKey, type SistemaPermissionKey,
} from '@/lib/permissions';

type Props = {
  user: AppUser;
  roles: RoleModel[];
  onSave: (user: AppUser) => Promise<void>;
  onClose: () => void;
};

function PermCheck({
  label, checked, onToggle,
}: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className='flex items-center gap-2 text-left cursor-pointer group'
    >
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          checked ? 'bg-primary border-primary' : 'border-border'
        }`}
      >
        {checked && (
          <svg width='10' height='8' viewBox='0 0 10 8' fill='none'>
            <path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        )}
      </span>
      <span className='text-sm text-foreground group-hover:text-primary transition-colors'>{label}</span>
    </button>
  );
}

export function EditUserModal({ user, roles, onSave, onClose }: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [alteracoes, setAlteracoes] = useState<AlteracoesPermissionKey[]>(
    user.permissions.alteracoes,
  );
  const [sistema, setSistema] = useState<SistemaPermissionKey[]>(
    user.permissions.sistema,
  );
  const [saving, setSaving] = useState(false);

  function toggleAlteracao(key: AlteracoesPermissionKey) {
    setAlteracoes(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  }

  function toggleSistema(key: SistemaPermissionKey) {
    setSistema(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  }

  async function handleSave() {
    if (!name.trim() || !email.trim()) return;
    setSaving(true);
    await onSave({ ...user, name: name.trim(), email: email.trim(), role, permissions: { alteracoes, sistema } });
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Pencil size={16} className='text-primary' />
            Editar Usuário
          </DialogTitle>
          <DialogDescription>Atualize as informações e permissões do usuário.</DialogDescription>
        </DialogHeader>

        <div className='overflow-y-auto max-h-[60vh] space-y-5 pr-1'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium block mb-1'>
                Nome Completo <span className='text-danger'>*</span>
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
              />
            </div>
            <div>
              <label className='text-sm font-medium block mb-1'>
                E-mail <span className='text-danger'>*</span>
              </label>
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium block mb-1'>Tipo de Usuário</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map(r => (
                  <SelectItem key={r.alias} value={r.alias}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className='text-sm font-semibold flex items-center gap-1.5 mb-3'>
              <Info size={14} className='text-muted-foreground' />
              Permissões de Alterações
            </h4>
            <div className='grid grid-cols-2 gap-3'>
              {ALTERACOES_PERMISSIONS.map(p => (
                <PermCheck
                  key={p.key}
                  label={p.label}
                  checked={alteracoes.includes(p.key)}
                  onToggle={() => toggleAlteracao(p.key)}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className='text-sm font-semibold flex items-center gap-1.5 mb-3'>
              <Info size={14} className='text-muted-foreground' />
              Permissões de Sistema
            </h4>
            <div className='grid grid-cols-2 gap-3'>
              {SISTEMA_PERMISSIONS.map(p => (
                <PermCheck
                  key={p.key}
                  label={p.label}
                  checked={sistema.includes(p.key)}
                  onToggle={() => toggleSistema(p.key)}
                />
              ))}
            </div>
          </div>
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
            disabled={saving || !name.trim() || !email.trim()}
            className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
