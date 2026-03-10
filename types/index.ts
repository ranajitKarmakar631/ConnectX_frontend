export interface User {
  _id: string;
  email: string;
  displayName: string;
  about?: string;
  isOnline?: boolean;
  lastSeen?: string | Date;
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
  privacy?: {
    lastSeen?: string;
    profilePhoto?: string;
    about?: string;
    readReceipts?: boolean;
  };
  isActive?: boolean;
  createdAt?: string | Date;
}

export interface Message {
  _id?: string;
  id?: string | number;
  chatId: string;
  senderId: string;
  message: string;
  timestamp: string;
  createdAt?: string;
  time?: string;
}

export interface Chat {
  _id: string;
  opponentProfile: User;
  lastMessage?: Message;
}
