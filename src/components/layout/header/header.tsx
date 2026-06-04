'use client';

import { Bell, Menu, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Drawer from '../drawer/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserStore } from '@/entities/userStore';
import { useInstitutionStore } from '@/entities/institution';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, clearUser } = useUserStore();
  const { institution } = useInstitutionStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideHeader = pathname.endsWith('/login') || pathname.includes('/login/');
  if (hideHeader) return null;

  const alias = institution?.alias ?? '';
  const initials = user ? `${user.FirstName[0] ?? ''}${user.LastName[0] ?? ''}`.toUpperCase() : 'U';

  function handleLogout() {
    clearUser();
    router.push(`/${alias}/login`);
  }

  return (
    <>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <header className='w-full h-16 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setDrawerOpen(true)}
            className='p-2 rounded-lg hover:bg-muted transition-colors text-foreground'
            aria-label='Abrir menu'
          >
            <Menu size={20} />
          </button>

          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0'>
              <Image
                src='/images/logo.png'
                alt='Logo'
                width={28}
                height={28}
                className='object-contain'
              />
            </div>
            <div className='hidden sm:flex flex-col leading-tight'>
              <span className='font-bold text-sm text-foreground'>Athena Student Union</span>
              {alias && (
                <span className='text-xs text-muted-foreground capitalize'>
                  {alias.replace(/-/g, ' ')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1'>
          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='p-2 rounded-full hover:bg-muted transition-colors text-foreground'
            aria-label='Alternar tema'
          >
            {mounted ? (
              theme === 'dark' ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className='relative p-2 rounded-full hover:bg-muted transition-colors text-foreground'
                aria-label='Notificações'
              >
                <Bell size={18} />
                <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-card' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-80'>
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='flex flex-col items-start gap-0.5 py-2 cursor-pointer'>
                <span className='font-medium text-sm'>Nova atividade submetida</span>
                <span className='text-xs text-muted-foreground'>Turma 3A - Matemática</span>
                <span className='text-xs text-muted-foreground'>Há 5 min</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex flex-col items-start gap-0.5 py-2 cursor-pointer'>
                <span className='font-medium text-sm'>Reunião de pais agendada</span>
                <span className='text-xs text-muted-foreground'>Auditório principal</span>
                <span className='text-xs text-muted-foreground'>Há 2 horas</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex flex-col items-start gap-0.5 py-2 cursor-pointer'>
                <span className='font-medium text-sm'>Pagamento processado</span>
                <span className='text-xs text-muted-foreground'>Mensalidade - Maio</span>
                <span className='text-xs text-muted-foreground'>Ontem</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30'>
                <Avatar className='h-8 w-8 border border-border'>
                  <AvatarFallback className='text-xs bg-primary/10 text-primary font-semibold'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-52'>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-0.5'>
                  <p className='text-sm font-medium'>
                    {user ? `${user.FirstName} ${user.LastName}` : 'Usuário'}
                  </p>
                  <p className='text-xs text-muted-foreground'>{user?.Email ?? ''}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => router.push(`/${alias}/profile`)}
              >
                <User className='mr-2 h-4 w-4' />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => router.push(`/${alias}/settings`)}
              >
                <Settings className='mr-2 h-4 w-4' />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='cursor-pointer text-danger focus:text-danger'
                onClick={handleLogout}
              >
                <LogOut className='mr-2 h-4 w-4' />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
