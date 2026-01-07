import { Suspense } from 'react';
import { SpinnerContainer } from '@/components/ui/spinner';
import { PageContainer } from '@/features/profile/components/pageContainer';

export default async function ProfilePage() {
  return (
    <Suspense fallback={<SpinnerContainer />}>
      <PageContainer />
    </Suspense>
  );
}
