import { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import { PaperClipIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/base/Button';
import { CustomFileUploadInput } from '@/components/base/FileUploadInput';
import { RichTextEdit } from '@/components/base/RichTextEdit';

import { useFileUpload } from '@/hooks';
import { STORAGE_PATH } from '@containers/Settings/index.constants';

export interface FileUrl {
  file_url: string;
  file_name: string;
}

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  key: string;
}

const modules: ReactQuill.QuillOptions['modules'] = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }], // H1, H2, H3, H4 options
    [{ font: [] }], // Font selection
    [{ color: [] }, { background: [] }], // Font color and background color
    ['bold', 'italic', 'underline', 'strike'], // Text styles
    [{ list: 'ordered' }, { list: 'bullet' }], // Ordered and unordered lists
    [{ align: [] }], // Alignments: left, center, right
    [{ indent: '-1' }, { indent: '+1' }], // Indent and outdent
    ['clean'], // Remove formatting
  ],
};

const ChatMessageInput = ({
  key,
  onSendMessage,
  disabled = false,
}: MessageInputProps) => {
  const { uploadFile } = useFileUpload();

  const [message, setMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const reactQuillRef = useRef<ReactQuill>(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const sanitizedMessage = DOMPurify.sanitize(message);

      setMessage(sanitizedMessage);
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleUploadFiles = async (files: File[]) => {
    const newFileUrls = [];

    for (const file of files) {
      // TODO: Super sloppy, but it works for now, need to isolate by agency
      const fileUrl = await uploadFile(file, undefined, 'avatar');

      newFileUrls.push({
        file_url: STORAGE_PATH + fileUrl,
      });
    }

    const messageToSend = newFileUrls.map((file) => file.file_url).join(',');

    onSendMessage(
      `<a class="text-blue-500" href="${messageToSend}">${messageToSend}</a>`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const unprivilegedEditor = reactQuillRef.current?.unprivilegedEditor;
      const text = unprivilegedEditor?.getText().trim();

      if (text?.length && text.length > 0) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col bg-slate-50 border-t border-slate-200 h-[155px]">
      <div className="flex flex-col gap-2">
        <RichTextEdit
          key={key}
          reactQuillRef={reactQuillRef}
          value={message}
          onChange={setMessage}
          modules={modules}
          placeholder="Type here..."
          onKeyDown={handleKeyDown}
        />
        <div className="absolute bottom-[23px] right-5 flex gap-[10px]] items-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            disabled={disabled}
            onClick={handleAttachmentClick}
          >
            <CustomFileUploadInput
              inputRef={fileInputRef}
              label="Attachments"
              onFilesSelected={handleUploadFiles}
              maxSize={10}
              allowedTypes={[
                '.pdf',
                '.doc',
                '.docx',
                '.xls',
                '.xlsx',
                '.png',
                '.jpg',
                '.jpeg',
                '.gif',
              ]}
              className="hidden"
            />
            <PaperClipIcon className="h-4 w-4 text-slate-700" />
          </Button>
          <Button
            onClick={handleSendMessage}
            className="cursor-pointer bg-blue-500 rounded-[6px] min-w-[70px] hover:bg-blue-600 active:bg-blue-700 h-[36px] p-[8px_12px]"
            disabled={disabled}
          >
            <span className="text-white button3">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageInput;
