import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Conversation,
  User,
  Message,
  RoomResponse,
  RoomMessageResponse,
  MessageReadBy,
  FilterType,
  MessageType,
} from '@/containers/Messaging/index.types';

import axios from '@/api/axiosInstance';

import { RootState } from '@/store';

import MessageContentComponent from '@/components/Messaging/MessageContent';

import { messagingService } from '@/services/messagingService';

interface MessageContentProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  conversations: Conversation[];
  setActiveFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  selectedConversation: Conversation;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<Conversation | null>
  >;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentUserId: string;
  handleDeleteDraft: () => void;
  formatParticipantsList: (
    participants: User[],
    currentUserId: string,
  ) => string;
  allUsers: User[];
  AVATAR_COLORS: Record<string, string>;
  updateConversationId: (oldId: string, newId: string) => void;
  handleArchiveConversation: () => void;
  loading: number;
  setLoading: React.Dispatch<React.SetStateAction<number>>;
  userWebSocketMessages: (RoomMessageResponse | MessageReadBy)[];
  conversationParticipants: User[];
  setConversationParticipants: React.Dispatch<React.SetStateAction<User[]>>;
}

const MessageContent = ({
  messages,
  setMessages,
  selectedConversation,
  setSelectedConversation,
  setConversations,
  currentUserId,
  handleDeleteDraft,
  formatParticipantsList,
  allUsers,
  AVATAR_COLORS,
  updateConversationId,
  handleArchiveConversation,
  loading,
  setLoading,
  userWebSocketMessages,
  conversationParticipants,
  setConversationParticipants,
}: MessageContentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [readReceipts, setReadReceipts] = useState<Map<string, MessageReadBy>>(
    new Map(),
  );
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [messageData, setMessageData] = useState<RoomMessageResponse[]>([]);
  const [mostRecentMessageId, setMostRecentMessageId] = useState<string>();

  // Generates the messages from inital load of message Data
  const generateMessages = (messageData: RoomMessageResponse[]): Message[] => {
    const newMessages = [];
    for (const message of messageData) {
      newMessages.push({
        id: message.id,
        content: message.content,
        timestamp: new Date(message.timestamp),
        sender: {
          id: message.sender.id,
          first_name: message.sender.first_name,
          last_name: message.sender.last_name,
          color: 'blue', // Default color, you may want to get this from somewhere
          email: message.sender.email,
          title: '',
        },
      });
    }

    return newMessages;
  };

  // Generate read recepits on initial load
  const generateReadReceipts = (
    newMessageData: RoomMessageResponse[],
  ): Map<string, MessageReadBy> => {
    newMessageData.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const newReadReceipts = new Map<string, MessageReadBy>();
    // Merge all the is_read arrays into one removing empty arrays
    const allReadReceipts = newMessageData
      .map((message) => message.is_read)
      .filter((receipt) => receipt.length > 0)
      .flat();

    const mostRecentSentMessageIndex = newMessageData.findIndex(
      (message) => message.sender.id === currentUserId,
    );

    if (mostRecentSentMessageIndex !== -1) {
      const foundMostRecentMessageId =
        newMessageData[mostRecentSentMessageIndex].id;
      setMostRecentMessageId(foundMostRecentMessageId);

      // Make sure that there is a read receipt, could be a Group Chat user add message
      const message = newMessageData[mostRecentSentMessageIndex];
      if (message && 'is_read' in message && Array.isArray(message.is_read)) {
        const mostRecentReadReceipt = message.is_read.find(
          (message) => message.user.id === currentUserId,
        );

        if (mostRecentReadReceipt) {
          newReadReceipts.set(mostRecentReadReceipt.user.id, {
            id: mostRecentReadReceipt.id,
            read_at: new Date(mostRecentReadReceipt.read_at),
            message_id: mostRecentReadReceipt.message_id,
            user: {
              id: mostRecentReadReceipt.user.id,
              first_name: mostRecentReadReceipt.user.first_name,
              last_name: mostRecentReadReceipt.user.last_name,
              email: mostRecentReadReceipt.user.email,
              title: '',
            },
            room_id: mostRecentReadReceipt.room_id,
          });
        }
      }
    } else {
      // If the current user hasn't sent any message, don't put any read receipt
      return newReadReceipts;
    }

    // Only care about this users messages and the messages after that
    const slicedMessageData = newMessageData.slice(
      mostRecentSentMessageIndex,
      newMessageData.length,
    );

    // For each user, update the read receipt to the most recent message that they read but did not send
    for (const user of selectedConversation.participants.filter(
      (user) => user.id !== currentUserId,
    )) {
      // Filter messages not sent by the user
      const userReceivedMessages = slicedMessageData.filter(
        (message) => message.sender.id !== user.id,
      );

      // Filter all read receipts to only include the ones that the user did not send
      const userMostRecentReadReceipt = allReadReceipts.find((message) =>
        userReceivedMessages.some(
          (sentMessage) =>
            sentMessage.id === message.message_id &&
            message.user.id === user.id,
        ),
      );

      if (userMostRecentReadReceipt) {
        newReadReceipts.set(user.id, {
          id: userMostRecentReadReceipt.id,
          read_at: new Date(userMostRecentReadReceipt.read_at),
          message_id: userMostRecentReadReceipt.message_id,
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            title: '',
          },
          room_id: userMostRecentReadReceipt.room_id,
        });
      }
    }

    return newReadReceipts;
  };

  // Runs once on initial load
  useEffect(() => {
    if (messageData.length > 0 && !selectedConversation.isNew) {
      const newMessageData = messageData;

      const newMsgs = generateMessages(newMessageData);
      const newReadReceipts = generateReadReceipts(newMessageData);

      setMessages([...newMsgs]);
      setReadReceipts(() => new Map<string, MessageReadBy>(newReadReceipts));
    }
  }, [messageData]);

  // Runs when a new message is received from the web socket
  useEffect(() => {
    if (userWebSocketMessages.length > 0) {
      const newWebSocketMessage =
        userWebSocketMessages[userWebSocketMessages.length - 1];
      if (newWebSocketMessage.room_id !== selectedConversation.id) return;

      // If the message is a chat message
      if (newWebSocketMessage.type === MessageType.ChatMessage) {
        // Set type to RoomMessageResponse
        const newMessage = newWebSocketMessage as RoomMessageResponse;

        if (newMessage.sender.id === currentUserId) {
          setMostRecentMessageId(newMessage.id);
        }

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          let index = prevMessages.findIndex((msg) => msg.id === newMessage.id);

          if (index < 0) {
            if (newMessage.sender.id === currentUserId) {
              index = prevMessages.findIndex(
                (msg) => msg.isNew && msg.content === newMessage.content,
              );
              newMessages[index] = {
                ...newMessages[index],
                id: newMessage.id,
                timestamp: new Date(newMessage.timestamp),
                isNew: undefined,
              };
            } else {
              // Recieved Message, update the Read Receipts on backend
              newMessages.push({
                id: newMessage.id,
                content: newMessage.content,
                timestamp: new Date(newMessage.timestamp),
                sender: {
                  id: newMessage.sender.id,
                  first_name: newMessage.sender.first_name,
                  last_name: newMessage.sender.last_name,
                  color: 'blue',
                  email: newMessage.sender.email,
                  title: '',
                },
              });

              // Send a read receipt for the message
              if (
                newMessage.room_id === selectedConversation.id &&
                newMessage.sender.id !== 'System'
              ) {
                messagingService.sendReadReceipt(
                  newMessage.id,
                  selectedConversation.id,
                );
              }
            }
          } else {
            newMessages[index] = {
              ...newMessages[index],
              content: newMessage.content,
              timestamp: new Date(newMessage.timestamp),
              sender: {
                id: newMessage.sender.id,
                first_name: newMessage.sender.first_name,
                last_name: newMessage.sender.last_name,
                color: 'blue',
                email: newMessage.sender.email,
                title: '',
              },
            };
          }

          return newMessages;
        });

        setReadReceipts((prevReadReceipts) => {
          const newReadReceipts = new Map<string, MessageReadBy>(
            prevReadReceipts,
          );

          if (newMessage.sender.id !== currentUserId) {
            return prevReadReceipts;
          } else {
            // If it's the current user, update the delivery status
            newReadReceipts.set(currentUserId, {
              id: newMessage.id,
              message_id: newMessage.id,
              read_at: new Date(newMessage.timestamp),
              user: {
                id: newMessage.sender.id,
                first_name: newMessage.sender.first_name,
                last_name: newMessage.sender.last_name,
                email: newMessage.sender.email,
                title: '',
              },
              room_id: newMessage.room_id,
            });

            return newReadReceipts;
          }
        });
      } else if (newWebSocketMessage.type === MessageType.ReadReceipt) {
        setReadReceipts((prevReadReceipts) => {
          const newReadReceipt = newWebSocketMessage as MessageReadBy;
          const newReadReceipts = new Map<string, MessageReadBy>(
            prevReadReceipts,
          );

          // Check if user has exsiting read receipt
          const existingReadReceipt = newReadReceipts.get(
            newReadReceipt.user.id,
          );
          if (existingReadReceipt) {
            // But don't update past the current users' most recent sent message
            if (newReadReceipt.message_id === mostRecentMessageId) {
              newReadReceipts.set(existingReadReceipt.user.id, {
                id: newReadReceipt.id,
                message_id: newReadReceipt.message_id,
                read_at: new Date(newReadReceipt.read_at),
                user: {
                  id: newReadReceipt.user.id,
                  first_name: newReadReceipt.user.first_name,
                  last_name: newReadReceipt.user.last_name,
                  email: newReadReceipt.user.email,
                },
                room_id: newReadReceipt.room_id,
              });
            }
          } else {
            // New read receipt for the room, add it to the list
            // But only if the Current User has sent a messages
            if (mostRecentMessageId) {
              newReadReceipts.set(newReadReceipt.user.id, newReadReceipt);
            }
          }

          return new Map<string, MessageReadBy>(newReadReceipts);
        });
      }
    }
  }, [userWebSocketMessages]);

  // Updates the read receipts when a new message is added to the messages array

  const fetchMessages = async (): Promise<void> => {
    setLoading((prev) => prev + 1);
    try {
      const { data: result } = await axios.get<RoomMessageResponse[]>(
        `/room_messages/${selectedConversation.id}`,
      );
      setMessageData(result);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (selectedConversation.isNew) {
      setMessages([]);
    } else {
      fetchMessages();
    }
  }, [
    selectedConversation,
    selectedConversation.id,
    selectedConversation.isNew,
  ]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleRealMessage = async (content: string) => {
    if (selectedConversation.isNew) {
      setMessages([
        {
          id: Date.now().toString(),
          content,
          timestamp: new Date(),
          sender: {
            id: currentUserId,
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            color: 'blue',
            email: user?.email || '',
            title: '',
          },
        },
      ]);
      try {
        const { data: result } = await axios.post<RoomResponse>('/room/', {
          users: [
            currentUserId,
            ...conversationParticipants.map((participant) => participant.id),
          ],
          title: selectedConversation.title,
          message: content,
        });

        // First update the conversations list and selected conversation
        updateConversationId(selectedConversation.id, result.id);
      } catch (error) {
        console.error('Error creating room:', error);
      }
    } else {
      // Update messages state (optimistic update)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content,
          timestamp: new Date(),
          sender: {
            id: currentUserId,
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            color: 'blue',
            email: user?.email || '',
            title: '',
          },
          isNew: true,
        },
      ]);

      try {
        messagingService.sendMessage(content, selectedConversation.id);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <MessageContentComponent
      selectedConversation={selectedConversation}
      setSelectedConversation={setSelectedConversation}
      setConversations={setConversations}
      currentUserId={currentUserId}
      handleDeleteDraft={handleDeleteDraft}
      formatParticipantsList={formatParticipantsList}
      allUsers={allUsers}
      AVATAR_COLORS={AVATAR_COLORS}
      updateConversationId={updateConversationId}
      isEditingTitle={isEditingTitle}
      titleInputRef={titleInputRef}
      editedTitle={editedTitle}
      setEditedTitle={setEditedTitle}
      setIsEditingTitle={setIsEditingTitle}
      handleArchiveConversation={handleArchiveConversation}
      inputRef={inputRef}
      loading={loading}
      messages={messages}
      readReceipts={readReceipts}
      handleRealMessage={handleRealMessage}
      openVerifyModal={openVerifyModal}
      setOpenVerifyModal={setOpenVerifyModal}
      conversationParticipants={conversationParticipants}
      setConversationParticipants={setConversationParticipants}
    />
  );
};

export default MessageContent;
