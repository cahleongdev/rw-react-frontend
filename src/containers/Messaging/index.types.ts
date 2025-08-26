// import { Tracing } from "trace_events";

import { School } from '@containers/Settings/index.types';

import { Category } from '@store/slices/categoriesSlice';

export type FilterType = 'All' | 'Unread' | 'Archived';
export enum ConversationType {
  Message = 'Message',
  Announcement = 'Announcement',
}
export enum MessageType {
  CreateRoom = 'create_room',
  ChatMessage = 'chat_message',
  ReadReceipt = 'read_receipt',
}

export type WebSocketMessage = {
  type: MessageType;
  room?: RoomResponse;
  message?: RoomMessageResponse;
  read_receipt?: MessageReadBy;
};

export type Conversation = {
  id: string;
  title: string;
  date: string;
  participants: User[];
  unreadCount: number;
  type: ConversationType;
  lastMessage: LastMessage;
  isNew?: boolean;
  archived: boolean;
  announcementCategory?: Category;
};

export type Message = {
  id: string;
  content: string;
  timestamp: Date;
  sender: User;
  isNew?: boolean;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  color: string;
  email: string;
  title?: string;
  schools?: School[];
};

export type UserResponse = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  title?: string;
  schools?: School[];
};

export type LastMessage = {
  content: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
  };
  timestamp: string;
};

export type MessageReadBy = {
  id: string;
  message_id: string;
  read_at: Date;
  user: UserResponse;
  type?: MessageType;
  room_id: string;
};

export interface RoomResponse {
  id: string;
  users: User[];
  created_at: string;
  updated_at: string;
  last_message: LastMessage;
  unread_count: number;
  archived: boolean;
  type: ConversationType;
  announcement_category: Category;
  title: string;
}

export interface RoomMessageResponse {
  id: string;
  sender_name: string;
  content: string;
  timestamp: string;
  is_read: MessageReadBy[];
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    title?: string;
  };
  file_urls: string[];
  room_id: string;
  type?: MessageType;
}
