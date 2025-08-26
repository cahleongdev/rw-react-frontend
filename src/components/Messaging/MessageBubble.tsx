import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

import { MessageReadBy, User } from '@/containers/Messaging/index.types';

import { Avatar, AvatarFallback } from '@components/base/Avatar';

interface MessageProps {
  messageId: string;
  content: string;
  timestamp: Date;
  currentUserId: string;
  sender: User;
  readReceipts: Map<string, MessageReadBy>;
}

// const AVATAR_COLORS = {
//   teal: 'text-teal-700 border-teal-500 bg-teal-50',
//   blue: 'text-blue-700 border-blue-500 bg-blue-50',
//   purple: 'text-purple-700 border-purple-500 bg-purple-50',
//   orange: 'text-orange-700 border-orange-500 bg-orange-50',
//   green: 'text-green-700 border-green-500 bg-green-50',
// };

const MessageBubble = ({
  messageId,
  content,
  timestamp,
  currentUserId,
  sender,
  readReceipts,
}: MessageProps) => {
  const isCurrentUser = currentUserId === sender.id;
  const isSystemMessage = sender.id === 'System';

  const isDelievered =
    readReceipts &&
    readReceipts.get(currentUserId) &&
    messageId === readReceipts.get(currentUserId)?.message_id;

  return (
    <div
      className={`flex gap-3 ${isSystemMessage ? 'w-full' : 'max-w-[80%]'} ${isCurrentUser ? 'self-end flex-row-reverse' : 'self-start'}`}
    >
      <div
        className={`flex flex-col gap-1 ${isSystemMessage ? 'w-full' : 'items-start'}`}
      >
        {currentUserId &&
          (isCurrentUser ? (
            <span className="text-xs text-right text-slate-500">You</span>
          ) : (
            <span
              className={`text-xs ${isSystemMessage ? 'text-center' : 'text-left'} text-slate-500`}
            >
              {sender.first_name} {sender.last_name}
            </span>
          ))}
        <div
          className={` ${isSystemMessage ? 'p-[14px_8px] w-full' : ' p-[4px_8px] rounded-lg text-sm'}  w-full ${
            isCurrentUser
              ? 'bg-orange-50 text-slate-700'
              : `${isSystemMessage ? 'p-[14px_8px] w-full' : 'bg-slate-100 text-slate-700'} `
          }`}
        >
          {isSystemMessage ? (
            <span className="font-bold text-center block w-full">
              {content}
            </span>
          ) : (
            <ReactQuill
              theme="bubble"
              value={content}
              readOnly={true}
              modules={{ toolbar: false }}
            />
          )}
        </div>
        <div
          key={messageId}
          className="text-xs text-slate-500 self-end flex gap-1 items-center"
        >
          <div>{format(timestamp, 'h:mm a')}</div>
          <div className="w-[2px] h-[2px] bg-slate-400 br-[1px]"></div>
          {readReceipts &&
            [...readReceipts.keys()].map(
              (key) =>
                messageId === readReceipts.get(key)?.message_id && (
                  <div key={key} className="flex gap-1 items-center">
                    {readReceipts.get(key)?.user.id !== currentUserId && (
                      <Avatar className={'border w-[25px] h-[25px]'}>
                        <AvatarFallback className="text-sm font-small">
                          {(
                            readReceipts.get(key)?.user?.first_name || ''
                          ).charAt(0) +
                            (
                              readReceipts.get(key)?.user?.last_name || ''
                            ).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ),
            )}
          {isDelievered && (
            <div
              key={readReceipts.get(currentUserId)?.message_id}
              className="flex gap-1 items-center"
            >
              <CheckCircleIcon className="text-orange-400 w-[9px] h-[9px]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
