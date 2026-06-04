import Image from 'next/image';
import { DisciplineTable } from './disciplineTable';
import InfoContainer from './infoContainer';
import { profileService } from '../services/profileInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

export async function PageContainer() {
  const profile = await profileService.getProfile();

  return (
    <div className='p-6 space-y-4 max-w-6xl mx-auto'>

      {/* ── Linha 1: Avatar  +  Informações Pessoais ───────── */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>

        {/* Card de perfil */}
        <Card className='overflow-hidden'>
          {/* Topo com gradiente */}
          <div className='h-24 bg-gradient-to-br from-primary/40 via-primary/15 to-transparent' />
          <CardContent className='flex flex-col items-center text-center -mt-12 pb-6 px-6'>
            <div className='w-24 h-24 rounded-full border-4 border-card shadow-lg overflow-hidden relative shrink-0'>
              <Image
                src='/images/avatar.png'
                alt={profile.FullName}
                fill
                sizes='96px'
                priority
                className='object-cover'
              />
            </div>
            <h2 className='text-lg font-bold text-foreground mt-3 leading-tight'>
              {profile.FullName}
            </h2>
            <Badge variant='default' className='mt-2'>{profile.Role}</Badge>
          </CardContent>
        </Card>

        {/* Informações pessoais */}
        <Card className='lg:col-span-2'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-x-8'>
              <InfoContainer label='Email' value={profile.Email} />
              <InfoContainer label='Telefone' value={profile.Phone} />
              <InfoContainer label='Período' value={profile.Grade} />
              <InfoContainer label='Matrícula' value={profile.Registration} />
              <InfoContainer label='Data de Nascimento' value={profile.BirthDate} />
              <InfoContainer label='Turno' value={profile.Shift} />
              <InfoContainer label='Responsável' value={profile.Guardian} />
              <InfoContainer label='Contato do responsável' value={profile.GuardianContact} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Linha 2: Notas  +  Desempenho ──────────────────── */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>

        {/* Tabela de notas */}
        <Card className='lg:col-span-2 overflow-hidden'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>Notas por Disciplina</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-auto max-h-72'>
              <DisciplineTable disciplines={profile?.disciplines ?? []} />
            </div>
          </CardContent>
        </Card>

        {/* Desempenho Acadêmico */}
        <Card className='flex flex-col'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>Desempenho Acadêmico</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-1 items-center justify-center'>
            <div className='flex flex-col items-center text-center py-6 gap-3'>
              <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
                <TrendingUp size={22} className='text-primary' />
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed max-w-[180px]'>
                Dados de desempenho serão exibidos aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
