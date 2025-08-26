// src/pages/MessagingPage/elements/MessageInput/MessageInput.tsx
import { useState } from 'react';
import { PaperClipIcon } from '@heroicons/react/24/outline';

import { Textarea } from '@/components/base/Textarea';
import { MessageButton } from '@components/base/MessageButton';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput = ({
  onSendMessage,
  disabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col p-6 bg-slate-50 border-t border-slate-200 h-[155px]">
      <div className="relative flex-1">
        <Textarea
          placeholder="Type here..."
          className="min-h-[80px] h-full resize-none bg-white rounded-md border-slate-300 focus-visible:ring-blue-500 p-[10px_12px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <div className="absolute bottom-[10px] right-3 flex gap-[10px]] items-center">
          <MessageButton
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            disabled={disabled}
            tooltip={{
              children: 'Attach a file',
              side: 'right',
              align: 'center',
              className: 'bg-white text-black',
            }}
          >
            <PaperClipIcon className="h-4 w-4 text-slate-700" />
          </MessageButton>
          <MessageButton
            onClick={handleSendMessage}
            className="cursor-pointer bg-blue-500 rounded-[6px] min-w-[70px] hover:bg-blue-600 active:bg-blue-700 h-[36px] p-[8px_12px]"
            disabled={disabled}
            tooltip="Send message"
          >
            <span className="text-white button3">Send</span>
          </MessageButton>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
