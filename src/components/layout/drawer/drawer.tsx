'use client';
import {
  CalendarCheck,
  ClipboardListIcon,
  GraduationCapIcon,
  Home,
  LogOut,
  SettingsIcon,
  UserCircle2,
  X,
} from 'lucide-react';
import DrawerItem from './drawerItem';
import { redirect } from 'next/navigation';
import { useInstitutionStore } from '@/entities/institution';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function Drawer({ open, onClose }: DrawerProps) {
  var { institution } = useInstitutionStore();

  function redirectTo(path: string) {
    onClose();
    redirect(`/${institution?.alias}/${path}`);
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-dark-line shadow-xl z-9999 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between px-6 py-4 border-b'>
          <h2 className='text-lg font-semibold'>{institution?.alias ?? 'Menu fixo'}</h2>
          <button className='cursor-pointer' onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className='flex flex-col gap-1 p-6 space-y-3'>
          <DrawerItem text='Início' onClick={() => redirectTo(``)} icon={<Home />} />
          <DrawerItem text='Perfil' onClick={() => redirectTo(`profile`)} icon={<UserCircle2 />} />
          <DrawerItem
            text='Calendário'
            onClick={() => redirectTo(`schedule`)}
            icon={<CalendarCheck />}
          />
          <DrawerItem
            text='Turmas'
            onClick={() => redirectTo(`classes`)}
            icon={<GraduationCapIcon />}
          />
          <DrawerItem
            text='Tarefas'
            onClick={() => redirectTo(`tasks`)}
            icon={<ClipboardListIcon />}
          />
          <DrawerItem
            text='Configurações'
            onClick={() => redirectTo(`settings`)}
            icon={<SettingsIcon />}
          />
          <DrawerItem text='Sair' onClick={() => redirectTo(`login`)} icon={<LogOut />} />
        </nav>
      </aside>
    </>
  );
}
