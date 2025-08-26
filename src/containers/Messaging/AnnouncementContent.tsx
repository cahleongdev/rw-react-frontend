// Convert this to a container that wraps the AnnouncementContent component
import { useSelector } from 'react-redux';
import { useState } from 'react';

import {
  Conversation,
  RoomResponse,
  RoomMessageResponse,
  LastMessage,
} from '@/containers/Messaging/index.types';

import axios from '@/api/axiosInstance';

import AnnouncementContentComponent from '@/components/Messaging/AnnouncementContent';

import { RootState } from '@/store';
import { Category } from '@store/slices/categoriesSlice';

interface AnnouncementContentProps {
  selectedConversation: Conversation;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<Conversation | null>
  >;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  AVATAR_COLORS: Record<string, string>;
  handleArchiveConversation: () => void;
  updateConversationId: (oldId: string, newId: string) => void;
}

const AnnouncementContent = ({
  selectedConversation,
  setSelectedConversation,
  setConversations,
  AVATAR_COLORS,
  handleArchiveConversation,
  updateConversationId,
}: AnnouncementContentProps) => {
  const agency = useSelector((state: RootState) => state.agency.agency);
  const { categories: announcementsCategories } = useSelector(
    (state: RootState) => state.announcementsCategories,
  );
  // State for editing
  const [announcementCategory, setAnnouncementCategory] =
    useState<Category | null>(null);
  const [announcementContent, setAnnouncementContent] = useState<
    LastMessage | undefined
  >(selectedConversation.lastMessage);
  const [attachments, setAttachments] = useState<
    Array<{ id: string; name: string; type: string }>
  >([]);
  const [title, setTitle] = useState(selectedConversation.title);

  const getAnnouncementContent = async () => {
    if (!selectedConversation.isNew) {
      const { data: result } = await axios.get<RoomMessageResponse>(
        `/room_messages/${selectedConversation.id}/`,
      );
      setAnnouncementContent({
        content: result.content,
        sender: {
          id: result.sender.id,
          first_name: result.sender.first_name,
          last_name: result.sender.last_name,
        },
        timestamp: result.timestamp,
      });
    }
  };

  // Handle publishing the announcement
  const handlePublishAnnouncement = async () => {
    // Update the conversation with the new content
    if (!announcementContent) return;

    const updatedConversation: Conversation = {
      ...selectedConversation,
      lastMessage: announcementContent,
      isNew: false,
      date: new Date()
        .toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        })
        .replace(/\//g, '-'),
      announcementCategory: announcementCategory || undefined,
      title: title,
    };

    // Just treat it like a new messaae to everyone in the
    const { data: result } = await axios.post<RoomResponse>(
      '/room/announcement/',
      {
        announcement_category: announcementCategory,
        title: title,
        content: announcementContent.content,
      },
    );
    const newAnnouncementId = result.id;

    // Update conversations list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id ? updatedConversation : conv,
      ),
    );

    // Update selected conversation
    setSelectedConversation(updatedConversation);

    // Update the conversation ID
    updateConversationId(selectedConversation.id, newAnnouncementId);
  };

  // Handle deleting a draft announcement
  const handleDeleteDraft = () => {
    if (!selectedConversation.isNew) return;

    // Remove the conversation from state
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== selectedConversation.id),
    );

    // Clear selected conversation
    setSelectedConversation(null);
  };

  return (
    <AnnouncementContentComponent
      agency={agency}
      selectedConversation={selectedConversation}
      setSelectedConversation={setSelectedConversation}
      setConversations={setConversations}
      AVATAR_COLORS={AVATAR_COLORS}
      handleArchiveConversation={handleArchiveConversation}
      updateConversationId={updateConversationId}
      handlePublishAnnouncement={handlePublishAnnouncement}
      handleDeleteDraft={handleDeleteDraft}
      setAnnouncementCategory={setAnnouncementCategory}
      announcementCategory={announcementCategory}
      announcementContent={announcementContent}
      setAnnouncementContent={setAnnouncementContent}
      attachments={attachments}
      setAttachments={setAttachments}
      setTitle={setTitle}
      getAnnouncementContent={getAnnouncementContent}
      announcementsCategories={announcementsCategories}
    />
  );
};

export default AnnouncementContent;
