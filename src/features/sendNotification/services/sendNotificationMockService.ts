import { ISendNotificationService } from './sendNotificationInterface';
import { NotificationRecipient, NotificationRequest } from '../models/notificationModel';
import data from '@/seeds/users_data.json';

export class SendNotificationMockService implements ISendNotificationService {
  async getRecipients(): Promise<NotificationRecipient[]> {
    return (data as { id: number; name: string; email: string; role: string }[]).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }));
  }

  async send(_request: NotificationRequest): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
