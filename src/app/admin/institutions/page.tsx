'use client';

import { useState } from 'react';
import { useAdminInstitutions } from '@/features/admin/hooks/useAdminInstitutions';
import { InstitutionFormModal } from '@/features/admin/components/InstitutionFormModal';
import { RegisterAdminUserModal } from '@/features/admin/components/RegisterAdminUserModal';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminInstitution } from '@/features/admin/models/adminInstitutionModel';
import { PAYMENT_FORMAT_LABELS } from '@/features/admin/models/adminInstitutionModel';
import { Plus, Pencil, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';

export default function InstitutionsPage() {
  const { institutions, loading, saveInstitution, deleteInstitution, registerAdminUser } =
    useAdminInstitutions();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<AdminInstitution | undefined>();
  const [registeringAdminFor, setRegisteringAdminFor] = useState<AdminInstitution | undefined>();

  const existingAliases = institutions.map(i => i.alias);

  return (
    <div className='p-6 max-w-6xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Instituições</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Gerencie as instituições cadastradas na plataforma.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'
        >
          <Plus size={15} /> Nova Instituição
        </button>
      </div>

      {loading ? (
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-16 w-full rounded-xl' />)}
        </div>
      ) : institutions.length === 0 ? (
        <div className='py-20 text-center rounded-xl border border-dashed border-border text-muted-foreground text-sm'>
          Nenhuma instituição cadastrada.
        </div>
      ) : (
        <div className='rounded-xl border border-border overflow-hidden'>
          {/* Table header */}
          <div className='hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_80px_140px] gap-4 px-4 py-3 bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
            <span>Instituição</span>
            <span>Alias</span>
            <span>Documento</span>
            <span>Pagamento</span>
            <span>Status</span>
            <span className='text-right'>Ações</span>
          </div>

          {/* Rows */}
          <div className='divide-y divide-border'>
            {institutions.map(inst => (
              <div
                key={inst.id}
                className='grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_80px_140px] gap-2 sm:gap-4 px-4 py-4 items-center hover:bg-muted/30 transition-colors'
              >
                {/* Name + color */}
                <div className='flex items-center gap-3 min-w-0'>
                  <div
                    className='w-8 h-8 rounded-lg shrink-0'
                    style={{ backgroundColor: inst.primaryColor }}
                  />
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-foreground truncate'>{inst.name}</p>
                    <p className='text-xs text-muted-foreground'>{inst.createdAt}</p>
                  </div>
                </div>

                {/* Alias */}
                <div className='flex items-center gap-1 min-w-0'>
                  <span className='text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded truncate'>
                    /{inst.alias}
                  </span>
                  <a
                    href={`/${inst.alias}/home`}
                    target='_blank'
                    rel='noopener noreferrer'
                    title='Abrir instituição'
                    className='text-muted-foreground hover:text-primary transition-colors shrink-0'
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Document */}
                <span className='text-sm text-muted-foreground truncate'>
                  {inst.document || '—'}
                </span>

                {/* Payment */}
                <span className='text-sm text-muted-foreground'>
                  {PAYMENT_FORMAT_LABELS[inst.paymentFormat]}
                </span>

                {/* Status */}
                <span
                  className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                    inst.active
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {inst.active ? 'Ativa' : 'Inativa'}
                </span>

                {/* Actions */}
                <div className='flex gap-1 justify-end'>
                  <button
                    onClick={() => setRegisteringAdminFor(inst)}
                    title='Cadastrar administrador'
                    className='p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                  >
                    <ShieldCheck size={14} />
                  </button>
                  <button
                    onClick={() => setEditing(inst)}
                    title='Editar instituição'
                    className='p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => deleteInstitution(inst.id)}
                    title='Remover instituição'
                    className='p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-muted transition-colors'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer count */}
      {!loading && institutions.length > 0 && (
        <p className='text-xs text-muted-foreground text-right'>
          {institutions.length} instituição(ões) cadastrada(s) ·{' '}
          {institutions.filter(i => i.active).length} ativa(s)
        </p>
      )}

      {showCreate && (
        <InstitutionFormModal
          existingAliases={existingAliases}
          onSave={saveInstitution}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editing && (
        <InstitutionFormModal
          institution={editing}
          existingAliases={existingAliases}
          onSave={saveInstitution}
          onClose={() => setEditing(undefined)}
        />
      )}
      {registeringAdminFor && (
        <RegisterAdminUserModal
          institution={registeringAdminFor}
          onSave={registerAdminUser}
          onClose={() => setRegisteringAdminFor(undefined)}
        />
      )}
    </div>
  );
}
