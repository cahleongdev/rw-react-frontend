import { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';

import {
  TrashIcon,
  CloudArrowDownIcon,
  ArchiveBoxArrowDownIcon,
} from '@heroicons/react/24/outline';

import { Conversation, LastMessage } from '@/containers/Messaging/index.types';
import { Category } from '@containers/Reports/index.types';

import { Button } from '@/components/base/Button';
import { Avatar, AvatarFallback } from '@/components/base/Avatar';
import { ScrollArea } from '@/components/base/ScrollArea';
import { CustomInput } from '@/components/base/CustomInput';
import { Dropdown } from '@/components/base/Dropdown';
import { RichTextEdit } from '@/components/base/RichTextEdit';
import { FileUploadInput } from '@/components/base/FileUploadInput';

import { Agency } from '@store/types';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }], // H1, H2, H3, H4 options
    [{ font: [] }], // Font selection
    [{ color: [] }, { background: [] }], // Font color and background color
    ['bold', 'italic', 'underline', 'strike'], // Text styles
    [{ list: 'ordered' }, { list: 'bullet' }], // Ordered and unordered lists
    [{ align: [] }], // Alignments: left, center, right
    [{ indent: '-1' }, { indent: '+1' }], // Indent and outdent
    ['clean'], // Remove formatting
    ['link', 'image'], // Link, image
  ],
};

interface AnnouncementContentProps {
  agency: Agency | null;
  selectedConversation: Conversation;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<Conversation | null>
  >;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  AVATAR_COLORS: Record<string, string>;
  handleArchiveConversation: () => void;
  updateConversationId: (oldId: string, newId: string) => void;
  handlePublishAnnouncement: () => void;
  handleDeleteDraft: () => void;
  announcementsCategories: Category[];
  announcementCategory: Category | null;
  setAnnouncementCategory: (announcementCategory: Category | null) => void;
  announcementContent: LastMessage | undefined;
  attachments: Array<{ id: string; name: string; type: string }>;
  setAttachments: (
    attachments: Array<{ id: string; name: string; type: string }>,
  ) => void;
  setTitle: (title: string) => void;
  setAnnouncementContent: (announcementContent: LastMessage) => void;
  getAnnouncementContent: () => void;
}

