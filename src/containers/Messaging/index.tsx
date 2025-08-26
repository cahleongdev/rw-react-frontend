import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import {
  FilterType,
  User,
  Conversation,
  UserResponse,
  RoomMessageResponse,
  RoomResponse,
  MessageReadBy,
  ConversationType,
  WebSocketMessage,
  MessageType,
  Message,
} from '@/containers/Messaging/index.types';

import axios from '@/api/axiosInstance';

import { RootState } from '@/store';

import MessagingComponent from '@/components/Messaging';

import { messagingService } from '@/services/messagingService';

// Function to generate the full conversation objects with lastMessage derived from messages
const generateConversations = (roomData: RoomResponse[]): Conversation[] => {
  const conversations = roomData.map((room: RoomResponse) => {
    const participants = room.users.map((user) => ({
      color: 'blue' as const,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      schools: user?.schools,
      title: user.title || '',
    }));

    const newConversation: Conversation = {
      id: room.id,
      title:
        room.title || room.users.map((user) => user.first_name).join(' & '),
      date: room.updated_at,
      participants: participants,
      unreadCount: room.unread_count,
      type: room.type,
      lastMessage: room.last_message,
      archived: room.archived,
      announcementCategory: room.announcement_category,
    };

    return newConversation;
  });

  conversations.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return conversations;
};

// Current user information
const CURRENT_USER: User = {
  id: 'current-user',
  first_name: 'John',
  last_name: 'Doe',
  color: 'green',
  email: 'john.doe@example.com',
  title: '',
};

