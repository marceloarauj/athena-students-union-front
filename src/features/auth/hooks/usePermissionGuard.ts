'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePermission } from './usePermission';

export function usePermissionGuard(permissionCode: string) {
  const { hasPermission } = usePermission();
  const router = useRouter();
  const params = useParams<{ institution: string }>();

  useEffect(() => {
    if (!hasPermission(permissionCode)) {
      router.replace(`/${params.institution}/forbidden`);
    }
  }, [permissionCode, hasPermission, router, params.institution]);

  return hasPermission(permissionCode);
}
