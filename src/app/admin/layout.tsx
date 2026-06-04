'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, LogOut, ShieldCheck } from 'lucide-react';
import { useAdminStore } from '@/entities/adminStore';

const NAV_ITEMS = [
  { href: '/admin/institutions', label: 'Instituições', icon: Building2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, clearAdmin } = useAdminStore();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage && !admin) {
      router.replace('/admin/login');
    }
  }, [isLoginPage, admin, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!admin) return null;

  function handleLogout() {
    clearAdmin();
    router.push('/admin/login');
  }

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      <aside className='w-56 shrink-0 flex flex-col bg-slate-900 text-slate-100'>
        {/* Logo */}
        <div className='flex items-center gap-2.5 px-5 py-5 border-b border-slate-700'>
          <ShieldCheck size={20} className='text-sky-400 shrink-0' />
          <div className='min-w-0'>
            <p className='text-sm font-bold text-white leading-tight'>Athena</p>
            <p className='text-xs text-slate-400'>Administração</p>
          </div>
        </div>

        {/* Nav */}
        <nav className='flex-1 px-3 py-4 space-y-1'>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className='px-3 py-4 border-t border-slate-700 space-y-1'>
          <div className='px-3 py-2'>
            <p className='text-xs text-slate-400'>Conectado como</p>
            <p className='text-sm font-medium text-slate-200 truncate'>{admin.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors'
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className='flex-1 overflow-y-auto'>
        {children}
      </div>
    </div>
  );
}
