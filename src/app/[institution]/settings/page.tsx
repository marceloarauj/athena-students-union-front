'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useInstitutionStore } from '@/entities/institution';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { useFormulas } from '@/features/settings/hooks/useFormulas';
import { FormulaTab } from '@/features/settings/components/FormulaTab';
import { RoleFormModal } from '@/features/roles/components/RoleFormModal';
import type { RoleModel } from '@/features/roles/models/roleModel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { InfoHint } from '@/components/ui/info-hint';
import Button from '@/components/ui/button';
import { Settings, Palette, Bell, Users, Pencil, Trash2, Plus, Upload, FlaskConical } from 'lucide-react';
import { toast } from 'sonner';

const PRESET_COLORS = [
  { label: 'Azul', value: '#2277DD' },
  { label: 'Verde', value: '#1c914d' },
  { label: 'Vermelho', value: '#EF4444' },
  { label: 'Laranja', value: '#F97316' },
  { label: 'Roxo', value: '#8B5CF6' },
];

const PAYMENT_FORMATS = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'anual', label: 'Anual' },
  { value: 'unica', label: 'Uma vez' },
  { value: 'gratis', label: 'Grátis' },
];

function ToggleSwitch({
  checked, onChange,
}: { checked: boolean; onChange: (v: boolean) => void }) {
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { institution } = useInstitutionStore();
  const alias = institution?.alias ?? '';
  const { roles, loading: rolesLoading, saveRole, deleteRole } = useRoles(alias);
  const {
    formulas, variables, loading: formulasLoading,
    saveFormula, deleteFormula, setPrimaryFormula, saveVariables,
  } = useFormulas(alias);

  const [roleModal, setRoleModal] = useState<{ open: boolean; role?: RoleModel }>({ open: false });

  // --- Geral ---
  const [institutionName, setInstitutionName] = useState(institution?.alias ?? '');
  const [paymentFormat, setPaymentFormat] = useState('mensal');
  const [saveLogs, setSaveLogs] = useState(false);
  const [documento, setDocumento] = useState('');

  // --- Aparência ---
  const [primaryColor, setPrimaryColor] = useState('#2277DD');
  const [lockTheme, setLockTheme] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  function applyColor(color: string) {
    document.documentElement.style.setProperty('--primary', color);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme-primary-color', color);
    }
  }

  function handleSaveAppearance() {
    applyColor(primaryColor);
    toast.success('Aparência salva com sucesso!');
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  }

  async function handleSaveRole(role: RoleModel | Omit<RoleModel, 'id'>) {
    await saveRole(role);
    setRoleModal({ open: false });
    toast.success('id' in role ? 'Perfil atualizado.' : 'Perfil criado.');
  }

  async function handleDeleteRole(id: number) {
    await deleteRole(id);
    toast.success('Perfil removido.');
  }

  return (
    <div className='p-6 max-w-3xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Configurações</h1>
        <p className='text-sm text-muted-foreground mt-1'>Gerencie as preferências da instituição e da sua conta.</p>
      </div>

      <Tabs defaultValue='general'>
        <TabsList className='flex flex-wrap gap-1 h-auto p-1 w-full'>
          <TabsTrigger value='general' className='flex-1 gap-1.5 py-2 text-xs min-w-0'>
            <Settings size={14} /> Geral
          </TabsTrigger>
          <TabsTrigger value='appearance' className='flex-1 gap-1.5 py-2 text-xs min-w-0'>
            <Palette size={14} /> Aparência
          </TabsTrigger>
          <TabsTrigger value='formulas' className='flex-1 gap-1.5 py-2 text-xs min-w-0'>
            <FlaskConical size={14} /> Fórmulas
          </TabsTrigger>
          <TabsTrigger value='roles' className='flex-1 gap-1.5 py-2 text-xs min-w-0'>
            <Users size={14} /> Perfis
          </TabsTrigger>
          <TabsTrigger value='notifications' className='flex-1 gap-1.5 py-2 text-xs min-w-0'>
            <Bell size={14} /> Notificações
          </TabsTrigger>
        </TabsList>

        {/* ── Geral ────────────────────────────────────────── */}
        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>Geral</CardTitle>
              <CardDescription>Configurações gerais da instituição.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-5'>
              <div>
                <label className='text-sm font-medium block mb-1'>Nome da Instituição</label>
                <input
                  value={institutionName}
                  onChange={e => setInstitutionName(e.target.value)}
                  placeholder='Ex: Colégio Estadual...'
                  className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                />
              </div>

              <div>
                <label className='text-sm font-medium block mb-1'>
                  Documento
                  <InfoHint text='Campo livre para identificação da instituição. Normalmente CNPJ.' />
                </label>
                <input
                  value={documento}
                  onChange={e => setDocumento(e.target.value)}
                  placeholder='00.000.000/0001-00'
                  className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                />
              </div>

              <div>
                <label className='text-sm font-medium block mb-1'>Formato de Pagamento</label>
                <Select value={paymentFormat} onValueChange={setPaymentFormat}>
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

              <div className='flex items-center justify-between p-4 rounded-xl border border-border'>
                <div className='pr-4'>
                  <p className='text-sm font-medium flex items-center'>
                    Salvar histórico de atualizações em logs
                    <InfoHint text='Ativar essa opção permite monitorar alterações na instituição com um custo de armazenamento de dados.' />
                  </p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    Registra todas as alterações realizadas na plataforma.
                  </p>
                </div>
                <ToggleSwitch checked={saveLogs} onChange={setSaveLogs} />
              </div>

              <Button
                className='w-full sm:w-auto'
                onClick={() => toast.success('Configurações gerais salvas!')}
              >
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Aparência ────────────────────────────────────── */}
        <TabsContent value='appearance'>
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Personalize as cores, tema e identidade visual da plataforma.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Ícone / Logo */}
              <div>
                <label className='text-sm font-medium block mb-2'>Ícone da Instituição</label>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0'>
                    {logoPreview ? (
                      <img src={logoPreview} alt='Logo' className='w-full h-full object-contain' />
                    ) : (
                      <img src='/images/logo.png' alt='Logo atual' className='w-full h-full object-contain' />
                    )}
                  </div>
                  <div className='space-y-1.5'>
                    <input
                      ref={logoInputRef}
                      type='file'
                      accept='image/*'
                      onChange={handleLogoChange}
                      className='hidden'
                    />
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className='flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors'
                    >
                      <Upload size={14} />
                      Fazer upload
                    </button>
                    {logoPreview && (
                      <button
                        onClick={() => { setLogoPreview(null); if (logoInputRef.current) logoInputRef.current.value = ''; }}
                        className='text-xs text-muted-foreground hover:text-danger transition-colors block'
                      >
                        Remover e usar atual
                      </button>
                    )}
                    <p className='text-xs text-muted-foreground'>PNG, JPG ou SVG. Recomendado: 256×256px.</p>
                  </div>
                </div>
              </div>

              {/* Dark / Light mode */}
              <div>
                <label className='text-sm font-medium block mb-2'>Modo de Exibição</label>
                <div className='flex gap-3 mb-3'>
                  {['light', 'dark'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        mounted && theme === t
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {t === 'light' ? '☀️ Claro' : '🌙 Escuro'}
                    </button>
                  ))}
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg border border-border'>
                  <div>
                    <p className='text-sm font-medium'>Bloquear alternância de tema</p>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Impede que usuários comuns alterem o modo claro/escuro.
                    </p>
                  </div>
                  <ToggleSwitch checked={lockTheme} onChange={setLockTheme} />
                </div>
              </div>

              {/* Primary color */}
              <div>
                <label className='text-sm font-medium block mb-2'>Cor Primária</label>
                <div className='flex items-center gap-3'>
                  <input
                    type='color'
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    className='w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent'
                  />
                  <input
                    type='text'
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    className='w-32 h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono'
                  />
                </div>
                <div className='flex gap-2 mt-3 flex-wrap'>
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setPrimaryColor(c.value)}
                      title={c.label}
                      className='w-8 h-8 rounded-full border-2 shadow-sm hover:scale-110 transition-transform'
                      style={{ backgroundColor: c.value, borderColor: primaryColor === c.value ? c.value : 'white' }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className='text-sm font-medium block mb-2'>Pré-visualização</label>
                <div className='p-4 rounded-xl border border-border space-y-2'>
                  <div className='h-3 rounded-full w-full' style={{ backgroundColor: primaryColor }} />
                  <div className='h-3 rounded-full w-3/4 opacity-60' style={{ backgroundColor: primaryColor }} />
                  <div className='h-3 rounded-full w-1/2 opacity-30' style={{ backgroundColor: primaryColor }} />
                </div>
              </div>

              <Button onClick={handleSaveAppearance} className='w-full sm:w-auto'>
                Salvar Aparência
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Fórmulas ─────────────────────────────────────── */}
        <TabsContent value='formulas'>
          <Card>
            <CardHeader>
              <CardTitle>Fórmulas de Aprovação</CardTitle>
              <CardDescription>
                Configure as variáveis e fórmulas usadas para calcular aprovação nas disciplinas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormulaTab
                formulas={formulas}
                variables={variables}
                loading={formulasLoading}
                onSaveFormula={saveFormula}
                onDeleteFormula={deleteFormula}
                onSetPrimary={setPrimaryFormula}
                onSaveVariables={saveVariables}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Perfis de Usuário ─────────────────────────────── */}
        <TabsContent value='roles'>
          <Card>
            <CardHeader className='flex flex-row items-start justify-between gap-4'>
              <div>
                <CardTitle>Perfis de Usuário</CardTitle>
                <CardDescription>
                  Gerencie os perfis de acesso, permissões padrão e campos de cadastro.
                </CardDescription>
              </div>
              <button
                onClick={() => setRoleModal({ open: true })}
                className='flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shrink-0'
              >
                <Plus size={14} /> Novo Perfil
              </button>
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <p className='text-sm text-muted-foreground'>Carregando...</p>
              ) : (
                <div className='space-y-3'>
                  {roles.map(role => (
                    <div
                      key={role.id}
                      className='flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/40 transition-colors'
                    >
                      <div className='min-w-0'>
                        <div className='flex items-center gap-2'>
                          <p className='text-sm font-semibold text-foreground'>{role.name}</p>
                          <span className='text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono'>
                            {role.alias}
                          </span>
                        </div>
                        <p className='text-xs text-muted-foreground mt-0.5'>
                          {role.fields.length} campo(s) de cadastro ·{' '}
                          {role.defaultPermissions.alteracoes.length + role.defaultPermissions.sistema.length} permissão(ões) padrão
                        </p>
                      </div>
                      <div className='flex gap-1 ml-2'>
                        <button
                          onClick={() => setRoleModal({ open: true, role })}
                          className='p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className='p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-muted transition-colors'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {roles.length === 0 && (
                    <p className='text-sm text-muted-foreground text-center py-8'>
                      Nenhum perfil cadastrado.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notificações ─────────────────────────────────── */}
        <TabsContent value='notifications'>
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configure suas preferências de notificação.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {['Receber notificações por e-mail', 'Avisos de novas atividades', 'Lembretes de pagamento'].map(label => (
                <label
                  key={label}
                  className='flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer hover:bg-muted'
                >
                  <span className='text-sm'>{label}</span>
                  <input type='checkbox' defaultChecked className='accent-primary' />
                </label>
              ))}
              <Button className='w-full sm:w-auto mt-4' onClick={() => toast.success('Preferências salvas!')}>
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {roleModal.open && (
        <RoleFormModal
          role={roleModal.role}
          onSave={handleSaveRole}
          onClose={() => setRoleModal({ open: false })}
        />
      )}
    </div>
  );
}
