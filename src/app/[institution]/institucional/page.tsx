'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInstitutionStore } from '@/entities/institution';
import { usePermissionGuard } from '@/features/auth/hooks/usePermissionGuard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/* Program Edition */
import { useAcademicProgram } from '@/features/academicProgram/hooks/useAcademicProgram';
import { useProgramEditionList } from '@/features/programEdition/hooks/useProgramEdition';
import { CreateEditionModal } from '@/features/programEdition/components/CreateEditionModal';
import { EditionStatusBadge } from '@/features/programEdition/components/EditionStatusBadge';
import { AcademicProgram, PROGRAM_TYPE_LABELS, PERIOD_TYPE_LABELS } from '@/features/academicProgram/models/academicProgramModel';
import { AcademicProgramModal } from '@/features/academicProgram/components/AcademicProgramModal';
import { SubjectModal } from '@/features/subject/components/SubjectModal';
import { useSubject } from '@/features/subject/hooks/useSubject';

/* Room */
import { useRoom } from '@/features/room/hooks/useRoom';
import { RoomModal } from '@/features/room/components/RoomModal';

/* Shift */
import { useShift } from '@/features/shift/hooks/useShift';
import { ShiftModal } from '@/features/shift/components/ShiftModal';
import { SlotModal } from '@/features/shift/components/SlotModal';
import { Shift } from '@/features/shift/models/shiftModel';

/* Holiday */
import { useHoliday } from '@/features/holiday/hooks/useHoliday';
import { HolidayModal } from '@/features/holiday/components/HolidayModal';
import { HOLIDAY_TYPE_LABELS, HolidayType } from '@/features/holiday/models/holidayModel';

import { Skeleton } from '@/components/ui/skeleton';
import {
  CalendarDays, Plus, ChevronRight, GraduationCap, BookOpen,
  DoorOpen, FlaskConical, Users, Clock, CalendarX, Trash2,
  RefreshCw, ChevronDown, ChevronRight as ChevronR,
} from 'lucide-react';

