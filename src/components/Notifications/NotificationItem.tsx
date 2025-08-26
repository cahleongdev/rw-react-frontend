import React, { useCallback } from 'react';
import { StopCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

import { Notification } from '@/containers/Notifications/index.types';

import {
  interpolateTemplate,
  getActionButtonText,
  getActionButtonLink,
} from '@utils/notificationUtils';

interface NotificationItemProps {
  item: Notification;
  onView: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onView,
}) => {
  const navigate = useNavigate();

  const handleEntityClick = useCallback(
    (entityType: string, entityId: string) => {
      switch (entityType) {
        case 'school':
          navigate('/schools', {
            state: {
              openDrawer: true,
              entityId,
              entityType: 'School',
            },
          });
          break;
        case 'report':
          navigate('/reports', {
            state: {
              openDrawer: true,
              entityId,
              entityType: 'report',
            },
          });
          break;
        case 'comment':
          navigate('/reports', {
            state: {
              openDrawer: true,
              entityId: item.report_id,
              entityType: 'report',
              commentId: entityId,
            },
          });
          break;
      }
    },
    [navigate, item.report_id],
  );

  const handleMessageClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'SPAN' &&
        target.hasAttribute('data-entity-type')
      ) {
        const entityType = target.getAttribute('data-entity-type');
        const entityId = target.getAttribute('data-entity-id');
        if (entityType && entityId) {
          handleEntityClick(entityType, entityId);
        }
      }
    },
    [handleEntityClick],
  );

  let interpolatedMessage = '';

  if (item.type && item.links) {
    interpolatedMessage = interpolateTemplate(item.type, item.links);
  }

  return (
    <div className="flex items-center justify-between w-full px-6 h-[48px] bg-white border-b-[1px] border-beige-300">
      <div className="flex gap-5">
        <StopCircleIcon
          className={`w-2 ${item.read ? 'text-white' : 'text-orange-500'}`}
        />
        <span
          className={`text-base ${item.read ? 'text-neutral-500' : 'text-black'}`}
          onClick={handleMessageClick}
          dangerouslySetInnerHTML={{ __html: interpolatedMessage }}
        />
      </div>

      <button
        className={`text-xs font-semibold cursor-pointer ${
          item.read ? 'text-neutral-500' : 'text-orange-500'
        }`}
        onClick={() => {
          onView();
          const actionLink = getActionButtonLink(item.type, item.links);
          if (actionLink) {
            handleEntityClick(
              item.type.includes('comment')
                ? 'comment'
                : item.type.includes('report')
                  ? 'report'
                  : 'school',
              actionLink,
            );
          }
        }}
      >
        {getActionButtonText(item.type)}
      </button>
    </div>
  );
};

export default NotificationItem;
