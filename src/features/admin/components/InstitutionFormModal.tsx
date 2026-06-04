'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { InfoHint } from '@/components/ui/info-hint';
import type { AdminInstitution, PaymentFormat } from '../models/adminInstitutionModel';
import { RESERVED_ALIASES } from '../models/adminInstitutionModel';

const PRESET_COLORS = [
  { label: 'Azul', value: '#2277DD' },
  { label: 'Verde', value: '#1c914d' },
  { label: 'Vermelho', value: '#EF4444' },
  { label: 'Laranja', value: '#F97316' },
  { label: 'Roxo', value: '#8B5CF6' },
  { label: 'Ciano', value: '#06B6D4' },
];

const PAYMENT_FORMATS: { value: PaymentFormat; label: string }[] = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'anual', label: 'Anual' },
  { value: 'unica', label: 'Uma vez' },
  { value: 'gratis', label: 'Grátis' },
];

type Props = {
  institution?: AdminInstitution;
  existingAliases: string[];
  onSave: (i: Omit<AdminInstitution, 'id' | 'createdAt'> | AdminInstitution) => Promise<void>;
  onClose: () => void;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-/, '');
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-primary' : 'bg-muted border border-border'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function InstitutionFormModal({ institution, existingAliases, onSave, onClose }: Props) {
  const isEditing = institution !== undefined;

  const [alias, setAlias] = useState(institution?.alias ?? '');
  const [name, setName] = useState(institution?.name ?? '');
  const [document, setDocument] = useState(institution?.document ?? '');
  const [paymentFormat, setPaymentFormat] = useState<PaymentFormat>(institution?.paymentFormat ?? 'mensal');
  const [primaryColor, setPrimaryColor] = useState(institution?.primaryColor ?? '#2277DD');
  const [saveLogs, setSaveLogs] = useState(institution?.saveLogs ?? false);
  const [active, setActive] = useState(institution?.active ?? true);
  const [saving, setSaving] = useState(false);

  const aliasError = (() => {
    if (!alias) return null;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(alias)) return 'Apenas letras minúsculas, números e hífens. Hífen somente no meio (ex: colegio-sul-america).';
    if (RESERVED_ALIASES.includes(alias)) return `"${alias}" é reservado e não pode ser usado.`;
    const isDuplicate = existingAliases.filter(a => a !== institution?.alias).includes(alias);
    if (isDuplicate) return 'Esse alias já está em uso.';
    return null;
  })();

  const isValid = alias.trim().length > 0 && name.trim().length > 0 && !aliasError;

  async function handleSave() {
    if (!isValid) return;
    setSaving(true);
    const data = { alias: alias.replace(/-+$/, ''), name: name.trim(), document: document.trim(), paymentFormat, primaryColor, saveLogs, active };
    await onSave(isEditing ? { ...data, id: institution.id, createdAt: institution.createdAt } : data);
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-sm sm:max-w-lg max-h-[92vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Building2 size={16} className='text-primary' />
            {isEditing ? 'Editar Instituição' : 'Nova Instituição'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados da instituição.' : 'Preencha os dados para cadastrar uma nova instituição.'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Alias */}
          <div>
            <label className='text-sm font-medium block mb-1'>
              Alias <span className='text-danger'>*</span>
              <InfoHint text='Identificador único usado na URL. Ex: "tobias" → /tobias/home. Apenas letras minúsculas, números e hífens.' />
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none'>
                /
              </span>
              <input
                value={alias}
                onChange={e => setAlias(slugify(e.target.value))}
                placeholder='ex: colegio-estadual'
                disabled={isEditing}
                className='w-full h-9 pl-6 pr-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono disabled:opacity-60 disabled:cursor-not-allowed'
              />
            </div>
            {aliasError && <p className='text-xs text-danger mt-1'>{aliasError}</p>}
            {isEditing && (
              <p className='text-xs text-muted-foreground mt-1'>O alias não pode ser alterado após o cadastro.</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className='text-sm font-medium block mb-1'>
              Nome da Instituição <span className='text-danger'>*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Ex: Colégio Estadual Central'
              className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
            />
          </div>

          {/* Document */}
          <div>
            <label className='text-sm font-medium block mb-1'>
              Documento
              <InfoHint text='Normalmente CNPJ da instituição.' />
            </label>
            <input
              value={document}
              onChange={e => setDocument(e.target.value)}
              placeholder='00.000.000/0001-00'
              className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
            />
          </div>

          {/* Payment format */}
          <div>
            <label className='text-sm font-medium block mb-1'>Formato de Pagamento</label>
            <Select value={paymentFormat} onValueChange={v => setPaymentFormat(v as PaymentFormat)}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_FORMATS.map(f => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Primary color */}
          <div>
            <label className='text-sm font-medium block mb-2'>Cor Primária</label>
            <div className='flex items-center gap-3 mb-3'>
              <input
                type='color'
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className='w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent'
              />
              <input
                type='text'
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                className='w-28 h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono'
              />
              <div className='flex gap-1.5'>
                {PRESET_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setPrimaryColor(c.value)}
                    title={c.label}
                    className='w-6 h-6 rounded-full border-2 shadow-sm hover:scale-110 transition-transform'
                    style={{ backgroundColor: c.value, borderColor: primaryColor === c.value ? c.value : 'transparent' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between p-3 rounded-xl border border-border'>
              <div className='pr-4'>
                <p className='text-sm font-medium'>Salvar logs de alterações</p>
                <p className='text-xs text-muted-foreground mt-0.5'>Registra todas as alterações realizadas.</p>
              </div>
              <ToggleSwitch checked={saveLogs} onChange={setSaveLogs} />
            </div>

            <div className='flex items-center justify-between p-3 rounded-xl border border-border'>
              <div className='pr-4'>
                <p className='text-sm font-medium'>Instituição ativa</p>
                <p className='text-xs text-muted-foreground mt-0.5'>Inativa impede o acesso de usuários.</p>
              </div>
              <ToggleSwitch checked={active} onChange={setActive} />
            </div>
          </div>

          {/* Preview */}
          <div
            className='flex items-center gap-3 p-3 rounded-xl border border-border'
            style={{ backgroundColor: `${primaryColor}12` }}
          >
            <div
              className='w-8 h-8 rounded-lg shrink-0'
              style={{ backgroundColor: primaryColor }}
            />
            <div className='min-w-0'>
              <p className='text-sm font-semibold text-foreground truncate'>{name || 'Nome da instituição'}</p>
              <p className='text-xs text-muted-foreground font-mono'>/{alias || 'alias'}</p>
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
            disabled={saving || !isValid}
            className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Instituição'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
