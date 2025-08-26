import axios from '@/api/axiosInstance';
import DOMPurify from 'dompurify';
import { Link, useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import {
  User,
  Conversation,
  FilterType,
  ConversationType,
  LastMessage,
  RoomMessageResponse,
  MessageReadBy,
  Message,
} from '@/containers/Messaging/index.types';
import MessageContent from '@/containers/Messaging/MessageContent';
import AnnouncementContent from '@/containers/Messaging/AnnouncementContent';

import { RootState } from '@/store';

import { Button } from '@/components/base/Button';
import { ScrollArea } from '@/components/base/ScrollArea';
import { Avatar, AvatarFallback } from '@/components/base/Avatar';
import { SearchBar } from '@/components/base/SearchBar';
import { Loading } from '@/components/base/Loading';
import FilterButtons from '@/components/Messaging/FilterButtons';

// Color mapping for avatars
const AVATAR_COLORS = {
  teal: 'text-teal-700 border-teal-500 bg-teal-50',
  blue: 'text-blue-700 border-blue-500 bg-blue-50',
  purple: 'text-purple-700 border-purple-500 bg-purple-50',
  orange: 'text-orange-700 border-orange-500 bg-orange-50',
  green: 'text-green-700 border-green-500 bg-green-50',
};

// Helper function to strip HTML tags
const stripHtml = (html: string) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Current user information
const CURRENT_USER: User = {
  id: 'current-user',
  first_name: 'John',
  last_name: 'Doe',
  color: 'green',
  email: 'john.doe@example.com',
  title: '',
  schools: [],
};

interface MessagingProps {
  conversations: Conversation[];
  filteredConversations: Conversation[];
  selectedConversation: Conversation | null;
  formatParticipantsList: (
    participants: {
      id: string;
      first_name: string;
      last_name: string;
      color: string;
    }[],
    currentUserId: string,
  ) => string;
  activeFilter: FilterType;
  setActiveFilter: Dispatch<SetStateAction<FilterType>>;
  currentUserId: string;
  setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>;
  handleDeleteDraft: () => void;
  setConversations: Dispatch<SetStateAction<Conversation[]>>;
  loading: number;
  setLoading: Dispatch<SetStateAction<number>>;
  handleNewMessage: () => void;
  handleNewAnnouncement: () => void;
  allUsers: User[];
  userWebSocketMessages: (RoomMessageResponse | MessageReadBy)[];
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  conversationParticipants: User[];
  setConversationParticipants: Dispatch<SetStateAction<User[]>>;
}

const Messaging: React.FC<MessagingProps> = ({
  conversations,
  filteredConversations,
  selectedConversation,
  formatParticipantsList,
  activeFilter,
  setActiveFilter,
  currentUserId,
  handleDeleteDraft,
  setSelectedConversation,
  setConversations,
  loading,
  setLoading,
  handleNewMessage,
  handleNewAnnouncement,
  allUsers,
  userWebSocketMessages,
  messages,
  setMessages,
  conversationParticipants,
  setConversationParticipants,
}: MessagingProps) => {
  const navigate = useNavigate();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const isAgencyUser = userRole === 'Agency_Admin';
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateConversationId = (oldId: string, newId: string) => {
    const oldConversation = conversations.find((conv) => conv.id === oldId);

    // Remove the old conversation from the conversations list
    setConversations((prev) => prev.filter((conv) => conv.id !== oldId));

    // Update selected conversation
    if (oldConversation) {
      setSelectedConversation(oldConversation);
      navigate(`/messaging/${newId}`, { replace: true });
    }
  };

  const formatLastMessage = (
    type: ConversationType,
    message: LastMessage,
  ): string => {
    const content = stripHtml(message?.content);
    if (type === ConversationType.Announcement) {
      return `${content.length > 30 ? content.substring(0, 30) + '...' : content}`;
    }

    return `${message?.sender.first_name}: ${content.length > 30 ? content.substring(0, 30) + '...' : content}`;
  };

  const handleArchiveConversation = async () => {
    if (!selectedConversation) return;

    setLoading((prev) => prev + 1);

    // Update the conversation with archived status
    const { data: archivedConversation } = await axios.post(
      `/room/${selectedConversation.id}/archive/`,
      {
        archived: !selectedConversation.archived,
      },
    );

    const updatedConversation: Conversation = {
      ...selectedConversation,
      archived: archivedConversation.archived,
    };

    // Update conversations list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation?.id ? updatedConversation : conv,
      ),
    );

    // Clear message ID from URL so it can be loaded again
    const pathWithoutLastSegment = window.location.pathname
      .split('/')
      .slice(0, -1)
      .join('/');
    window.history.pushState({}, '', pathWithoutLastSegment + '/');

    // If the number of archived conversations is 0, set the active filter to all
    if (conversations.filter((conv) => conv.archived).length === 0) {
      setActiveFilter('All');
      setSelectedConversation(conversations[0]);
    } else {
      setSelectedConversation(null);
    }

    // Update selected conversation or clear it
    setLoading((prev: number) => prev - 1);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation]);

  const announcementClass = (color: string) => {
    return `bg-${color}-400 body3-medium text-white rounded-[5px] border border-${color}-300 px-3 py-[6px]`;
  };

  const getInitials = (conversation: Conversation) => {
    // Get the initals anyone that isn't current user, preferrabley the last one to send a message
    const nonCurrentUser = conversation.participants.find(
      (user) => user.id !== currentUserId,
    );

    if (conversation.lastMessage.sender.id !== currentUserId) {
      return (
        conversation.lastMessage.sender.first_name.charAt(0) +
        conversation.lastMessage.sender.last_name.charAt(0)
      );
    }

    // If there is a non current user, return the initials

    return nonCurrentUser
      ? nonCurrentUser.first_name.charAt(0) + nonCurrentUser.last_name.charAt(0)
      : 'JD';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex py-4 px-6 border-b-[1px] border-beige-300 bg-beige-100 flex-shrink-0 items-center">
        <h3 className="text-slate-900 flex-1">Messaging</h3>
        <div className="flex gap-4">
          <Button
            className="cursor-pointer bg-blue-500 rounded-[6px] hover:bg-blue-600 active:bg-blue-700 h-[36px] p-[8px_12px]"
            onClick={handleNewMessage}
          >
            <span className="text-white button2">New Message</span>
          </Button>
          {isAgencyUser && (
            <Button
              variant="outline"
              className="cursor-pointer bg-white border-slate-300 rounded-[6px] hover:bg-slate-100 h-[36px] p-[8px_12px]"
              onClick={handleNewAnnouncement}
            >
              <span className="text-slate-700 button2">New Announcement</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-[378px] border-r-[1px] border-slate-300 bg-white h-full">
          <div className="flex flex-col gap-[10px] p-2 bg-slate-50 flex-shrink-0">
            <SearchBar placeholder="Search messages" />
            <FilterButtons
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pb-4">
              {loading ? (
                <Loading />
              ) : (
                <div className="flex flex-col">
                  {filteredConversations.map((conversation) => (
                    <Link
                      key={conversation.id}
                      className={`flex p-4 gap-4 border-t-[1px] border-b-[1px] cursor-pointer flex-col ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-blue-50 border-blue-500'
                          : 'border-slate-200'
                      }`}
                      to={`/messaging/${conversation.id}`}
                    >
                      {selectedConversation?.id === conversation.id && (
                        <div ref={scrollRef} />
                      )}
                      {conversation.type === ConversationType.Announcement &&
                        !conversation.isNew && (
                          <div className="flex justify-between">
                            <span
                              className={announcementClass(
                                conversation.announcementCategory?.color ||
                                  'blue',
                              )}
                            >
                              {conversation.announcementCategory?.name ||
                                'Announcement'}
                            </span>
                          </div>
                        )}

                      <div className="flex items-start gap-2">
                        {conversation.isNew ? (
                          <Avatar
                            className={`border w-[48px] h-[48px] ${AVATAR_COLORS[CURRENT_USER.color as keyof typeof AVATAR_COLORS]}`}
                          >
                            <AvatarFallback className="body1-medium">
                              {CURRENT_USER.first_name.charAt(0) +
                                CURRENT_USER.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar
                            className={`border w-[48px] h-[48px] ${AVATAR_COLORS[conversation.participants[0]?.color as keyof typeof AVATAR_COLORS] || AVATAR_COLORS.green}`}
                          >
                            <AvatarFallback className="body1-medium">
                              {getInitials(conversation)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col gap-[10px] w-full">
                          <div className="flex justify-between">
                            <span
                              className={`body1-medium ${conversation.isNew ? 'italic' : ''}`}
                            >
                              {conversation.title}
                            </span>
                            {conversation.unreadCount > 0 &&
                              selectedConversation?.id !== conversation.id && (
                                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                                  {conversation.unreadCount}
                                </div>
                              )}
                          </div>
                          <div className="flex justify-between">
                            <span
                              className={`body2-regular text-slate-500 ${conversation.isNew ? 'italic' : ''}`}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    formatLastMessage(
                                      conversation.type,
                                      conversation.lastMessage,
                                    ),
                                  ),
                                }}
                              />
                            </span>
                            <span className="body2-regular text-slate-500">
                              {
                                new Date(conversation.date)
                                  .toISOString()
                                  .split('T')[0]
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="h-4"></div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-white border-l-[1px] border-slate-300">
          {selectedConversation ? (
            selectedConversation.type === ConversationType.Announcement ? (
              <AnnouncementContent
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
                setConversations={setConversations}
                AVATAR_COLORS={AVATAR_COLORS}
                handleArchiveConversation={handleArchiveConversation}
                updateConversationId={updateConversationId}
              />
            ) : (
              <MessageContent
                messages={messages}
                setMessages={setMessages}
                loading={loading}
                setLoading={setLoading}
                handleArchiveConversation={handleArchiveConversation}
                conversations={conversations}
                setActiveFilter={setActiveFilter}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
                setConversations={setConversations}
                updateConversationId={updateConversationId}
                currentUserId={currentUserId}
                handleDeleteDraft={handleDeleteDraft}
                formatParticipantsList={formatParticipantsList}
                allUsers={allUsers}
                AVATAR_COLORS={AVATAR_COLORS}
                userWebSocketMessages={userWebSocketMessages}
                conversationParticipants={conversationParticipants}
                setConversationParticipants={setConversationParticipants}
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  Select a conversation
                </h3>
                <p className="text-slate-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
