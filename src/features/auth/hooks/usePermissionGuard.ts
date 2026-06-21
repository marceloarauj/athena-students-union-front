'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePermission } from './usePermission';
import { useUserStore } from '@/entities/userStore';

export function usePermissionGuard(permissionCode: string) {
  const { hasPermission } = usePermission();
  const router = useRouter();
  const params = useParams<{ institution: string }>();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useUserStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useUserStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!hasPermission(permissionCode)) {
      router.replace(`/${params.institution}/forbidden`);
    }
  }, [permissionCode, hasPermission, router, params.institution, hydrated]);

  if (!hydrated) return true;
  return hasPermission(permissionCode);
}
