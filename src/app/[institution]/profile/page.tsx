'use client';

import Image from 'next/image';
import { BioContainer } from '@/features/profile/components/bioContainer';
import { DisciplineTable } from '@/features/profile/components/disciplineTable';

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
        <p>Dados do usuário</p>
        <div className='grid grid-cols-2 gap-1'>
          <span>Email: marcelo@example.com</span>
          <span>Telefone: (11) 98765-4321</span>
          <span>Período: 7º Ano</span>
          <span>Turno: Tarde</span>
          <span>Responsável: Usuário</span>
          <span>Contato do responsável: (11) 98765-4321</span>
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
