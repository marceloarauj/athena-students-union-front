'use client';

import { useState } from 'react';
import { useInstitutionStore } from '@/entities/institution';
import { useClassSetup } from '@/features/classSetup/hooks/useClassSetup';
import { useDisciplines } from '@/features/disciplines/hooks/useDisciplines';
import { useDayLessonScheduleConfig } from '@/features/dayLessonScheduleConfig/hooks/useDayLessonScheduleConfig';
import { SchoolClass } from '@/features/classSetup/models/classSetupModel';
import { ClassGradeEntryModal } from '@/features/classSetup/components/ClassGradeEntryModal';
import { DayLessonModal } from '@/features/classSetup/components/DayLessonModal';
import { ScheduleConfigList } from '@/features/dayLessonScheduleConfig/components/ScheduleConfigList';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, CalendarDays, Pencil, Trash2, Bot } from 'lucide-react';

const frequencyLabels: Record<string, string> = {
  diaria: 'Diária',
  '2x': '2× semana',
  '3x': '3× semana',
  '4x': '4× semana',
  '5x': '5× semana',
};

export default function ClassSetupPage() {
  const { institution } = useInstitutionStore();
  const alias = institution?.alias ?? '';

  const { classes, loading: loadingClasses, deleteClass } = useClassSetup(alias);
  const { disciplines } = useDisciplines(alias);
  const {
    configs,
    loading: loadingConfigs,
    createConfig,
    updateConfig,
    toggleActive,
  } = useDayLessonScheduleConfig(alias);

  const [gradeClass, setGradeClass] = useState<SchoolClass | null>(null);
  const [dayLessonClass, setDayLessonClass] = useState<SchoolClass | null>(null);

  const activeConfigs = configs.filter(c => c.isActive).length;

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Turmas</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Gerencie as turmas e configure a automação de geração de aulas.
          </p>
        </div>
      </div>

      <Tabs defaultValue='turmas'>
        <TabsList>
          <TabsTrigger value='turmas'>Turmas</TabsTrigger>
          <TabsTrigger value='automacao' className='flex items-center gap-1.5'>
            <Bot size={13} />
            Automação de Aulas
            {activeConfigs > 0 && (
              <span className='ml-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center'>
                {activeConfigs}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Turmas */}
        <TabsContent value='turmas' className='mt-4'>
          <div className='flex justify-end mb-4'>
            <button className='px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'>
              + Nova Turma
            </button>
          </div>

          {loadingClasses ? (
            <div className='space-y-3'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-28 w-full rounded-xl' />
              ))}
            </div>
          ) : (
            <div className='space-y-3'>
              {classes.map((c: SchoolClass) => (
                <Card key={c.id} className='group'>
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap mb-2'>
                          <p className='text-sm font-semibold text-foreground'>{c.name}</p>
                          <Badge variant='default'>{c.discipline}</Badge>
                          <Badge variant='muted'>{frequencyLabels[c.frequency] ?? c.frequency}</Badge>
                        </div>
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground'>
                          <span>Professor: <span className='text-foreground font-medium'>{c.teacher}</span></span>
                          <span>Início: <span className='text-foreground font-medium'>{c.startDate}</span></span>
                          <span>Término: <span className='text-foreground font-medium'>{c.endDate}</span></span>
                          <span>Total: <span className='text-foreground font-medium'>{c.totalClasses} aulas</span></span>
                        </div>
                        <div className='flex gap-1 mt-2 flex-wrap'>
                          {c.daysOfWeek.map(d => (
                            <span key={d} className='text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md capitalize'>{d}</span>
                          ))}
                        </div>
                      </div>

                      <div className='flex items-center gap-1 ml-4 shrink-0'>
                        <button
                          onClick={() => setDayLessonClass(c)}
                          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors'
                        >
                          <CalendarDays size={13} />
                          Aula do Dia
                        </button>
                        <button
                          onClick={() => setGradeClass(c)}
                          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors'
                        >
                          <BookOpen size={13} />
                          Notas
                        </button>
                        <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <button className='p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'>
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteClass(c.id)}
                            className='p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-muted transition-colors'
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Automação */}
        <TabsContent value='automacao' className='mt-4'>
          <ScheduleConfigList
            configs={configs}
            loading={loadingConfigs}
            disciplines={disciplines}
            onCreate={createConfig}
            onUpdate={updateConfig}
            onToggleActive={c => toggleActive(c.id, c.isActive)}
          />
        </TabsContent>
      </Tabs>

      {dayLessonClass && (
        <DayLessonModal
          schoolClass={dayLessonClass}
          institution={alias}
          onClose={() => setDayLessonClass(null)}
        />
      )}

      {gradeClass && (
        <ClassGradeEntryModal
          schoolClass={gradeClass}
          institution={alias}
          onClose={() => setGradeClass(null)}
        />
      )}
    </div>
  );
}
