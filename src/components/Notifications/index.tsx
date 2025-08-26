import React, { Dispatch, SetStateAction } from 'react';

import {
  FilterType,
  Notification,
} from '@/containers/Notifications/index.types';

import FilterButtons from '@/components/Notifications/FilterButtons';
import CategoryItem from '@/components/Notifications/CategoryItem';
import NotificationItem from '@/components/Notifications/NotificationItem';
import SortLabel from '@/components/Notifications/SortLabel';

interface NotificationsProps {
  loading: boolean;
  activeFilter: FilterType;
  setActiveFilter: Dispatch<SetStateAction<FilterType>>;
  sortOrder: 'newest' | 'oldest';
  setSortOrder: (order: 'newest' | 'oldest') => void;
  error: string | null;
  groupedNotifications: Record<string, Notification[]>;
  handleView: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  loading,
  activeFilter,
  setActiveFilter,
  sortOrder,
  setSortOrder,
  error,
  groupedNotifications,
  handleView,
}: NotificationsProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-start flex-1 self-stretch">
        <div className="flex w-full h-[72px] items-center justify-between px-[24px] border-b-[1px] border-beige-300">
          <h2 className="text-[20px] font-[500]">Notifications</h2>
          <FilterButtons
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>
        <div className="flex w-full h-[48px] items-center px-[24px] border-b-[1px] border-beige-300">
          <SortLabel value={sortOrder} onSort={setSortOrder} />
        </div>
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-start flex-1 self-stretch">
        <div className="flex w-full h-[72px] items-center justify-between px-[24px] border-b-[1px] border-beige-300">
          <h2 className="text-[20px] font-[500]">Notifications</h2>
          <FilterButtons
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>
        <div className="flex w-full h-[48px] items-center px-[24px] border-b-[1px] border-beige-300">
          <SortLabel value={sortOrder} onSort={setSortOrder} />
        </div>
        <div className="flex-1 w-full flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start flex-1 self-stretch">
      <div className="flex w-full h-[72px] items-center justify-between px-[24px] border-b-[1px] border-beige-300">
        <h2 className="text-[20px] font-[500]">Notifications</h2>
        <FilterButtons
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>

      <div className="flex w-full h-[48px] items-center px-[24px] border-b-[1px] border-beige-300">
        <SortLabel value={sortOrder} onSort={setSortOrder} />
      </div>

      <div className="flex-1 w-full overflow-auto">
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="flex justify-center items-center h-[200px] text-slate-500">
            No notifications found
          </div>
        ) : (
          Object.entries(groupedNotifications).map(
            ([period, notifications]) => (
              <React.Fragment key={period}>
                <CategoryItem title={period} />
                {notifications.map((item) => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    onView={() => handleView(item.id)}
                  />
                ))}
              </React.Fragment>
            ),
          )
        )}
      </div>
    </div>
  );
};

export default Notifications;