const Messaging = () => {
  const navigate = useNavigate();
  const { conversation_id } = useParams<{ conversation_id: string }>();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(0);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);

  // const [isConnected, setIsConnected] = useState(true);
  // const [pendingMessages, setPendingMessages] = useState<{[roomId: string]: Message[]}>({});

  const [userWebSocketMessages, setUserWebSocketMessages] = useState<
    (RoomMessageResponse | MessageReadBy)[]
  >([]);
  const [conversationParticipants, setConversationParticipants] = useState<
    User[]
  >([]);

  // Current user ID (would normally come from auth)
  const user = useSelector((state: RootState) => state.auth.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUserId = user?.id || '';
  const { accessToken } = useSelector((state: RootState) => state.auth);

  if (accessToken && !messagingService.isConnected()) {
    messagingService.connect(accessToken);
  }

  const fetchRooms = async (): Promise<void> => {
    if (!accessToken) return;

    try {
      const { data: result } = await axios.get<RoomResponse[]>('/room/');
      result.map((room) =>
        messagingService.connectToRoom(
          room.id,
          (incomingMessage: WebSocketMessage) => {
            if (incomingMessage.type === MessageType.CreateRoom) {
              // Add new room to converstaion list
              setConversations((prevConversations) => {
                const room = incomingMessage.room as unknown as RoomResponse;
                const newConversations = [...prevConversations];
                // if it exists, update it
                const index = newConversations.findIndex(
                  (conv) => conv.id === room.id,
                );
                if (index !== -1) {
                  newConversations[index] = {
                    ...newConversations[index],
                    ...room,
                  };
                } else {
                  newConversations.unshift({
                    id: room.id,
                    title: room.title,
                    participants: room.users,
                    type: room.type,
                    date: room.updated_at,
                    unreadCount: room.unread_count,
                    lastMessage: room.last_message,
                    archived: room.archived,
                    announcementCategory: room.announcement_category,
                  });
                }

                return newConversations;
              });
            } else if (incomingMessage.type === MessageType.ChatMessage) {
              setConversations((prevConversations) => {
                const message = incomingMessage as RoomMessageResponse;
                const newConversations = [...prevConversations];
                const index = prevConversations.findIndex(
                  (conv) => conv.id === message.room_id,
                );
                if (index < 0) {
                  return prevConversations;
                }

                newConversations[index].date = message.timestamp;
                newConversations[index].lastMessage = {
                  content: message.content,
                  sender: {
                    id: message.sender.id,
                    first_name: message.sender.first_name,
                    last_name: message.sender.last_name,
                  },
                  timestamp: message.timestamp,
                };
                ++newConversations[index].unreadCount;
                return newConversations;
              });

              setUserWebSocketMessages((prevMessages) => {
                const message = incomingMessage as RoomMessageResponse;
                if (Array.isArray(prevMessages)) {
                  return [...prevMessages, message];
                } else {
                  return [message];
                }
              });
            } else if (incomingMessage.type === MessageType.ReadReceipt) {
              setUserWebSocketMessages((prevMessages) => {
                const message = incomingMessage as MessageReadBy;
                if (Array.isArray(prevMessages)) {
                  return [...prevMessages, message];
                } else {
                  return [message];
                }
              });
            }
          },
        ),
      );

      setConversations(generateConversations(result));
    } catch (error) {
      console.error('Error fetching rooms', error);
    }
  };

  const fetchUsers = async (): Promise<void> => {
    if (!accessToken) return;

    setLoading((prevLoading) => prevLoading + 1);
    try {
      const { data: result } = await axios.get<UserResponse[]>(
        '/users/message_users/',
      );

      const users = result.map((user) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        color: 'blue',
        email: user.email,
        title: user.title || '',
        schools: user.schools,
      }));
      setAllUsers(users);
    } catch (error: unknown) {
      console.error('Error fetching users', typeof error, error);
    } finally {
      setLoading((prevLoading) => prevLoading - 1);
    }
  };

  const initalLoad = async () => {
    setLoading((prevLoading) => prevLoading + 1);

    await fetchRooms();
    await fetchUsers();

    setLoading((prevLoading) => prevLoading - 1);
  };

  useEffect(() => {
    if (!conversation_id) {
      return;
    }
    const conversation = conversations.find(
      (conv) => conv.id === conversation_id,
    );

    if (!conversation) return;

    setSelectedConversation(conversation);

    // Only mark as read if it's not a draft conversation
    if (!conversation.isNew) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversation_id ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    }
  }, [conversations.length, conversation_id]);

  useEffect(() => {
    initalLoad();
  }, []);

  useEffect(() => {
    const filteredConversations =
      activeFilter === 'All'
        ? conversations.filter((conv) => !conv.archived)
        : conversations.filter((conv) => {
            if (activeFilter === 'Unread') return conv.unreadCount > 0;
            if (activeFilter === 'Archived') return conv.archived;
            return true;
          });

    setFilteredConversations(filteredConversations);
  }, [activeFilter, conversations]);

  // Format participants list with "You" at the end
  const formatParticipantsList = (
    participants: {
      id: string;
      first_name: string;
      last_name: string;
      color: string;
    }[],
    currentUserId: string,
  ) => {
    if (!participants || participants.length === 0) return '';

    const names = participants
      .filter((user) => user.id !== currentUserId)
      .map((p) => `${p.first_name} ${p.last_name}`);
    return [...names, 'You'].join(' & ');
  };

  const handleNewMessage = () => {
    // Create a temporary conversation for the new message
    const newConversationId = uuidv4();

    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Message',
      lastMessage: {
        content: 'Editing now',
        sender: user || {
          id: 'current-user',
          first_name: 'John',
          last_name: 'Doe',
        },
        timestamp: new Date().toISOString(),
      },
      date: new Date()
        .toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        })
        .replace(/\//g, '-'),
      participants: [], // Empty participants initially
      unreadCount: 0,
      type: ConversationType.Message,
      isNew: true, // Add this flag to identify new conversations
      archived: false,
    };

    // Add to conversations state at the beginning of the array
    setConversations((prev) => [newConversation, ...prev]);

    // Select the new conversation
    setSelectedConversation(newConversation);
    navigate(`/messaging/${newConversationId}`, { replace: true });
    setMessages([]);
    setConversationParticipants([]);
  };

  // Add a function to delete a draft conversation
  const handleDeleteDraft = () => {
    if (!selectedConversation?.isNew) return;

    // Remove the conversation from state
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== selectedConversation.id),
    );

    // Clear selected conversation
    setSelectedConversation(null);
  };

  const handleNewAnnouncement = () => {
    // Create a temporary conversation for the new announcement
    const newAnnouncementId = uuidv4();

    const newAnnouncement: Conversation = {
      id: newAnnouncementId,
      title: 'New Announcement',
      lastMessage: {
        content: 'Editing now',
        sender: {
          id: 'current-user',
          first_name: 'John',
          last_name: 'Doe',
        },
        timestamp: new Date().toISOString(),
      },
      date: new Date()
        .toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        })
        .replace(/\//g, '-'),
      participants: [CURRENT_USER], // Set current user as the creator
      unreadCount: 0,
      type: ConversationType.Announcement,
      isNew: true, // Flag to identify new announcements
      archived: false,
    };

    // Add to conversations state at the beginning of the array
    setConversations((prev) => [newAnnouncement, ...prev]);

    // Select the new announcement
    setSelectedConversation(newAnnouncement);
    navigate(`/messaging/${newAnnouncementId}`, { replace: true });
  };

  console.log('loading value:', loading);

  return (
    <MessagingComponent
      conversations={conversations}
      filteredConversations={filteredConversations}
      selectedConversation={selectedConversation}
      formatParticipantsList={formatParticipantsList}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      currentUserId={currentUserId}
      handleDeleteDraft={handleDeleteDraft}
      setSelectedConversation={setSelectedConversation}
      setConversations={setConversations}
      loading={loading}
      setLoading={setLoading}
      handleNewMessage={handleNewMessage}
      handleNewAnnouncement={handleNewAnnouncement}
      allUsers={allUsers}
      userWebSocketMessages={userWebSocketMessages}
      messages={messages}
      setMessages={setMessages}
      conversationParticipants={conversationParticipants}
      setConversationParticipants={setConversationParticipants}
    />
  );
};

export default Messaging;
