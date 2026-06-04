export type NotificationRecipient = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type NotificationRequest = {
  title: string;
  message: string;
  recipientIds: number[];
  roleAliases: string[];
};
