import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function UserContainer() {
  return (
    <div className='flex border border-dark-line bg-gray-700 rounded-full items-center md:pl-3'>
      <div className='w-10 h-10 rounded-full overflow-hidden relative border border-white'>
        <Image
          src={'/images/avatar.png'}
          alt='User Name'
          fill
          sizes='200px, 200px'
          priority
          className='object-cover rounded-full'
        />
      </div>
      <div className='hidden md:block border-r-1 mx-3 border-gray-500 h-2/3' />
      <div className='hidden md:flex flex-col pr-1'>
        <span className='text-white font-bold'>Marcelo Araújo</span>
        <span className='text-primary font-bold'>Estudante</span>
      </div>
      <button className='hidden md:flex cursor-pointer justify-center items-center text-white h-full px-4'>
        <ChevronDown />
      </button>
    </div>
  );
}
