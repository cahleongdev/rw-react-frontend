import React from 'react';
import { format, parseISO } from 'date-fns';

import { ActivityLog } from '@/store/slices/activityLogSlice';

interface ActivityLogSectionProps {
  activityLogs: ActivityLog[];
}

export const ActivityLogSection: React.FC<ActivityLogSectionProps> = ({
  activityLogs,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h5>Activity</h5>
      <div className="space-y-4">
        {activityLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-4">
            No activity logs available
          </div>
        ) : (
          activityLogs.map((log, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="body3-bold text-slate-800">
                  {log.user?.first_name} {log.user?.last_name || 'User'}
                </span>
                <span className="body3-medium text-slate-500">
                  {log.created_at
                    ? format(parseISO(log.created_at), 'M/d/yyyy')
                    : ''}
                </span>
              </div>
              <div className="body2-regular text-slate-700">{log.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
