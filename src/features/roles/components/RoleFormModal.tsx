'use client';

import { useState } from 'react';
import { ShieldCheck, Info, LayoutList } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import type { RoleModel, RoleField } from '../models/roleModel';
import {
  ALTERACOES_PERMISSIONS, SISTEMA_PERMISSIONS, FIELD_PERMISSIONS,
  type AlteracoesPermissionKey, type SistemaPermissionKey, type FieldPermissionKey,
} from '@/lib/permissions';

type Props = {
  role?: RoleModel;
  onSave: (role: RoleModel | Omit<RoleModel, 'id'>) => Promise<void>;
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

function Toggle({
  checked, onToggle, label,
}: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
        checked
          ? 'bg-primary/10 border-primary text-primary'
          : 'bg-muted border-border text-muted-foreground hover:border-primary/40'
      }`}
    >
      {label}
    </button>
  );
}

function toAlias(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type FieldState = { active: boolean; required: boolean };

function initFieldState(roleFields: RoleField[] | undefined): Record<FieldPermissionKey, FieldState> {
  const state = {} as Record<FieldPermissionKey, FieldState>;
  for (const fp of FIELD_PERMISSIONS) {
    const existing = roleFields?.find(f => f.key === fp.key);
    state[fp.key] = {
      active: existing !== undefined,
      required: existing?.required ?? false,
    };
  }
  return state;
}

export function RoleFormModal({ role, onSave, onClose }: Props) {
  const isEdit = role !== undefined;
  const [name, setName] = useState(role?.name ?? '');
  const [alias, setAlias] = useState(role?.alias ?? '');
  const [alteracoes, setAlteracoes] = useState<AlteracoesPermissionKey[]>(
    role?.defaultPermissions.alteracoes ?? [],
  );
  const [sistema, setSistema] = useState<SistemaPermissionKey[]>(
    role?.defaultPermissions.sistema ?? [],
  );
  const [fieldState, setFieldState] = useState<Record<FieldPermissionKey, FieldState>>(
    () => initFieldState(role?.fields),
  );
  const [saving, setSaving] = useState(false);

  function handleNameChange(v: string) {
    setName(v);
    if (!isEdit) setAlias(toAlias(v));
  }

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

  function toggleFieldActive(key: FieldPermissionKey) {
    setFieldState(prev => ({
      ...prev,
      [key]: { active: !prev[key].active, required: !prev[key].active ? prev[key].required : false },
    }));
  }

  function toggleFieldRequired(key: FieldPermissionKey) {
    setFieldState(prev => ({
      ...prev,
      [key]: { ...prev[key], required: !prev[key].required },
    }));
  }

  async function handleSave() {
    if (!name.trim() || !alias.trim()) return;
    setSaving(true);

    const fields: RoleField[] = FIELD_PERMISSIONS
      .filter(fp => fieldState[fp.key].active)
      .map(fp => ({ key: fp.key, required: fieldState[fp.key].required }));

    const payload = {
      ...(isEdit ? { id: role!.id } : {}),
      name: name.trim(),
      alias: alias.trim(),
      defaultPermissions: { alteracoes, sistema },
      fields,
    };
    await onSave(payload as RoleModel);
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <ShieldCheck size={16} className='text-primary' />
            {isEdit ? 'Editar Perfil de Usuário' : 'Novo Perfil de Usuário'}
          </DialogTitle>
          <DialogDescription>
            Configure o nome, permissões padrão e campos de cadastro para este perfil.
          </DialogDescription>
        </DialogHeader>

        <div className='overflow-y-auto max-h-[65vh] space-y-6 pr-1'>
          {/* Name + alias */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium block mb-1'>
                Nome do Perfil <span className='text-danger'>*</span>
              </label>
              <input
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder='Ex: Professor'
                className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
              />
            </div>
            <div>
              <label className='text-sm font-medium block mb-1'>
                Identificador <span className='text-danger'>*</span>
              </label>
              <input
                value={alias}
                onChange={e => setAlias(e.target.value)}
                placeholder='Ex: professor'
                className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono'
              />
            </div>
          </div>

          {/* Permissions section */}
          <div className='rounded-xl border border-border p-4 space-y-5'>
            <h4 className='text-sm font-semibold flex items-center gap-1.5 text-foreground'>
              <Info size={14} className='text-muted-foreground' />
              Permissões Padrão
            </h4>

            <div>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3'>
                Alterações
              </p>
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
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3'>
                Sistema
              </p>
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

          {/* Registration fields section */}
          <div className='rounded-xl border border-border p-4 space-y-3'>
            <div>
              <h4 className='text-sm font-semibold flex items-center gap-1.5 text-foreground'>
                <LayoutList size={14} className='text-muted-foreground' />
                Campos de Cadastro
              </h4>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Defina quais campos serão solicitados ao criar um usuário deste perfil.
              </p>
            </div>

            <div className='space-y-2'>
              {FIELD_PERMISSIONS.map(fp => {
                const state = fieldState[fp.key];
                return (
                  <div
                    key={fp.key}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      state.active ? 'border-primary/30 bg-primary/5' : 'border-border'
                    }`}
                  >
                    <span className={`text-sm font-medium ${state.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {fp.label}
                      <span className='ml-2 text-xs font-mono text-muted-foreground'>{fp.key}</span>
                    </span>
                    <div className='flex items-center gap-2'>
                      {state.active && (
                        <Toggle
                          checked={state.required}
                          onToggle={() => toggleFieldRequired(fp.key)}
                          label={state.required ? 'Obrigatório' : 'Opcional'}
                        />
                      )}
                      <Toggle
                        checked={state.active}
                        onToggle={() => toggleFieldActive(fp.key)}
                        label={state.active ? 'Ativo' : 'Inativo'}
                      />
                    </div>
                  </div>
                );
              })}
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
            disabled={saving || !name.trim() || !alias.trim()}
            className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Perfil'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
