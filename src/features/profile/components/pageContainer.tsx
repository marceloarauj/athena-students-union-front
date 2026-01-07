import { BioContainer } from './bioContainer';
import Image from 'next/image';
import { DisciplineTable } from './disciplineTable';
import InfoContainer from './infoContainer';
import { profileService } from '../services/profileInterface';
import Title from '@/components/ui/title';

export async function PageContainer() {
  const profile = await profileService.getProfile();

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-4'>
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
          <Title tag='h3' defaultFont>
            {profile.FullName}
          </Title>
          <Title tag='h5'>{profile.Role}</Title>
        </div>
      </BioContainer>
      <BioContainer>
        <div className='grid grid-cols-2 gap-y-4 gap-x-10'>
          <InfoContainer label='Email' value={profile.Email} />
          <InfoContainer label='Telefone' value={profile.Phone} />
          <InfoContainer label='Período' value={profile.Grade} />
          <InfoContainer label='Matrícula' value={profile.Registration} />
          <InfoContainer label='Data de Nascimento' value={profile.BirthDate} />
          <InfoContainer label='Turno' value={profile.Shift} />
          <InfoContainer label='Responsável' value={profile.Guardian} />
          <InfoContainer label='Contato do responsável' value={profile.GuardianContact} />
        </div>
      </BioContainer>
      <BioContainer className='p-0 max-h-11/12 overflow-hidden'>
        <div className='h-full w-full overflow-auto scrollbar'>
          <div className='min-w-max w-full'>
            <DisciplineTable disciplines={profile?.disciplines ?? []} />
          </div>
        </div>
      </BioContainer>
      <BioContainer className='h-11/12 max-h-11/12'>
        <Title tag='h4'>Desempenho Acadêmico</Title>
      </BioContainer>
    </div>
  );
}
