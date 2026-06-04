import { NotificationRecipient, NotificationRequest } from '../models/notificationModel';
import { SendNotificationMockService } from './sendNotificationMockService';
import { SendNotificationService } from './sendNotificationService';
import { isMock } from '@/lib/serviceFactory';

export interface ISendNotificationService {
  getRecipients(): Promise<NotificationRecipient[]>;
  send(request: NotificationRequest): Promise<void>;
}

export function getSendNotificationService(institution: string): ISendNotificationService {
  return isMock(institution) ? new SendNotificationMockService() : new SendNotificationService();
}
