import Image from 'next/image';

export default function Background() {
  return (
    <>
      <div className='z-0 absolute w-full h-full overflow-hidden'>
        <Image
          src='/images/login_bg_image.png'
          alt='Login Background'
          fill
          className='object-cover'
          priority
        />
      </div>
      <div className='absolute z-1 inset-0 bg-black/80' />
    </>
  );
}
