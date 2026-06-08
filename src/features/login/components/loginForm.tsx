'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import Link from 'next/link';
import LoginInput from './input';
import Title from '@/components/ui/title';
import LoadingContainer from '@/components/ui/loadingContainer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginRequest } from '../models/loginRequest';
import Background from './background';
import Container from './container';
import { useLogin } from '../hooks/useLogin';
import { useRouter, usePathname } from 'next/navigation';
import { useInstitutionStore } from '@/entities/institution';
import GoogleLoginButton from './googleLoginButton';

interface LoginFormProps {
  institutionName: string;
  logo: string;
  version: string;
}

export default function LoginForm({ institutionName, logo, version }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const { login } = useLogin();
  const router = useRouter();
  const pathname = usePathname();
  const { institution, setInstitution } = useInstitutionStore();

  useEffect(() => {
    if (institution?.alias !== pathname.split('/')[1]) {
      setInstitution({ alias: pathname.split('/')[1] });
    }
  }, [pathname, institution, setInstitution]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit: SubmitHandler<LoginRequest> = async data => {
    setLoading(true);
    await login(data);
    router.push(`/${institution?.alias}/home`);
    setLoading(false);
  };

  return (
    <div className='text-black'>
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
            <div className='w-36 h-36 mb-1 flex items-center justify-center'>
              <Image
                src={logo}
                alt={institutionName}
                width={144}
                height={144}
                className='object-contain'
              />
            </div>

            <Title tag='h3' className='text-center'>
              {institutionName}
            </Title>

            <LoginInput id='user' placeholder='Usuário' {...register('user', { required: true })} />
            <LoginInput
              id='password'
              password
              placeholder='Senha'
              {...register('password', { required: true })}
            />
            <Button id='confirm' className='tracking-wider' type='submit'>
              LOGIN
            </Button>
            {(errors.user || errors.password) && (
              <span className='text-danger'>Preencha todos os campos</span>
            )}
            <Link href='#' className='text-blue-500 hover:text-blue-800 transition duration-300'>
              Esqueceu a sua senha ?
            </Link>

            <div className='flex items-center gap-3 w-full'>
              <div className='flex-1 h-px bg-gray-300' />
              <span className='text-xs text-gray-400 font-medium'>ou</span>
              <div className='flex-1 h-px bg-gray-300' />
            </div>

            <GoogleLoginButton />

            <span className='text-xs text-gray-400 select-none'>v{version}</span>
          </form>
        </LoadingContainer>
      </Container>
    </div>
  );
}
