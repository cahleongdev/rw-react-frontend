import React from 'react';

import Switch from '@/components/base/Switch';

interface NotificationsSettingsProps {
  role?: string;
  notificationSettings: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
}

const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({
  role,
  notificationSettings,
  onChange,
}: NotificationsSettingsProps) => {
  return (
    <div className="flex flex-col gap-6 grow">
      <h4 className="text-slate-950">Notification Settings</h4>
      <hr className="border border-secondary" />
      <div className="flex flex-row gap-6">
        <div className="flex flex-col gap-0.5 max-w-[280px]">
          <div className="body2-medium text-slate-700">Email</div>
          <div className="body2-regular text-slate-500">
            Configure your email notifications. Decide which emails you would
            like to receive.
          </div>
        </div>

        <div className="flex flex-col gap-6 w-[480px] p-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex flex-row gap-2">
              <Switch
                checked={notificationSettings.comments}
                onChange={(newChecked) => onChange('comments', newChecked)}
              />
              <div className="font-medium body-regular text-slate-700">
                Comments
              </div>
            </div>
            <div className="font-normal text-sm text-slate-500 ml-9.5">
              Enable whether you get notified every time an Evaluator comments
              on a report or application you are part of (limited to 1 email
              every 10 minutes)
            </div>
          </div>
          {role === 'School_Admin' && (
            <>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-row gap-2">
                  <Switch
                    checked={notificationSettings.report_returned}
                    onChange={(newChecked) =>
                      onChange('report_returned', newChecked)
                    }
                  />
                  <div className="font-medium text-sm text-slate-700">
                    Report Returned
                  </div>
                </div>
                <div className="font-normal text-sm text-slate-500 ml-9.5">
                  Get emailed when a report is returned. You will be emailed on
                  the reports you belong too, or all reports if you are an
                  admin.
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-row gap-2">
                  <Switch
                    checked={notificationSettings.report_rejected}
                    onChange={(newChecked) =>
                      onChange('report_rejected', newChecked)
                    }
                  />
                  <div className="font-medium text-sm text-slate-700">
                    Report Rejected
                  </div>
                </div>
                <div className="font-normal text-sm text-slate-500 ml-9.5">
                  Get emailed when a report is rejected. You will be emailed on
                  the reports you belong too, or all reports if you are an
                  admin.
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-row gap-2">
                  <Switch
                    checked={notificationSettings.report_data_change}
                    onChange={(newChecked) =>
                      onChange('report_data_change', newChecked)
                    }
                  />
                  <div className="font-medium text-sm text-slate-700">
                    Report Data Change
                  </div>
                </div>
                <div className="font-normal text-sm text-slate-500 ml-9.5">
                  Get emailed when a reports due date has been changed. You will
                  be emailed on the reports you belong too, or all reports if
                  you are an admin.
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-row gap-2">
                  <Switch
                    checked={notificationSettings.report_assigned}
                    onChange={(newChecked) =>
                      onChange('report_assigned', newChecked)
                    }
                  />
                  <div className="font-medium text-sm text-slate-700">
                    Report Assigned
                  </div>
                </div>
                <div className="font-normal text-sm text-slate-500 ml-9.5">
                  Get emailed when a report is assigned to you or your school.
                </div>
              </div>
            </>
          )}
          <div className="flex flex-col gap-0.5">
            <div className="flex flex-row gap-2">
              <Switch
                checked={notificationSettings.messages}
                onChange={(newChecked) => onChange('messages', newChecked)}
              />
              <div className="font-medium text-sm text-slate-700">Messages</div>
            </div>
            <div className="font-normal text-sm text-slate-500 ml-9.5">
              Enable whether you get notified every time a message is received.
            </div>
          </div>
          {role === 'School_Admin' ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-row gap-2">
                <Switch
                  checked={notificationSettings.weekly_report}
                  onChange={(newChecked) =>
                    onChange('weekly_report', newChecked)
                  }
                />
                <div className="font-medium text-sm text-slate-700">
                  Weekly Report Summary
                </div>
              </div>
              <div className="font-normal text-sm text-slate-500 ml-9.5">
                Each Monday you will be sent a summary of the reports due this
                week. You will be emailed on the reports you belong too, or all
                reports if you are an admin.
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-row gap-2">
                  <Switch
                    checked={notificationSettings.reports}
                    onChange={(newChecked) => onChange('reports', newChecked)}
                  />
                  <div className="font-medium text-sm text-slate-700">
                    Reports
                  </div>
                </div>
                <div className="font-normal text-sm text-slate-500 ml-9.5">
                  Submitted Get emailed when a report is submitted.
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-row gap-2">
                  <Switch
                    checked={notificationSettings.daily_report}
                    onChange={(newChecked) =>
                      onChange('daily_report', newChecked)
                    }
                  />
                  <div className="font-medium text-sm text-slate-700">
                    Daily Report Summary
                  </div>
                </div>
                <div className="font-normal text-sm text-slate-500 ml-9.5">
                  Every day you will be sent a summary.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettings;
