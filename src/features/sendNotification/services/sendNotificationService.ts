import { ISendNotificationService } from './sendNotificationInterface';
import { NotificationRecipient, NotificationRequest } from '../models/notificationModel';

export class SendNotificationService implements ISendNotificationService {
  async getRecipients(): Promise<NotificationRecipient[]> {
    const response = await fetch('/api/users');
    return response.json();
  }

  async send(request: NotificationRequest): Promise<void> {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  }
}
