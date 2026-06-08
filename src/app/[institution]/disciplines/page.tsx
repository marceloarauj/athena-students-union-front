'use client';

import { useState } from 'react';
import { useInstitutionStore } from '@/entities/institution';
import { useDisciplines } from '@/features/disciplines/hooks/useDisciplines';
import { useFormulas } from '@/features/settings/hooks/useFormulas';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { usePermissionGuard } from '@/features/auth/hooks/usePermissionGuard';
import { Discipline } from '@/features/disciplines/models/disciplineModel';
import { CreateDisciplineModal } from '@/features/disciplines/components/CreateDisciplineModal';
import { DisciplineTopicsModal } from '@/features/disciplines/components/DisciplineTopicsModal';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, Layers, FlaskConical, BookOpen } from 'lucide-react';

export default function DisciplinesPage() {
  const allowed = usePermissionGuard('SHOW_SCREEN_DISCIPLINE');
  const { institution } = useInstitutionStore();
  const alias = institution?.alias ?? '';
  const { disciplines, loading, deleteDiscipline, saveDiscipline } = useDisciplines(alias);
  const { formulas } = useFormulas(alias);
  const { hasPermission } = usePermission();

  const [showCreate, setShowCreate] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | undefined>();
  const [topicsDiscipline, setTopicsDiscipline] = useState<Discipline | undefined>();

  if (!allowed) return null;

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Disciplinas</h1>
          <p className='text-sm text-muted-foreground mt-1'>Gerencie as disciplinas da instituição.</p>
        </div>
        {hasPermission('CREATE_DISCIPLINE') && (
          <button
            onClick={() => setShowCreate(true)}
            className='px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'
          >
            + Nova Disciplina
          </button>
        )}
      </div>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className='h-32 w-full rounded-xl' />)}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {disciplines.map((d: Discipline) => {
            const formula = formulas.find(f => f.id === d.formulaId);
            return (
              <Card key={d.id} className='group'>
                <CardContent className='p-4'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-8 h-8 rounded-lg flex items-center justify-center shrink-0'
                        style={{ backgroundColor: `${d.color}20` }}
                      >
                        <Layers size={16} style={{ color: d.color }} />
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-foreground'>{d.name}</p>
                        <p className='text-xs text-muted-foreground'>{d.code}</p>
                      </div>
                    </div>
                    <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      {hasPermission('UPDATE_DISCIPLINE_TOPICS') && (
                        <button
                          onClick={() => setTopicsDiscipline(d)}
                          title='Gerenciar tópicos'
                          className='p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                        >
                          <BookOpen size={14} />
                        </button>
                      )}
                      {hasPermission('UPDATE_DISCIPLINE') && (
                        <button
                          onClick={() => setEditingDiscipline(d)}
                          title='Editar disciplina'
                          className='p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {hasPermission('DELETE_DISCIPLINE') && (
                        <button
                          onClick={() => deleteDiscipline(d.id)}
                          title='Excluir disciplina'
                          className='p-1 rounded text-muted-foreground hover:text-danger hover:bg-muted transition-colors'
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className='text-xs text-muted-foreground mb-3'>{d.description}</p>
                  {d.topics.length === 0 && (
                    <span className='inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/25 font-medium mb-2'>
                      Pendente de tópicos
                    </span>
                  )}
                  <div className='flex flex-col gap-2'>
                    <div className='flex gap-4 text-xs text-muted-foreground'>
                      <span>{d.teacherCount} professor(es)</span>
                      <span>{d.classes} turma(s)</span>
                      {d.topics.length > 0 && <span>{d.topics.length} tópico(s)</span>}
                    </div>
                    {formula && (
                      <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                        <FlaskConical size={11} className='shrink-0' />
                        <span className='truncate'>{formula.description}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showCreate && (
        <CreateDisciplineModal
          formulas={formulas}
          onSave={saveDiscipline}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editingDiscipline && (
        <CreateDisciplineModal
          formulas={formulas}
          discipline={editingDiscipline}
          onSave={saveDiscipline}
          onClose={() => setEditingDiscipline(undefined)}
        />
      )}
      {topicsDiscipline && (
        <DisciplineTopicsModal
          discipline={topicsDiscipline}
          onSave={saveDiscipline}
          onClose={() => setTopicsDiscipline(undefined)}
        />
      )}
    </div>
  );
}
