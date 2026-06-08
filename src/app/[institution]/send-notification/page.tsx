'use client';

import { useState } from 'react';
import { useInstitutionStore } from '@/entities/institution';
import { useSendNotification } from '@/features/sendNotification/hooks/useSendNotification';
import { usePermissionGuard } from '@/features/auth/hooks/usePermissionGuard';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { RoleSelector } from '@/features/sendNotification/components/RoleSelector';
import { UserSelector } from '@/features/sendNotification/components/UserSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Users, UserCheck } from 'lucide-react';

type Mode = 'groups' | 'specific';

export default function SendNotificationPage() {
  const allowed = usePermissionGuard('SHOW_SCREEN_NOTIFICATIONS');
  const { institution } = useInstitutionStore();
  const alias = institution?.alias ?? '';
  const {
    recipients, selectedRoles, targetRecipients, toggleRole, toggleAllRoles,
    selectedUserIds, toggleUser, toggleAllUsers,
    loading, sending, sendNotification,
  } = useSendNotification(alias);
  const { roles } = useRoles(alias);

  const [mode, setMode] = useState<Mode>('groups');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  if (!allowed) return null;

  const destinatariosCount = mode === 'groups' ? targetRecipients.length : selectedUserIds.length;
  const hasRecipients = mode === 'groups' ? selectedRoles.length > 0 : selectedUserIds.length > 0;
  const canSend = title.trim().length > 0 && message.trim().length > 0 && hasRecipients && !sending;

  async function handleSend() {
    await sendNotification(title, message, mode);
    setTitle('');
    setMessage('');
  }

  function getHint() {
    if (!title.trim() || !message.trim()) return 'Preencha título e mensagem';
    if (!hasRecipients) return mode === 'groups' ? 'Selecione ao menos um grupo' : 'Selecione ao menos um usuário';
    return '';
  }

  return (
    <div className='p-6 max-w-2xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Enviar Notificação</h1>
        <p className='text-sm text-muted-foreground mt-1'>Envie mensagens para grupos ou usuários específicos.</p>
      </div>

      <Card>
        <CardContent className='p-6 space-y-6'>

          {/* Destinatários */}
          <div className='space-y-3'>
            <label className='text-sm font-medium text-foreground'>Para</label>

            {/* Mode toggle */}
            <div className='flex rounded-lg border border-border overflow-hidden text-sm'>
              <button
                onClick={() => setMode('groups')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 font-medium transition-colors ${
                  mode === 'groups'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <Users size={14} /> Grupos
              </button>
              <button
                onClick={() => setMode('specific')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 font-medium border-l border-border transition-colors ${
                  mode === 'specific'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <UserCheck size={14} /> Usuários específicos
              </button>
            </div>

            {/* Selector */}
            {loading ? (
              <div className='flex gap-2 flex-wrap'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className='h-9 w-24 rounded-full' />
                ))}
              </div>
            ) : mode === 'groups' ? (
              <RoleSelector
                roles={roles}
                recipients={recipients}
                selectedRoles={selectedRoles}
                onToggle={toggleRole}
                onToggleAll={toggleAllRoles}
              />
            ) : (
              <UserSelector
                recipients={recipients}
                selectedIds={selectedUserIds}
                onToggle={toggleUser}
                onToggleAll={toggleAllUsers}
              />
            )}

            {hasRecipients && (
              <p className='text-xs text-muted-foreground flex items-center gap-1.5'>
                <Users size={12} />
                {destinatariosCount} destinatário{destinatariosCount !== 1 ? 's' : ''} selecionado{destinatariosCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Título */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground'>Título</label>
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Ex: Aviso importante sobre o calendário...'
              className='w-full h-10 px-3 text-sm border border-border bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
            />
          </div>

          {/* Mensagem */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground'>Mensagem</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder='Escreva o conteúdo da notificação aqui...'
              rows={5}
              className='w-full px-3 py-2.5 text-sm border border-border bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none'
            />
          </div>

          <div className='flex items-center justify-between pt-2 border-t border-border'>
            <p className='text-xs text-muted-foreground'>{getHint()}</p>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className='flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all'
            >
              <Send size={15} />
              {sending ? 'Enviando...' : 'Enviar Notificação'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
