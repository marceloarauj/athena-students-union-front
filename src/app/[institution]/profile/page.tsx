'use client';

import Image from 'next/image';
import { BioContainer } from '@/features/profile/components/bioContainer';
import { DisciplineTable } from '@/features/profile/components/disciplineTable';
import InfoContainer from '@/features/profile/components/infoContainer';

export default function ProfilePage() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 p-4'>
      <BioContainer className='w-full'>
        <div className='flex flex-col gap-1 items-center'>
          <div className='w-1/3 aspect-square relative mt-3 border-2 rounded-full border-gray-500'>
            <Image
              src={'/images/avatar.png'}
              alt='User Name'
              fill
              sizes='300px'
              priority
              className='object-cover rounded-full'
            />
          </div>
          <span>Marcelo de Araújo Elias</span>
          <span>Estudante</span>
        </div>
      </BioContainer>
      <BioContainer className='col-span-2'>
        <div className='grid grid-cols-2 gap-y-2 gap-x-10'>
          <InfoContainer label='Email' value='marcelo@example.com' />
          <InfoContainer label='Telefone' value='(11) 98765-4321' />
          <InfoContainer label='Período' value='7º Ano' />
          <InfoContainer label='Matrícula' value='2021001234' />
          <InfoContainer label='Data de Nascimento' value='15/08/2008' />
          <InfoContainer label='Turno' value='Tarde' />
          <InfoContainer label='Responsável' value='Usuário' />
          <InfoContainer label='Contato do responsável' value='(11) 98765-4321' />
        </div>
      </BioContainer>
      <BioContainer className='h-11/12 max-h-11/12'>
        <p>Desempenho Acadêmico</p>
      </BioContainer>
      <BioContainer className='p-0 col-span-2 max-h-11/12 overflow-hidden'>
        <div className='h-full w-full overflow-auto scrollbar'>
          <div className='min-w-max w-full'>
            <DisciplineTable />
          </div>
        </div>
      </BioContainer>
    </div>
  );
}
