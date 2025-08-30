import Image from 'next/image';

export default function InstitutionLogo() {
  return (
    <div className='h-full relative rounded-l-md'>
      <Image
        src='/images/logo_institution.png'
        alt='Institution Logo'
        width={180}
        height={180}
        priority
      />
    </div>
  );
}
