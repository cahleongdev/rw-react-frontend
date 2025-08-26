import { Notification } from '@containers/Notifications/index.types';

import axios from '@/api/axiosInstance';

const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;

type NotificationCallback = (notification: Notification) => void;

class NotificationService {
  private accessToken: string | null = null;
  private receiverId: string | null = null;
  private websocket: WebSocket | null = null;
  private onNotificationCallback: NotificationCallback | null = null;
  private notifications: Notification[] = [];
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds
  private retryCount = 0;

  constructor() {
    this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this);
  }

  public connect(receiverId: string, accessToken: string): void {
    if (!receiverId || !accessToken) {
      throw new Error('Receiver ID and access token are required');
    }

    this.accessToken = accessToken;
    this.receiverId = receiverId;
    this.connectWithRetry();
  }

  private connectWithRetry(): void {
    if (!this.receiverId || !this.accessToken) {
      throw new Error('Receiver ID and access token are required');
    }

    const websocketUrl = `${wsBaseUrl}/notifications/?token=${this.accessToken}`;
    this.websocket = new WebSocket(websocketUrl);

    this.websocket.onopen = () => {
      this.retryCount = 0;
    };

    this.websocket.onmessage = this.handleWebSocketMessage;

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

  public disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  public onNotification(callback: NotificationCallback): void {
    this.onNotificationCallback = callback;
  }

  public async fetchNotifications(): Promise<void> {
    const response = await axios.get(`/notifications/list/${this.receiverId}/`);
    this.notifications = response.data.notifications;
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const notification = JSON.parse(event.data) as Notification;
      this.notifications.unshift(notification);

      if (!this.onNotificationCallback) {
        throw new Error('No onNotificationCallback set');
      }

      this.onNotificationCallback(notification);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  public isConnected(): boolean {
    return (
      this.websocket !== null && this.websocket?.readyState === WebSocket.OPEN
    );
  }

  public async markAsRead(notificationId: string): Promise<Notification[]> {
    if (!this.websocket || !this.isConnected()) {
      console.log('markAsRead: Not connected to websocket');
      return this.notifications;
    }

    this.websocket.send(`r${notificationId}`);

    this.notifications = this.notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification,
    );

    return this.notifications;
  }

  public getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  public getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Add method to clear notifications
  public clearNotifications(): void {
    this.notifications = [];
    if (this.websocket) {
      this.websocket.send('c');
    }
  }

  // Add method to remove a specific notification
  public removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(
      (n) => n.id !== notificationId,
    );

    if (this.websocket) {
      this.websocket.send(`d${notificationId}`);
    }
  }
}

// Export as singleton
export const notificationService = new NotificationService();
