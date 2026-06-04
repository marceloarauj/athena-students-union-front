'use client';

import { useEffect, useState } from 'react';
import { NotificationRecipient } from '../models/notificationModel';
import { getSendNotificationService } from '../services/sendNotificationInterface';
import { toast } from 'sonner';

export function useSendNotification(institution: string) {
  const [recipients, setRecipients] = useState<NotificationRecipient[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const service = getSendNotificationService(institution);
    service.getRecipients().then(data => {
      setRecipients(data);
      setLoading(false);
    });
  }, [institution]);

  function toggleRole(alias: string) {
    setSelectedRoles(prev =>
      prev.includes(alias) ? prev.filter(x => x !== alias) : [...prev, alias]
    );
  }

  function toggleAllRoles(allAliases: string[]) {
    setSelectedRoles(prev =>
      prev.length === allAliases.length ? [] : [...allAliases]
    );
  }

  function toggleUser(id: number) {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function toggleAllUsers() {
    setSelectedUserIds(prev =>
      prev.length === recipients.length ? [] : recipients.map(r => r.id)
    );
  }

  const targetRecipients = recipients.filter(r => selectedRoles.includes(r.role));

  async function sendNotification(title: string, message: string, mode: 'groups' | 'specific') {
    const ids = mode === 'groups'
      ? targetRecipients.map(r => r.id)
      : selectedUserIds;

    if (!title || !message || ids.length === 0) return;
    setSending(true);
    const service = getSendNotificationService(institution);
    await service.send({
      title,
      message,
      recipientIds: ids,
      roleAliases: mode === 'groups' ? selectedRoles : [],
    });
    setSending(false);
    setSelectedRoles([]);
    setSelectedUserIds([]);
    toast.success('Notificação enviada com sucesso!');
  }

  return {
    recipients,
    selectedRoles, targetRecipients, toggleRole, toggleAllRoles,
    selectedUserIds, toggleUser, toggleAllUsers,
    loading, sending,
    sendNotification,
  };
}
