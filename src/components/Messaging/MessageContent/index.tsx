import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  PencilIcon,
  ArchiveBoxArrowDownIcon,
  UserPlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';

import {
  Conversation,
  User,
  Message,
  MessageReadBy,
} from '@/containers/Messaging/index.types';

import axios from '@/api/axiosInstance';

import { RootState } from '@/store';

import { Button } from '@/components/base/Button';
import { MessageButton } from '@/components/base/MessageButton';
import { Avatar, AvatarFallback } from '@/components/base/Avatar';
import { ScrollArea } from '@/components/base/ScrollArea';
import { UserDropdown } from '@/components/base/UserDropdown';
import { Loading } from '@/components/base/Loading';
import MessageThread from '@/components/Messaging/MessageThread';
import ChatMessageInput from '@/components/Messaging/ChatMessageInput';
import MessageDownloadButton from '@/components/Messaging/MessageDownloadButton';
import AddUserVerify from '@/components/Messaging/AddUserVerify';

interface MessageContentProps {
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
  isEditingTitle: boolean;
  titleInputRef: React.RefObject<HTMLInputElement>;
  editedTitle: string;
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>;
  setIsEditingTitle: React.Dispatch<React.SetStateAction<boolean>>;
  handleArchiveConversation: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  loading: number;
  messages: Message[];
  handleRealMessage: (message: string) => void;
  openVerifyModal: boolean;
  setOpenVerifyModal: React.Dispatch<React.SetStateAction<boolean>>;
  readReceipts: Map<string, MessageReadBy>;
  conversationParticipants: User[];
  setConversationParticipants: React.Dispatch<React.SetStateAction<User[]>>;
}

