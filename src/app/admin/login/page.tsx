'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAdminStore } from '@/entities/adminStore';
import { getAdminService } from '@/features/admin/services/adminInterface';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdmin } = useAdminStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    const ok = await getAdminService().login(username.trim(), password);
    if (ok) {
      setAdmin({ username: username.trim() });
      router.push('/admin/institutions');
    } else {
      toast.error('Usuário ou senha inválidos.');
    }
    setLoading(false);
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-950 p-4'>
      <div className='w-full max-w-sm'>
        {/* Logo */}
        <div className='flex flex-col items-center mb-8'>
          <div className='w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center mb-4'>
            <ShieldCheck size={28} className='text-sky-400' />
          </div>
          <h1 className='text-xl font-bold text-white'>Athena Admin</h1>
          <p className='text-sm text-slate-400 mt-1'>Painel de Administração</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4'
        >
          <div>
            <label className='text-sm font-medium text-slate-300 block mb-1.5'>Usuário</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder='admin'
              autoComplete='username'
              className='w-full h-10 px-3 text-sm bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-slate-300 block mb-1.5'>Senha</label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='••••••••'
                autoComplete='current-password'
                className='w-full h-10 px-3 pr-10 text-sm bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
              />
              <button
                type='button'
                onClick={() => setShowPassword(v => !v)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors'
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading || !username.trim() || !password}
            className='w-full h-10 rounded-lg bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2'
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className='text-xs text-slate-600 text-center mt-6'>
          Área restrita — acesso somente para administradores.
        </p>
      </div>
    </div>
  );
}
