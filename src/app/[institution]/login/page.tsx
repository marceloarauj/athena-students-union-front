'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import Link from 'next/link';
import LoginInput from '@/features/login/components/input';
import Title from '@/components/ui/title';
import LoadingContainer from '@/components/ui/loadingContainer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginRequest } from '@/features/login/models/loginRequest';
import Background from '@/features/login/components/background';
import Container from '@/features/login/components/container';
import { useLogin } from '@/features/login/hooks/useLogin';
import { useRouter, usePathname } from 'next/navigation';
import { useInstitutionStore } from '@/entities/institution';

export default function LoginPage() {
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
    router.push(`/${institution?.alias}/profile`);
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
            <Title tag='h3' className='mb-10 text-center'>
              Colégio Estadual Teste
            </Title>
            <p className='text-sm text-center mb-10'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam impedit enim qui unde
              deleniti doloremque accusamus nostrum.
            </p>
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
            <Link href='#' className=' text-blue-500 hover:text-blue-800 transition duration-300'>
              Esqueceu a sua senha ?
            </Link>
          </form>
        </LoadingContainer>
      </Container>
    </div>
  );
}