const AnnouncementContent = ({
  agency,
  selectedConversation,
  setSelectedConversation,
  setConversations,
  AVATAR_COLORS,
  handleArchiveConversation,
  handlePublishAnnouncement,
  handleDeleteDraft,
  announcementContent,
  setAnnouncementContent,
  announcementCategory,
  setAnnouncementCategory,
  attachments,
  setAttachments,
  setTitle,
  getAnnouncementContent,
  announcementsCategories,
}: AnnouncementContentProps) => {
  // Fetch the announcement content when the component mounts
  useEffect(() => {
    getAnnouncementContent();
  }, [selectedConversation.id, selectedConversation.isNew]);

  const announcementClass = (color: string) => {
    return `bg-${color}-400 body3-medium text-white rounded-[5px] border border-${color}-300 px-3 py-[6px]`;
  };

  return (
    <>
      <div className="flex w-full p-[14px_16px] border-b-[1px] border-slate-200 h-[59.689px] justify-between">
        <div className={'flex gap-2 items-center'}>
          {selectedConversation.isNew ? (
            // For new announcements, show editable title
            <span className="body1-medium text-black">
              [Edit/New] Announcement
            </span>
          ) : (
            <>
              <span
                className={announcementClass(
                  selectedConversation.announcementCategory?.color || 'blue',
                )}
              >
                {selectedConversation.announcementCategory?.name ||
                  'Announcement Type'}
              </span>
              <span className="body1-medium text-slate-900">
                {selectedConversation?.title}
              </span>
            </>
          )}
        </div>
        {!selectedConversation.isNew && (
          <div className="flex gap-4 items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer relative w-6 h-6 rounded-full"
            >
              <CloudArrowDownIcon className="size-5 text-slate-700" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer relative w-6 h-6 rounded-full"
              onClick={handleArchiveConversation}
            >
              <ArchiveBoxArrowDownIcon className="size-5 text-slate-700" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {selectedConversation.isNew ? (
          // Editing mode for new announcement
          <>
            <ScrollArea className="flex-1 p-4 flex h-full">
              <div className="flex flex-col gap-4 flex-1">
                <CustomInput
                  label="Announcement Title"
                  required
                  value={selectedConversation.title}
                  className="w-[365px]"
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSelectedConversation((prev) =>
                      prev ? { ...prev, title: e.target.value } : null,
                    );
                    setConversations((prev) =>
                      prev.map((conv) =>
                        conv.id === selectedConversation.id
                          ? { ...conv, title: e.target.value }
                          : conv,
                      ),
                    );
                  }}
                  placeholder="Title"
                />
                <Dropdown
                  label="Type"
                  required
                  value={announcementCategory?.name || 'Announcement Type'}
                  onValueChange={(value) => {
                    const selectedCategory = announcementsCategories.find(
                      (category) => category.name === value,
                    );
                    setAnnouncementCategory(selectedCategory || null);
                  }}
                  options={[
                    {
                      value: 'Announcement Type',
                      label: 'Announcement Type',
                      disabled: true,
                      hidden: true,
                    },
                    ...announcementsCategories.map((category: Category) => ({
                      value: category.name,
                      label: category.name,
                      color: category.color,
                    })),
                  ]}
                />

                <RichTextEdit
                  key={selectedConversation.id}
                  label="Announcement"
                  required
                  value={announcementContent?.content || ''}
                  onChange={(value) =>
                    setAnnouncementContent({
                      content: value,
                      sender: announcementContent?.sender || {
                        id: 'current-user',
                        first_name: '',
                        last_name: '',
                      },
                      timestamp: announcementContent?.timestamp || '',
                    })
                  }
                  placeholder="Type announcement here"
                  modules={modules}
                />

                <FileUploadInput
                  label="Attachments"
                  onFilesSelected={(files) => {
                    const newFiles = files.map((file) => ({
                      id: Math.random().toString(36).substring(7),
                      name: file.name,
                      type: file.name.split('.').pop() || '',
                    }));

                    setAttachments([...attachments, ...newFiles]);
                  }}
                  maxSize={10}
                  allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
                  multiple={true}
                  className="w-[314px]"
                />

                <Button
                  className="cursor-pointer bg-slate-500 rounded-[6px] hover:bg-slate-600 active:bg-slate-700 p-[10px_20px] h-[36px] w-[90px]"
                  onClick={handlePublishAnnouncement}
                >
                  <span className="text-white button2">Upload</span>
                </Button>
              </div>
            </ScrollArea>
          </>
        ) : (
          // View mode for existing announcement
          <>
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <Avatar
                  className={`border w-[48px] h-[48px] ${AVATAR_COLORS[selectedConversation.participants[0]?.color as keyof typeof AVATAR_COLORS] || AVATAR_COLORS.blue}`}
                >
                  <AvatarFallback className="body1-medium">
                    {/* TODO: Figure out what we want to do here */}
                    {selectedConversation.participants[0]
                      ? selectedConversation.participants[0].first_name.charAt(
                          0,
                        ) +
                        selectedConversation.participants[0].last_name.charAt(0)
                      : 'JC'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="body1-medium text-slate-900">
                    {selectedConversation.participants[0]?.first_name}{' '}
                    {selectedConversation.participants[0]?.last_name}
                  </span>
                  <span className="body2-regular text-slate-500">
                    {agency?.title || ''}
                  </span>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4 flex">
              <div className="flex flex-col gap-2 flex-1">
                <p className="body2-regular text-slate-500">
                  {format(selectedConversation.date, 'MMMM d, yyyy')}
                </p>
                <p
                  className="body1-regular "
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      selectedConversation.lastMessage?.content || '',
                    ),
                  }}
                ></p>
              </div>
            </ScrollArea>
          </>
        )}
      </div>
      {selectedConversation.isNew ? (
        <div className="flex p-6 gap-4 bg-slate-50 border-t border-slate-200">
          <Button
            className="cursor-pointer bg-blue-500 rounded-[6px] hover:bg-blue-600 active:bg-blue-700 h-[36px] p-[8px_12px]"
            onClick={handlePublishAnnouncement}
            disabled={!selectedConversation.title || !announcementContent}
          >
            <span className="text-white button2">Send Announcement</span>
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer bg-white border-slate-300 rounded-[6px] hover:bg-slate-100 h-[36px] p-[8px_12px]"
            onClick={handleDeleteDraft}
          >
            <span className="text-slate-700 button2">Cancel</span>
          </Button>
        </div>
      ) : (
        <>
          {attachments.length > 0 && (
            <div className="flex flex-col bg-slate-50 p-6 border-t border-slate-200 h-[155px] gap-2">
              <h3 className="text-slate-900 body2-regular">Attachments</h3>
              <div className="flex flex-col overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="flex flex-col gap-1">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center w-[359px] justify-between bg-slate-200 border border-slate-300 rounded p-[6px_12px]"
                      >
                        <span className="text-slate-700 body2-bold underline">
                          {attachment.name}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full"
                          >
                            <CloudArrowDownIcon className="h-4 w-4 text-slate-700" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full"
                          >
                            <TrashIcon className="h-4 w-4 text-slate-700" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AnnouncementContent;
