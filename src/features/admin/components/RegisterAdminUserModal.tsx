'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { X, ShieldCheck } from 'lucide-react';
import type { AdminInstitution } from '../models/adminInstitutionModel';
import type { AdminUserRegister } from '../models/adminUserModel';

const schema = z.object({
  firstName: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  institution: AdminInstitution;
  onSave: (institutionId: number, data: AdminUserRegister) => Promise<void>;
  onClose: () => void;
};

export function RegisterAdminUserModal({ institution, onSave, onClose }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    const result = schema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach(issue => {
        setError(issue.path[0] as keyof FormValues, { message: issue.message });
      });
      return;
    }
    await onSave(institution.id, result.data);
    onClose();
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md rounded-2xl border border-border bg-card shadow-xl'>
        {/* Header */}
        <div className='flex items-start justify-between gap-4 border-b border-border px-6 py-4'>
          <div className='flex items-center gap-3'>
            <div
              className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg'
              style={{ backgroundColor: institution.primaryColor + '20' }}
            >
              <ShieldCheck size={18} style={{ color: institution.primaryColor }} />
            </div>
            <div>
              <h2 className='text-sm font-semibold text-foreground'>Cadastrar Administrador</h2>
              <p className='text-xs text-muted-foreground'>{institution.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 px-6 py-5'>
          <p className='text-xs text-muted-foreground'>
            Este usuário terá a role <span className='font-semibold text-foreground'>Admin</span> com
            todas as permissões ativas e será responsável pelo primeiro acesso e gerenciamento da
            instituição.
          </p>

          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>Nome</label>
              <input
                {...register('firstName')}
                placeholder='João'
                className='w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40'
              />
              {errors.firstName && (
                <p className='text-xs text-red-500'>{errors.firstName.message}</p>
              )}
            </div>

            <div className='space-y-1'>
              <label className='text-xs font-medium text-foreground'>Sobrenome</label>
              <input
                {...register('lastName')}
                placeholder='Silva'
                className='w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40'
              />
              {errors.lastName && (
                <p className='text-xs text-red-500'>{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className='space-y-1'>
            <label className='text-xs font-medium text-foreground'>E-mail</label>
            <input
              {...register('email')}
              type='email'
              placeholder='admin@instituicao.edu.br'
              className='w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40'
            />
            {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
          </div>

          {/* Footer */}
          <div className='flex justify-end gap-2 pt-1'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60'
            >
              <ShieldCheck size={14} />
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
