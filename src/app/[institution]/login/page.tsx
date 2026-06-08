import { ThemeRepository } from '@/components/layout/theme/themeRepository';
import LoginForm from '@/features/login/components/loginForm';

export default async function LoginPage() {
  const repo = new ThemeRepository();
  const theme = await repo.getTheme();

  return (
    <LoginForm
      institutionName={theme.name ?? 'Athena Student Union'}
      logo={theme.logo ?? '/images/logo.png'}
      version={process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0'}
    />
  );
}
