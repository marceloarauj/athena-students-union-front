import Header from '@/components/layout/header/header';
import ThemeContainer from '@/components/layout/theme/themeContainer';
import { ThemeRepository } from '@/components/layout/theme/themeRepository';

export default async function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const repo = new ThemeRepository();
  const theme = await repo.getTheme();

  return (
    <div>
      <Header />
      <main>
        <ThemeContainer theme={theme}>{children}</ThemeContainer>
      </main>
    </div>
  );
}
