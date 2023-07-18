export interface Message {
  guid: string;
  message_date: string;
  sender: string;
  text: string;
}

export type UnreadEmailQuery = { unreadCount: number };

export interface Preferences {
  lookBackDays?: string;
}