const TYPE_COLORS: Record<number, string> = {
  1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  3: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

const HOLIDAY_COLORS: Record<HolidayType, string> = {
  1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  3: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function InstitucionalPage() {
  const allowed = usePermissionGuard('SHOW_SCREEN_INSTITUTIONAL');
  const { institution } = useInstitutionStore();
  const alias = institution?.alias ?? '';
  const router = useRouter();

  if (!allowed) return null;

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-5'>
      <div>
        <h1 className='text-2xl font-bold'>Institucional</h1>
        <p className='text-sm text-muted-foreground mt-1'>Gestão de programas, ano letivo, infraestrutura e calendário.</p>
      </div>

      <Tabs defaultValue='ano-letivo'>
        <TabsList className='flex-wrap h-auto gap-1'>
          <TabsTrigger value='ano-letivo'>Ano Letivo</TabsTrigger>
          <TabsTrigger value='programas'>Programas</TabsTrigger>
          <TabsTrigger value='salas'>Salas</TabsTrigger>
          <TabsTrigger value='turnos'>Turnos</TabsTrigger>
          <TabsTrigger value='feriados'>Feriados</TabsTrigger>
        </TabsList>

        <TabsContent value='ano-letivo' className='mt-4'>
          <AnoLetivoTab alias={alias} onGoToEdition={id => router.push(`/${alias}/program-edition/${id}`)} />
        </TabsContent>

        <TabsContent value='programas' className='mt-4'>
          <ProgramasTab alias={alias} />
        </TabsContent>

        <TabsContent value='salas' className='mt-4'>
          <SalasTab alias={alias} />
        </TabsContent>

        <TabsContent value='turnos' className='mt-4'>
          <TurnosTab alias={alias} />
        </TabsContent>

        <TabsContent value='feriados' className='mt-4'>
          <FeriadosTab alias={alias} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── Ano Letivo Tab ─── */
function AnoLetivoTab({ alias, onGoToEdition }: { alias: string; onGoToEdition: (id: string) => void }) {
  const { programs, loading: loadingPrograms } = useAcademicProgram(alias);
  const [selectedProgram, setSelectedProgram] = useState<AcademicProgram | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { editions, loading: loadingEditions, createEdition } = useProgramEditionList(
    alias,
    selectedProgram?.id ?? ''
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>Selecione um programa para ver suas edições</p>
        {selectedProgram && (
          <button onClick={() => setShowCreate(true)}
            className='flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'>
            <Plus size={14} /> Nova Edição
          </button>
        )}
      </div>

      {loadingPrograms ? (
        <div className='flex gap-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-9 w-32 rounded-xl' />)}</div>
      ) : programs.length === 0 ? (
        <p className='text-sm text-muted-foreground py-8 text-center'>Nenhum programa acadêmico cadastrado. Crie um na aba "Programas".</p>
      ) : (
        <div className='flex flex-wrap gap-2'>
          {programs.map(p => (
            <button key={p.id} onClick={() => setSelectedProgram(p)}
              className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${selectedProgram?.id === p.id ? 'bg-primary text-white border-primary' : 'bg-card border-border hover:bg-muted'}`}>
              {p.name}
              <span className={`ml-1.5 text-xs opacity-70 ${selectedProgram?.id === p.id ? 'text-white' : 'text-muted-foreground'}`}>
                {PROGRAM_TYPE_LABELS[p.type]}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedProgram && (
        <>
          {loadingEditions ? (
            <div className='space-y-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-16 rounded-xl' />)}</div>
          ) : editions.length === 0 ? (
            <div className='text-center py-10 bg-card border border-dashed border-border rounded-xl text-muted-foreground'>
              <CalendarDays size={28} className='mx-auto mb-2 opacity-40' />
              <p className='text-sm'>Nenhuma edição criada para {selectedProgram.name}.</p>
              <button onClick={() => setShowCreate(true)} className='mt-2 text-primary text-sm hover:underline'>Criar primeira edição →</button>
            </div>
          ) : (
            <div className='space-y-2'>
              {editions.map(e => (
                <button key={e.id} onClick={() => onGoToEdition(e.id)}
                  className='w-full bg-card border border-border rounded-xl p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors group'>
                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-semibold text-sm'>{e.name}</p>
                      <EditionStatusBadge status={e.status} />
                    </div>
                    <p className='text-xs text-muted-foreground'>{e.startDate} → {e.endDate}</p>
                  </div>
                  <ChevronRight size={16} className='text-muted-foreground group-hover:text-foreground transition-colors' />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {showCreate && (
        <CreateEditionModal programs={programs} onSave={createEdition} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

/* ─── Programas Tab ─── */
function ProgramasTab({ alias }: { alias: string }) {
  const { programs, loading, createProgram } = useAcademicProgram(alias);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>{programs.length} programa(s)</p>
        <button onClick={() => setShowModal(true)}
          className='flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'>
          <Plus size={14} /> Novo Programa
        </button>
      </div>

      {loading ? (
        <div className='space-y-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-16 rounded-xl' />)}</div>
      ) : programs.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <GraduationCap size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Nenhum programa cadastrado.</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {programs.map(p => (
            <ProgramCard key={p.id} program={p} alias={alias} expanded={expanded === p.id} onToggle={() => setExpanded(v => v === p.id ? null : p.id)} />
          ))}
        </div>
      )}

      {showModal && <AcademicProgramModal onSave={createProgram} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function ProgramCard({ program, alias, expanded, onToggle }: { program: AcademicProgram; alias: string; expanded: boolean; onToggle: () => void }) {
  const { subjects, loading: loadingSubj, createSubject } = useSubject(alias, expanded ? program.id : '');
  const [showSubjModal, setShowSubjModal] = useState(false);

  return (
    <div className='bg-card border border-border rounded-xl overflow-hidden'>
      <button onClick={onToggle} className='w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center'>
            <GraduationCap size={16} className='text-primary' />
          </div>
          <div>
            <p className='font-semibold text-sm'>{program.name}</p>
            <div className='flex items-center gap-2 mt-0.5'>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${TYPE_COLORS[program.type]}`}>
                {PROGRAM_TYPE_LABELS[program.type]}
              </span>
              <span className='text-xs text-muted-foreground'>{PERIOD_TYPE_LABELS[program.periodType]} · {program.durationYears} ano(s)</span>
            </div>
          </div>
        </div>
        {expanded ? <ChevronDown size={15} className='text-muted-foreground' /> : <ChevronR size={15} className='text-muted-foreground' />}
      </button>

      {expanded && (
        <div className='px-4 pb-4 border-t border-border'>
          <div className='flex items-center justify-between py-2'>
            <p className='text-xs font-medium flex items-center gap-1.5 text-muted-foreground'><BookOpen size={12} /> Matérias</p>
            <button onClick={() => setShowSubjModal(true)} className='flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-border hover:bg-muted transition-colors'>
              <Plus size={11} /> Adicionar
            </button>
          </div>
          {loadingSubj ? (
            <div className='flex gap-1.5'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-6 w-20 rounded-full' />)}</div>
          ) : subjects.length === 0 ? (
            <p className='text-xs text-muted-foreground'>Nenhuma matéria.</p>
          ) : (
            <div className='flex flex-wrap gap-1.5'>
              {subjects.map(s => (
                <span key={s.id} className='inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full'>
                  <span className='font-mono text-primary font-medium text-[10px]'>{s.code}</span>
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {showSubjModal && (
        <SubjectModal programId={program.id} onSave={createSubject} onClose={() => setShowSubjModal(false)} />
      )}
    </div>
  );
}

/* ─── Salas Tab ─── */
function SalasTab({ alias }: { alias: string }) {
  const { rooms, loading, createRoom } = useRoom(alias);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-4 text-xs text-muted-foreground'>
          <span>{rooms.length} salas</span>
          <span>{rooms.filter(r => r.hasLab).length} labs</span>
          <span>{rooms.reduce((s, r) => s + r.capacity, 0)} vagas totais</span>
        </div>
        <button onClick={() => setShowModal(true)}
          className='flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'>
          <Plus size={14} /> Nova Sala
        </button>
      </div>

      {loading ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>{[1, 2, 3, 4].map(i => <Skeleton key={i} className='h-20 rounded-xl' />)}</div>
      ) : rooms.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <DoorOpen size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Nenhuma sala cadastrada.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {rooms.map(r => (
            <div key={r.id} className='bg-card border border-border rounded-xl p-4 flex items-center gap-3'>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${r.hasLab ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-primary/10'}`}>
                {r.hasLab ? <FlaskConical size={16} className='text-purple-600 dark:text-purple-400' /> : <DoorOpen size={16} className='text-primary' />}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-sm'>{r.name}</p>
                <div className='flex items-center gap-2 mt-0.5 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'><Users size={10} /> {r.capacity}</span>
                  {r.hasLab && <span className='text-purple-600 dark:text-purple-400'>Lab</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <RoomModal onSave={createRoom} onClose={() => setShowModal(false)} />}
    </div>
  );
}

/* ─── Turnos Tab ─── */
function TurnosTab({ alias }: { alias: string }) {
  const { shifts, loading, createShift, addSlot } = useShift(alias);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [slotTarget, setSlotTarget] = useState<Shift | null>(null);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>{shifts.length} turno(s)</p>
        <button onClick={() => setShowModal(true)}
          className='flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'>
          <Plus size={14} /> Novo Turno
        </button>
      </div>

      {loading ? (
        <div className='space-y-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-16 rounded-xl' />)}</div>
      ) : shifts.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <Clock size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Nenhum turno cadastrado.</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {shifts.map(s => (
            <div key={s.id} className='bg-card border border-border rounded-xl overflow-hidden'>
              <button onClick={() => setExpanded(v => v === s.id ? null : s.id)}
                className='w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <Clock size={16} className='text-primary' />
                  </div>
                  <div>
                    <p className='font-semibold text-sm'>{s.name}</p>
                    <p className='text-xs text-muted-foreground'>{s.startTime} – {s.endTime} · {s.slots?.length ?? 0} horário(s)</p>
                  </div>
                </div>
                {expanded === s.id ? <ChevronDown size={15} className='text-muted-foreground' /> : <ChevronR size={15} className='text-muted-foreground' />}
              </button>

              {expanded === s.id && (
                <div className='px-4 pb-4 border-t border-border'>
                  <div className='flex items-center justify-between py-2'>
                    <p className='text-xs font-medium text-muted-foreground'>Horários</p>
                    <button onClick={() => setSlotTarget(s)} className='flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-border hover:bg-muted transition-colors'>
                      <Plus size={11} /> Adicionar
                    </button>
                  </div>
                  {(s.slots ?? []).length === 0 ? (
                    <p className='text-xs text-muted-foreground'>Nenhum horário.</p>
                  ) : (
                    <div className='space-y-1.5'>
                      {(s.slots ?? []).sort((a, b) => a.order - b.order).map(slot => (
                        <div key={slot.id} className='flex items-center gap-3 bg-muted rounded-lg px-3 py-2 text-sm'>
                          <span className='text-xs font-bold text-muted-foreground w-5'>#{slot.order}</span>
                          <span className='font-medium'>{slot.startTime}</span>
                          <span className='text-muted-foreground'>→</span>
                          <span className='font-medium'>{slot.endTime}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && <ShiftModal onSave={createShift} onClose={() => setShowModal(false)} />}
      {slotTarget && (
        <SlotModal shiftId={slotTarget.id} nextOrder={(slotTarget.slots?.length ?? 0) + 1} onSave={addSlot} onClose={() => setSlotTarget(null)} />
      )}
    </div>
  );
}

/* ─── Feriados Tab ─── */
function FeriadosTab({ alias }: { alias: string }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { holidays, loading, createHoliday, deleteHoliday } = useHoliday(alias, year);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <button onClick={() => setYear(y => y - 1)} className='p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-xs'>‹</button>
          <span className='px-3 py-1.5 border border-border rounded-lg text-sm font-medium bg-card'>{year}</span>
          <button onClick={() => setYear(y => y + 1)} className='p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-xs'>›</button>
          <span className='text-xs text-muted-foreground ml-1'>{holidays.length} feriado(s)</span>
        </div>
        <button onClick={() => setShowModal(true)}
          className='flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'>
          <Plus size={14} /> Novo Feriado
        </button>
      </div>

      {loading ? (
        <div className='space-y-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-12 rounded-xl' />)}</div>
      ) : holidays.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <CalendarX size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Nenhum feriado em {year}.</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {holidays.sort((a, b) => a.date.localeCompare(b.date)).map(h => (
            <div key={h.id} className='bg-card border border-border rounded-xl p-3 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='text-center min-w-[44px]'>
                  <p className='text-[10px] text-muted-foreground'>{new Date(h.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' })}</p>
                  <p className='text-lg font-bold leading-tight'>{new Date(h.date + 'T12:00:00').getDate()}</p>
                </div>
                <div>
                  <p className='font-medium text-sm'>{h.name}</p>
                  <div className='flex items-center gap-2 mt-0.5'>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${HOLIDAY_COLORS[h.type]}`}>
                      {HOLIDAY_TYPE_LABELS[h.type]}
                    </span>
                    {h.isRecurring && <span className='flex items-center gap-1 text-xs text-muted-foreground'><RefreshCw size={10} /> Recorrente</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteHoliday(h.id)} className='p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-muted transition-colors'>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && <HolidayModal onSave={createHoliday} onClose={() => setShowModal(false)} />}
    </div>
  );
}
