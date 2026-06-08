'use client';

import { useRouter, useParams } from 'next/navigation';
import { ShieldOff } from 'lucide-react';

export default function ForbiddenPage() {
  const router = useRouter();
  const params = useParams<{ institution: string }>();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-6 p-8'>
      <div className='w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center'>
        <ShieldOff size={32} className='text-destructive' />
      </div>

      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold text-foreground'>Acesso Negado</h1>
        <p className='text-sm text-muted-foreground max-w-sm'>
          Você não tem permissão para acessar esta página. Entre em contato com o
          administrador da sua instituição.
        </p>
      </div>

      <button
        onClick={() => router.push(`/${params.institution}/home`)}
        className='px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'
      >
        Voltar ao início
      </button>
    </div>
  );
}
