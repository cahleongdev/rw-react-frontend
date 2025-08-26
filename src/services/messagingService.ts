// WebSocket service for managing connections to the messaging backend

import {
  WebSocketMessage,
  MessageType,
} from '@/containers/Messaging/index.types';

// import axios from '@/api/axiosInstance';

const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;

class MessagingService {
  private accessToken: string | null = null;
  private rooms: Set<string> = new Set();
  private messageListeners: Map<
    string,
    Set<(message: WebSocketMessage) => void>
  > = new Map();
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 200; // 2 seconds

  public websocket: WebSocket | null = null;

  public connect(accessToken: string) {
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    this.accessToken = accessToken;
    this.connectWithRetry();
  }

  private connectWithRetry(): void {
    if (!this.accessToken) {
      throw new Error('Access token is required');
    }

    this.websocket = new WebSocket(
      `${wsBaseUrl}/messaging/?token=${this.accessToken}`,
    );

    this.websocket.onopen = () => {
      this.retryCount = 0;
    };

    this.websocket.onclose = () => {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        setTimeout(() => this.connectWithRetry(), this.retryDelay);
      }
    };

    this.websocket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  public async getMessages(): Promise<number> {
    // TODO: Get the number of unread messages for the current user
    // const { data: result } = await axios.get<RoomResponse[]>('/room/');

    // return result.reduce((acc, room) => acc + room.unread_count, 0);
    return 1;
  }

  // Connect to a specific room's WebSocket
  connectToRoom(
    roomId: string,
    onMessage: (message: WebSocketMessage) => void,
  ): void {
    if (!this.websocket) {
      throw new Error('Socket is not connected');
    }

    if (!this.messageListeners.has(roomId)) {
      this.messageListeners.set(roomId, new Set());
    }

    this.messageListeners.get(roomId)?.add(onMessage);

    // If already connected to this room, don't create a new connection
    if (this.rooms.has(roomId)) {
      return;
    }

    // Generate session token for security?
    this.websocket.onopen = () => {
      console.log(`Room ${roomId} WebSocket opened`);
    };

    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === MessageType.CreateRoom) {
        this.messageListeners.set(data.room.id, new Set());
        this.messageListeners.get(data.room.id)?.add(onMessage);
        this.messageListeners
          .get(data.room.id)
          ?.forEach((listener) => listener(data));
      } else {
        this.messageListeners
          .get(data.room_id)
          ?.forEach((listener) => listener(data));
      }
    };

    this.websocket.onerror = (error) => {
      console.error(`Room ${roomId} WebSocket error:`, error);
    };

    this.websocket.onclose = () => {
      console.log(`Room ${roomId} WebSocket closed`);

      // Only attempt to reconnect if we still have listeners for this room
      if (this.messageListeners.get(roomId)?.size) {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          setTimeout(() => this.connectWithRetry(), this.retryDelay);
        } else {
          this.rooms.delete(roomId);
        }
      }
    };

    this.rooms.add(roomId);
  }

  createRoom(roomId: string, userIds: string[], message: string): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      throw new Error('Socket is not connected');
    }

    this.websocket.send(`c${roomId}|${userIds.join(',')}|${message}`);
  }

  sendMessage(message: string, roomId: string): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      throw new Error('Socket is not connected');
    }

    this.websocket.send(`${roomId}|${message}`);
  }

  sendReadReceipt(messageId: string, roomId: string): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      throw new Error('Socket is not connected');
    }

    this.websocket.send(`r${messageId}|${roomId}`);
  }

  public disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  public isConnected(): boolean {
    return this.websocket?.readyState === WebSocket.OPEN;
  }
}

// Create a singleton instance
export const messagingService = new MessagingService();
