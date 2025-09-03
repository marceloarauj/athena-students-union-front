'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import Link from 'next/link';
import LoginInput from '@/features/login/components/input';
import Title from '@/components/ui/title';
import LoadingContainer from '@/components/ui/loadingContainer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Login } from '@/features/login/models/loginModel';
import { LoginService } from '@/features/login/services/loginService';
import Background from '@/features/login/components/background';
import Container from '@/features/login/components/container';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>();

  const onSubmit: SubmitHandler<Login> = async data => {
    setLoading(true);
    const service = new LoginService();
    await service.login(data);
    setLoading(false);
  };

  return (
    <div>
      <Background />
      <Container>
        <div className='hidden lg:block relative w-full h-full rounded-l-md overflow-hidden'>
          <Image
            src='/images/login_bg_image.png'
            alt='Login Background'
            fill
            sizes='(max-width: 768px) 100vw'
            className='object-cover'
            priority
          />
        </div>
        <LoadingContainer loading={loading}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-full h-full flex flex-col gap-4 justify-center items-center p-10 bg-slate-100'
          >
            <Title tag='h3' className='mb-10 text-center'>
              Colégio Estadual Teste
            </Title>
            <p className='text-sm text-center mb-10'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam impedit enim qui unde
              deleniti doloremque accusamus nostrum.
            </p>
            <LoginInput placeholder='Usuário' {...register('login', { required: true })} />
            <LoginInput
              password
              placeholder='Senha'
              {...register('password', { required: true })}
            />
            <Button className='tracking-wider' type='submit'>
              LOGIN
            </Button>
            {(errors.login || errors.password) && (
              <span className='text-danger'>Preencha todos os campos</span>
            )}
            <Link href='#' className=' text-blue-500 hover:text-blue-800 transition duration-300'>
              Esqueceu a sua senha ?
            </Link>
          </form>
        </LoadingContainer>
      </Container>
    </div>
  );
}
