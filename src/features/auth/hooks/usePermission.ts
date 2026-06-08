'use client';

import { useUserStore } from '@/entities/userStore';

export function usePermission() {
  const user = useUserStore(state => state.user);
  const permissions = user?.Permissions ?? [];

  function hasPermission(code: string): boolean {
    return permissions.includes(code);
  }

  function hasAnyPermission(codes: string[]): boolean {
    return codes.some(code => permissions.includes(code));
  }

  return { hasPermission, hasAnyPermission, permissions };
}