const MessageContent = ({
  selectedConversation,
  setSelectedConversation,
  setConversations,
  currentUserId,
  handleDeleteDraft,
  formatParticipantsList,
  allUsers,
  AVATAR_COLORS,
  isEditingTitle,
  titleInputRef,
  editedTitle,
  setEditedTitle,
  setIsEditingTitle,
  handleArchiveConversation,
  inputRef,
  loading,
  messages,
  handleRealMessage,
  openVerifyModal,
  setOpenVerifyModal,
  readReceipts,
  conversationParticipants,
  setConversationParticipants,
}: MessageContentProps) => {
  const { userRole, agency } = useSelector((state: RootState) => ({
    userRole: state.auth.user?.role,
    agency: state.agency.agency,
  }));

  const [userToAdd, setUserToAdd] = useState<User | null>(null);
  const [showUserPlusDropdown, setShowUserPlusDropdown] = useState(false);
  const [recipientSearchText, setRecipientSearchText] = useState('');
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [userPlusSearchText, setUserPlusSearchText] = useState('');
  const blurTimeoutRef = useRef<NodeJS.Timeout>();

  // Add this function to get filtered users for the dropdown
  const getFilteredUsers = () => {
    // Mock users - replace with your actual user data source

    // Filter out users that are already selected
    let selectedIds: string[] = [];
    if (!selectedConversation?.isNew) {
      selectedIds = selectedConversation?.participants.map((p) => p.id) || [];
      return allUsers.filter((user) => !selectedIds.includes(user.id));
    } else {
      selectedIds = conversationParticipants.map((p) => p.id) || [];
    }
    return allUsers.filter((user) => !selectedIds.includes(user.id));
  };

  useEffect(() => {
    if (!openVerifyModal) {
      setUserToAdd(null);
    }
  }, [openVerifyModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Get reference to the dropdown and button
      const dropdown = document.querySelector('[data-userplus-dropdown]');
      const button = document.querySelector('[data-userplus-button]');
      const searchInput = document.querySelector('[data-userplus-search]');

      // Only close if clicking outside both the dropdown and button, and not on the search input
      if (
        showUserPlusDropdown &&
        dropdown &&
        button &&
        !dropdown.contains(event.target as Node) &&
        !button.contains(event.target as Node) &&
        !searchInput?.contains(event.target as Node) &&
        event.type === 'mousedown' && // Only handle actual mouse clicks
        event.button === 0 // Only handle left mouse button
      ) {
        setShowUserPlusDropdown(false);
      }
    };

    // Add a keyboard event listener to prevent closing on space
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' && showUserPlusDropdown) {
        event.preventDefault();
        setUserPlusSearchText((prev) => prev + ' ');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserPlusDropdown]);

  const checkIfFromDifferentSchool = (user: User) => {
    if (selectedConversation.participants.length === 0) {
      return false;
    }

    // Get all school IDs from current participants
    const allSchoolIds = selectedConversation.participants
      .map(
        (participant) => participant.schools?.map((school) => school.id) || [],
      )
      .flat();
    // Create a set of unique school IDs
    const uniqueSchoolIds = new Set(allSchoolIds);

    // Check if the user has any school IDs not in the unique set
    const isFromDifferentSchool = user.schools?.some(
      (school) => !uniqueSchoolIds.has(school.id),
    );

    return isFromDifferentSchool;
  };

  const addUserToConversation = async (user: User) => {
    // Clear any pending blur timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    // Check if the user is from a different school
    if (!userToAdd && checkIfFromDifferentSchool(user)) {
      setUserToAdd(user);
      setOpenVerifyModal(true);
    } else {
      // Add the user as a participant
      const participant: User = {
        id: user.id.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        color: 'blue',
        email: user.email,
        schools: user.schools,
        title: user.title,
      };

      let inConversation = false;
      // Only add if not already in the list
      if (selectedConversation.isNew) {
        inConversation = conversationParticipants.some(
          (p) => p.id === participant.id,
        );
      } else {
        inConversation = selectedConversation.participants.some(
          (p) => p.id === participant.id,
        );
      }

      if (!inConversation) {
        if (!selectedConversation.isNew) {
          // Make call to add user to conversation
          await axios.put(`/room/${selectedConversation.id}/`, {
            user_id: user.id,
          });
          setSelectedConversation((prev) =>
            prev
              ? {
                  ...prev,
                  participants: [...prev.participants, participant],
                }
              : null,
          );

          // Also update in the conversations list
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === selectedConversation.id
                ? {
                    ...conv,
                    participants: [...conv.participants, participant],
                  }
                : conv,
            ),
          );
        } else {
          setConversationParticipants((prev) => [...prev, participant]);
        }
      }

      // Clear the search text and focus the input
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setShowRecipientDropdown(false);
      setRecipientSearchText('');
      setUserPlusSearchText('');
    }
  };

  const handleAddAnyway = () => {
    if (userToAdd) {
      addUserToConversation(userToAdd);
      setOpenVerifyModal(false);
    }
  };

  const handleGoBack = () => {
    setOpenVerifyModal(false);
    if (!userPlusSearchText) {
      setShowUserPlusDropdown(false);
    }
  };

  const editConversationTitle = async (title: string) => {
    const response = await axios.put(`/room/${selectedConversation.id}/`, {
      title: title,
    });

    if (response.status === 200) {
      setSelectedConversation((prev) => (prev ? { ...prev, title } : null));
    }

    setSelectedConversation((prev) =>
      prev ? { ...prev, title: editedTitle } : null,
    );

    // Also update in the conversations list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, title: editedTitle }
          : conv,
      ),
    );

    // Exit editing mode
    setIsEditingTitle(false);
  };

  return (
    <>
      <div className="flex w-full p-[14px_16px] border-b-[1px] border-slate-200 h-[59.689px] justify-between">
        <div className="flex gap-2 items-center">
          {selectedConversation?.isNew ? (
            // For new conversations, show editable title
            <input
              type="text"
              className="body1-medium text-slate-900 border-none focus:outline-none focus:ring-0 bg-transparent"
              value={selectedConversation.title}
              placeholder="Conversation Title"
              autoFocus
              onChange={(e) => {
                // Update the conversation title as user types
                setSelectedConversation((prev) =>
                  prev ? { ...prev, title: e.target.value } : null,
                );

                // Also update in the conversations list
                setConversations((prev) =>
                  prev.map((conv) =>
                    conv.id === selectedConversation.id
                      ? { ...conv, title: e.target.value }
                      : conv,
                  ),
                );
              }}
            />
          ) : isEditingTitle ? (
            // Editing mode for existing conversation title
            <div className="flex items-center gap-4">
              <input
                ref={titleInputRef}
                type="text"
                className="body1-medium text-slate-900 border-none focus:outline-none focus:ring-0 bg-transparent"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-8 px-3 py-2 rounded-[6px] bg-slate-100 border border-slate-300 hover:bg-slate-200"
                  onClick={() => {
                    editConversationTitle(editedTitle);
                  }}
                >
                  <span className="text-slate-700">Save</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 py-2 rounded-[6px] border border-slate-300 hover:bg-slate-200"
                  onClick={() => {
                    // Cancel editing and revert to original title
                    setIsEditingTitle(false);
                  }}
                >
                  <span className="text-slate-700">Cancel</span>
                </Button>
              </div>
            </div>
          ) : (
            // For existing conversations, show title with edit button
            <>
              <span className="body1-medium text-slate-900">
                {selectedConversation?.title}
              </span>
              <MessageButton
                variant="ghost"
                size="icon"
                className="cursor-pointer relative w-6 h-6 rounded-full"
                onClick={() => {
                  setEditedTitle(selectedConversation.title);
                  setIsEditingTitle(true);
                }}
                tooltip="Edit title"
              >
                <PencilIcon className="size-4 text-slate-700" />
              </MessageButton>
            </>
          )}
        </div>
        <div className="flex gap-4 items-center justify-end">
          {selectedConversation?.isNew ? (
            // For new conversations, only show trash icon
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer relative w-6 h-6 rounded-full"
              onClick={handleDeleteDraft}
            >
              <TrashIcon className="size-5 text-slate-700" />
            </Button>
          ) : (
            // For existing conversations, show all action buttons
            <>
              {userRole === 'Agency_Admin' && (
                // Only show user plus dropdown for agency admins
                <MessageButton
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer relative w-6 h-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserPlusDropdown((prev) => !prev);
                  }}
                  data-userplus-button
                  tooltip="Add Users"
                >
                  <UserPlusIcon className="size-5 text-slate-700" />

                  {showUserPlusDropdown && (
                    <div
                      className="absolute right-0 top-8 z-20 min-w-[200px]"
                      onClick={(e) => e.stopPropagation()}
                      data-userplus-dropdown
                    >
                      <UserDropdown
                        onUserChange={(user) => {
                          if (!user) return;
                          addUserToConversation(user);
                        }}
                        users={getFilteredUsers()}
                        showSearchBar={true}
                        searchText={userPlusSearchText}
                        onSearchChange={setUserPlusSearchText}
                        data-userplus-dropdown
                      />
                    </div>
                  )}
                </MessageButton>
              )}
              <MessageDownloadButton
                title={selectedConversation.title}
                messages={messages}
              />
              <MessageButton
                variant="ghost"
                size="icon"
                className="cursor-pointer relative w-6 h-6 rounded-full"
                onClick={handleArchiveConversation}
                tooltip="Archive conversation"
              >
                <ArchiveBoxArrowDownIcon className="size-5 text-slate-700" />
              </MessageButton>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-4 p-4 border-b-[1px] border-slate-200">
        <div
          className={`w-full ${!selectedConversation.isNew ? 'hidden' : ''}`}
        >
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              {conversationParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1"
                >
                  <span className="text-sm text-blue-700">
                    {participant.first_name} {participant.last_name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full hover:bg-blue-100"
                    onClick={() => {
                      setConversationParticipants((prev) =>
                        prev.filter((p) => p.id !== participant.id),
                      );

                      // Focus the input after removing a participant
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    <XMarkIcon className="h-3 w-3 text-blue-700" />
                  </Button>
                </div>
              ))}

              <div className="flex-grow relative">
                <div className="flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full border-none focus:outline-none focus:ring-0 bg-transparent text-sm"
                    placeholder={
                      selectedConversation.participants.length > 0
                        ? ''
                        : 'Type to search for recipients...'
                    }
                    value={recipientSearchText}
                    onChange={(e) => {
                      setRecipientSearchText(e.target.value);
                      setShowRecipientDropdown(true);
                    }}
                    onFocus={() => {
                      setShowRecipientDropdown(true);
                    }}
                    onBlur={() => {
                      // Delay hiding the dropdown to allow for clicks on the dropdown items
                      blurTimeoutRef.current = setTimeout(
                        () => setShowRecipientDropdown(false),
                        200,
                      );
                    }}
                    onKeyDown={(e) => {
                      // If backspace is pressed and the input is empty, remove the last participant
                      if (
                        e.key === 'Backspace' &&
                        recipientSearchText === '' &&
                        conversationParticipants.length > 0
                      ) {
                        // Get the last participant
                        const lastParticipant =
                          conversationParticipants[
                            conversationParticipants.length - 1
                          ];

                        setConversationParticipants((prev) =>
                          prev.filter((p) => p.id !== lastParticipant.id),
                        );
                        setShowRecipientDropdown(true);
                      }
                    }}
                  />
                </div>

                {showRecipientDropdown && (
                  <div className="absolute z-10 min-w-[200px]">
                    <UserDropdown
                      onUserChange={(user) => {
                        if (!user) return;
                        addUserToConversation(user);
                        setShowRecipientDropdown(true);
                      }}
                      users={getFilteredUsers().filter(
                        (user) =>
                          recipientSearchText
                            ? `${user.first_name} ${user.last_name}`
                                .toLowerCase()
                                .includes(recipientSearchText.toLowerCase()) ||
                              user.email
                                .toLowerCase()
                                .includes(recipientSearchText.toLowerCase())
                            : [], // Pass empty array when no search text to prevent showing all users
                      )}
                      searchText={recipientSearchText}
                      data-userplus-search
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {!selectedConversation.isNew &&
          selectedConversation.participants.length > 0 && (
            // Show regular message thread for existing conversations
            <div className="flex flex-row gap-4">
              <Avatar
                className={`border w-[48px] h-[48px] ${AVATAR_COLORS[selectedConversation.participants[0].color as keyof typeof AVATAR_COLORS]}`}
              >
                <AvatarFallback className="body1-medium">
                  {selectedConversation.participants[0].first_name.charAt(0) +
                    selectedConversation.participants[0].last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="body1-medium text-slate-500 flex items-center">
                  {formatParticipantsList(
                    selectedConversation.participants,
                    currentUserId,
                  )}
                  <UserCircleIcon className="w-5 h-5 text-orange-200 ml-2.5" />
                </span>
                <span className="body2-regular text-slate-500">
                  {agency?.title || ''}
                </span>
              </div>
            </div>
          )}
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <ScrollArea className="flex-1 p-4 flex h-full">
          {loading > 0 ? (
            <Loading />
          ) : (
            <MessageThread
              key={selectedConversation.id}
              currentUserId={currentUserId}
              messages={messages}
              readReceipts={readReceipts}
            />
          )}
        </ScrollArea>
      </div>

      <ChatMessageInput
        key={selectedConversation.id}
        onSendMessage={handleRealMessage}
        disabled={
          selectedConversation?.isNew &&
          selectedConversation.participants.length === 0
        }
      />

      <AddUserVerify
        open={openVerifyModal}
        onOpenChange={setOpenVerifyModal}
        userName={
          userToAdd ? `${userToAdd.first_name} ${userToAdd.last_name}` : ''
        }
        schoolName={userToAdd?.schools?.[0]?.name || ''}
        onGoBack={handleGoBack}
        onAddAnyway={handleAddAnyway}
      />
    </>
  );
};

export default MessageContent;
