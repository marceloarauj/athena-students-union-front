'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import Link from 'next/link';
import LoginInput from '@/features/login/components/input';
import Header from '@/components/ui/header';
import Spinner from '@/components/ui/spinner';
import LoadingContainer from '@/components/ui/loadingContainer';

export default function LoginPage() {
  return (
    <div className='w-screen h-screen'>
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

      <div className='z-2 flex relative h-screen justify-center items-center'>
        <div
          className='w-4/5 max-w-5xl grid grid-cols-1 lg:grid-cols-2 
                    rounded-md overflow-hidden border-2 border-gray-300
                    min-h-[530px]'
        >
          <section className='hidden lg:block'>
            <div className='relative w-full h-full rounded-l-md overflow-hidden'>
              <Image
                src='/images/login_bg_image.png'
                alt='Login Background'
                fill
                sizes='(max-width: 768px) 100vw'
                className='object-cover'
                priority
              />
            </div>
          </section>
          <section className='flex flex-col gap-4 justify-center items-center p-10 bg-slate-100'>
            <Header tag='h3' className='mb-10 text-center'>
              Colégio Estadual Teste
            </Header>
            <p className='text-sm text-center mb-10'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam impedit enim qui unde
              deleniti doloremque accusamus nostrum.
            </p>
            <LoginInput placeholder='Usuário' />
            <LoginInput password placeholder='Senha' />
            <Button className='tracking-wider'>LOGIN</Button>
            <Link href='#' className=' text-blue-500 hover:text-blue-800 transition duration-300'>
              Esqueceu a sua senha ?
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
