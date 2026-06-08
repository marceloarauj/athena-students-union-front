'use client';

import { usePathname } from 'next/navigation';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { AssistantChat } from './AssistantChat';

interface AssistantChatGuardProps {
  institution: string;
}

const HIDDEN_ROUTES = ['/login'];

export function AssistantChatGuard({ institution }: AssistantChatGuardProps) {
  const pathname = usePathname();
  const { hasPermission } = usePermission();

  const isHidden = HIDDEN_ROUTES.some(route => pathname.endsWith(route));

  if (isHidden || !hasPermission('SHOW_IA_ASSISTANT')) return null;

  return <AssistantChat institution={institution} />;
}
