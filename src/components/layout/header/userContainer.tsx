import { ArrowBigDown, PersonStanding } from 'lucide-react';

export default function UserContainer() {
  return (
    <div className='flex bg-primary rounded-full justify-center items-center px-3 py-2 h-full space-x-4'>
      <PersonStanding className='border-r border-gray-700' />
      <span>User Name</span>
      <button>
        <ArrowBigDown />
      </button>
    </div>
  );
}
