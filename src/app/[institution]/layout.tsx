import Header from '@/components/layout/header/header';
import InstitutionNotFound from '@/components/layout/institution-not-found/InstitutionNotFound';
import ThemeContainer from '@/components/layout/theme/themeContainer';
import { ThemeRepository } from '@/components/layout/theme/themeRepository';
import { AssistantChatGuard } from '@/features/assistant/components/AssistantChatGuard';
import { checkInstitutionExists } from '@/lib/checkInstitutionExists';
import { isMock } from '@/lib/serviceFactory';

interface InstitutionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ institution: string }>;
}

export default async function InstitutionLayout({ children, params }: InstitutionLayoutProps) {
  const { institution } = await params;

  if (!isMock(institution)) {
    const exists = await checkInstitutionExists(institution);
    if (!exists) {
      return <InstitutionNotFound institution={institution} />;
    }
  }

  const repo = new ThemeRepository();
  const theme = await repo.getTheme();

  return (
    <div>
      <Header />
      <main>
        <ThemeContainer theme={theme}>{children}</ThemeContainer>
      </main>
      <AssistantChatGuard institution={institution} />
    </div>
  );
}
