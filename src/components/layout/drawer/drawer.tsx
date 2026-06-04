'use client';

import {
  Baby,
  BookOpen,
  Building2,
  Calendar,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  HeadphonesIcon,
  Home,
  Layers,
  LogOut,
  Send,
  Settings,
  UserCircle2,
} from 'lucide-react';
import DrawerItem from './drawerItem';
import { useRouter } from 'next/navigation';
import { useInstitutionStore } from '@/entities/institution';
import { useUserStore } from '@/entities/userStore';
import Image from 'next/image';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: 'Início', path: 'home', icon: <Home size={18} /> },
  { label: 'Calendário', path: 'schedule', icon: <CalendarCheck size={18} /> },
  { label: 'Notas', path: 'grades', icon: <BookOpen size={18} /> },
  { label: 'Controle Parental', path: 'parental-control', icon: <Baby size={18} /> },
  { label: 'Pagamentos', path: 'payments', icon: <CreditCard size={18} /> },
  { label: 'Notificações', path: 'send-notification', icon: <Send size={18} /> },
  { label: 'Eventos', path: 'events', icon: <Calendar size={18} /> },
  { label: 'Disciplinas', path: 'disciplines', icon: <Layers size={18} /> },
  { label: 'Turmas', path: 'class-setup', icon: <GraduationCap size={18} /> },
  { label: 'Institucional', path: 'institucional', icon: <Building2 size={18} /> },
  { label: 'Suporte', path: 'support', icon: <HeadphonesIcon size={18} /> },
  { label: 'Usuários', path: 'users', icon: <UserCircle2 size={18} /> },
  { label: 'Configurações', path: 'settings', icon: <Settings size={18} /> },
];

export default function Drawer({ open, onClose }: DrawerProps) {
  const { institution } = useInstitutionStore();
  const { clearUser } = useUserStore();
  const router = useRouter();

  function navigateTo(path: string) {
    onClose();
    router.push(`/${institution?.alias}/${path}`);
  }

  function handleLogout() {
    onClose();
    clearUser();
    router.push(`/${institution?.alias}/login`);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border shadow-xl z-50 flex flex-col transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo area */}
        <div className='flex flex-col items-center justify-center py-6 px-4 border-b border-border gap-2'>
          <div className='w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden'>
            <Image src='/images/logo.png' alt='Logo' width={52} height={52} className='object-contain' />
          </div>
          <span className='font-bold text-sm text-foreground text-center leading-tight'>
            Athena Student Union
          </span>
          {institution?.alias && (
            <span className='text-xs text-muted-foreground text-center capitalize'>
              {institution.alias.replace(/-/g, ' ')}
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto px-3 py-4 space-y-1'>
          {NAV_ITEMS.map(item => (
            <DrawerItem
              key={item.path}
              text={item.label}
              icon={item.icon}
              onClick={() => navigateTo(item.path)}
            />
          ))}
        </nav>

        {/* Profile + Logout */}
        <div className='px-3 py-4 border-t border-border space-y-1'>
          <DrawerItem
            text='Meu Perfil'
            icon={<UserCircle2 size={18} />}
            onClick={() => navigateTo('profile')}
          />
          <DrawerItem
            text='Sair'
            icon={<LogOut size={18} />}
            onClick={handleLogout}
            danger
          />
        </div>
      </aside>
    </>
  );
}
