// src/pages/MessagingPage/elements/MessageThread/MessageThread.tsx
import React, { useEffect, useRef } from 'react';

import { Message, MessageReadBy } from '@/containers/Messaging/index.types';

import { ScrollArea } from '@/components/base/ScrollArea';
import MessageBubble from './MessageBubble';

interface MessageThreadProps {
  currentUserId: string;
  messages: Message[];
  readReceipts: Map<string, MessageReadBy>;
}

const MessageThread = ({
  currentUserId,
  messages,
  readReceipts,
}: MessageThreadProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Add check for if the message has been read by everyone in the group

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            messageId={message.id}
            content={message.content}
            timestamp={message.timestamp}
            sender={message.sender}
            currentUserId={currentUserId}
            readReceipts={readReceipts}
          />
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};

export default React.memo(MessageThread);
