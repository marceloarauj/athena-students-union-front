'use client';

import { useState } from 'react';
import { useInstitutionStore } from '@/entities/institution';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { useTeacher } from '@/features/teacher/hooks/useTeacher';
import { useShift } from '@/features/shift/hooks/useShift';
import { useAcademicProgram } from '@/features/academicProgram/hooks/useAcademicProgram';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { usePermissionGuard } from '@/features/auth/hooks/usePermissionGuard';
import { AppUser } from '@/features/users/models/appUserModel';
import { Teacher } from '@/features/teacher/models/teacherModel';
import { TeacherAvailabilityModal } from '@/features/teacher/components/TeacherAvailabilityModal';
import { TeacherSubjectsModal } from '@/features/teacher/components/TeacherSubjectsModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, UserPlus, CalendarDays, BookOpen } from 'lucide-react';
import { EditUserModal } from '@/features/users/components/EditUserModal';
import { CreateUserModal } from '@/features/users/components/CreateUserModal';
import { toast } from 'sonner';

const ROLE_VARIANTS: Record<string, 'default' | 'info' | 'success' | 'muted'> = {
  professor: 'default',
  funcionario: 'info',
  aluno: 'success',
  pai: 'muted',
};

export default function UsersPage() {
  const allowed = usePermissionGuard('SHOW_SCREEN_USERS');
  const { institution } = useInstitutionStore();
  const alias = institution?.alias ?? '';

  const { users, loading, deleteUser, saveUser } = useUsers(alias);
  const { roles } = useRoles(alias);
  const { teachers, createTeacher, setSubjects, setAvailability } = useTeacher(alias);
  const { shifts } = useShift(alias);
  const { programs } = useAcademicProgram(alias);
  const { hasPermission } = usePermission();

  const [filterRole, setFilterRole] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [availTarget, setAvailTarget] = useState<Teacher | null>(null);
  const [subjectsTarget, setSubjectsTarget] = useState<Teacher | null>(null);

  if (!allowed) return null;

  const filtered = users.filter(u => {
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  function getRoleName(roleAlias: string) {
    return roles.find(r => r.alias === roleAlias)?.name ?? roleAlias;
  }

  function findTeacher(user: AppUser): Teacher | undefined {
    return teachers.find(t => t.email === user.email);
  }

  async function handleActivateTeacher(user: AppUser) {
    const created = await createTeacher({ userId: String(user.id), name: user.name, email: user.email });
    toast.success('Professor ativado.');
    setAvailTarget(created);
  }

  async function handleDelete(id: number) {
    await deleteUser(id);
    toast.success('Usuário removido.');
  }

  async function handleSaveEdit(user: AppUser) {
    await saveUser(user);
    toast.success('Usuário atualizado.');
  }

  async function handleCreate(user: Omit<AppUser, 'id'>) {
    await saveUser(user);
    toast.success('Usuário cadastrado.');
  }

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Gerenciar Usuários</h1>
          <p className='text-sm text-muted-foreground mt-1'>Adicione, edite ou remova usuários da plataforma.</p>
        </div>
        {hasPermission('CREATE_USER') && (
          <button
            onClick={() => setShowCreate(true)}
            className='flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shrink-0'
          >
            <UserPlus size={16} /> Novo Usuário
          </button>
        )}
      </div>

      <div className='flex flex-col sm:flex-row gap-3'>
        <input
          type='text'
          placeholder='Buscar por nome ou e-mail...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='flex-1 h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
        />
        <div className='flex gap-2 flex-wrap'>
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterRole === 'all' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
          >
            Todos
          </button>
          {roles.map(r => (
            <button
              key={r.alias}
              onClick={() => setFilterRole(r.alias)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterRole === r.alias ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className='h-32 w-full rounded-xl' />)}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filtered.map((user: AppUser) => {
            const teacher = findTeacher(user);
            const isProfessor = user.role === 'professor';
            return (
              <Card key={user.id} className='group'>
                <CardContent className='p-4 space-y-3'>
                  <div className='flex items-start gap-3'>
                    <Avatar className='h-10 w-10 shrink-0'>
                      <AvatarFallback className='text-xs bg-primary/10 text-primary font-semibold'>
                        {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-foreground truncate'>{user.name}</p>
                      <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                      <Badge variant={ROLE_VARIANTS[user.role] ?? 'muted'} className='mt-1.5'>
                        {getRoleName(user.role)}
                      </Badge>
                    </div>
                    <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      {hasPermission('UPDATE_USER') && (
                        <button onClick={() => setEditingUser(user)} className='p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'>
                          <Pencil size={14} />
                        </button>
                      )}
                      {hasPermission('DELETE_USER') && (
                        <button onClick={() => handleDelete(user.id)} className='p-1 rounded text-muted-foreground hover:text-danger hover:bg-muted transition-colors'>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {isProfessor && hasPermission('UPDATE_USER') && (
                    <div className='flex gap-1.5 pt-1 border-t border-border'>
                      {teacher ? (
                        <>
                          <button
                            onClick={() => setAvailTarget(teacher)}
                            className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors'
                          >
                            <CalendarDays size={12} /> Disponibilidade
                          </button>
                          <button
                            onClick={() => setSubjectsTarget(teacher)}
                            className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors'
                          >
                            <BookOpen size={12} />
                            Disciplinas
                            {(teacher.subjects?.length ?? 0) > 0 && (
                              <span className='ml-0.5 text-[10px] bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center font-bold'>
                                {teacher.subjects!.length}
                              </span>
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleActivateTeacher(user)}
                          className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors'
                        >
                          + Ativar como Professor
                        </button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <p className='col-span-3 text-center text-sm text-muted-foreground py-12'>Nenhum usuário encontrado.</p>
          )}
        </div>
      )}

      {editingUser && <EditUserModal user={editingUser} roles={roles} onSave={handleSaveEdit} onClose={() => setEditingUser(null)} />}
      {showCreate && <CreateUserModal roles={roles} onSave={handleCreate} onClose={() => setShowCreate(false)} />}
      {availTarget && (
        <TeacherAvailabilityModal teacher={availTarget} shifts={shifts} onSave={setAvailability} onClose={() => setAvailTarget(null)} />
      )}
      {subjectsTarget && (
        <TeacherSubjectsModal teacher={subjectsTarget} programs={programs} institution={alias} onSave={setSubjects} onClose={() => setSubjectsTarget(null)} />
      )}
    </div>
  );
}
