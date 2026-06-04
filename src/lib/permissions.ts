export const ALTERACOES_PERMISSIONS = [
  { key: 'edit_name', label: 'Permitir editar nome' },
  { key: 'edit_email', label: 'Permitir editar email' },
  { key: 'edit_phone', label: 'Permitir editar telefone' },
  { key: 'access_grades', label: 'Permitir acessar a tela de notas' },
  { key: 'access_calendar', label: 'Permitir acessar calendário' },
  { key: 'access_attendance', label: 'Permitir acessar chamada' },
] as const;

export const SISTEMA_PERMISSIONS = [
  { key: 'manage_payments', label: 'Permitir alterar formato de pagamento' },
  { key: 'change_institution_colors', label: 'Permitir mudar cores da instituição' },
  { key: 'change_logo', label: 'Permitir alterar logomarca' },
  { key: 'manage_users', label: 'Permitir gerenciar usuários' },
  { key: 'manage_reports', label: 'Permitir acessar relatórios' },
  { key: 'manage_classes', label: 'Permitir gerenciar turmas' },
] as const;

export const FIELD_PERMISSIONS = [
  { key: 'FIELD_EMAIL', label: 'Email', inputType: 'email', placeholder: 'email@exemplo.com' },
  { key: 'FIELD_PHONE', label: 'Telefone', inputType: 'text', placeholder: '(11) 99999-9999' },
  { key: 'FIELD_PERIOD', label: 'Período', inputType: 'text', placeholder: 'Ex: Manhã, Tarde, Noite' },
  { key: 'FIELD_REGISTER', label: 'Matrícula', inputType: 'text', placeholder: 'Número de matrícula' },
  { key: 'FIELD_BIRTHDATE', label: 'Data de Nascimento', inputType: 'date', placeholder: '' },
  { key: 'FIELD_SHIFT', label: 'Turno', inputType: 'text', placeholder: 'Ex: Manhã' },
  { key: 'RESPONSIBLE_NAME', label: 'Responsável', inputType: 'text', placeholder: 'Nome do responsável' },
] as const;

export type AlteracoesPermissionKey = (typeof ALTERACOES_PERMISSIONS)[number]['key'];
export type SistemaPermissionKey = (typeof SISTEMA_PERMISSIONS)[number]['key'];
export type FieldPermissionKey = (typeof FIELD_PERMISSIONS)[number]['key'];
