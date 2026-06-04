import Header from '@/components/layout/header/header';
import ThemeContainer from '@/components/layout/theme/themeContainer';
import { ThemeRepository } from '@/components/layout/theme/themeRepository';
import { AssistantChat } from '@/features/assistant/components/AssistantChat';

interface InstitutionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ institution: string }>;
}

export default async function InstitutionLayout({ children, params }: InstitutionLayoutProps) {
  const { institution } = await params;
  const repo = new ThemeRepository();
  const theme = await repo.getTheme();

  return (
    <div>
      <Header />
      <main>
        <ThemeContainer theme={theme}>{children}</ThemeContainer>
      </main>
      <AssistantChat institution={institution} />
    </div>
  );
}
