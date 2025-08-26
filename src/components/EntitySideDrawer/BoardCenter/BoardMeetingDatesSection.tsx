import React from 'react';
import { format, parseISO } from 'date-fns';
import { PlusIcon } from '@heroicons/react/24/solid';

import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';

interface BoardMeetingDatesSectionProps {
  meetingDates: string[];
  editingMeetingDate: string | null;
  isAddingMeetingDate: boolean;
  newMeetingDate: string;
  onAddMeetingDateClick: () => void;
  onCancelAddMeetingDate: () => void;
  onSetEditingMeetingDate: (date: string | null) => void;
  onCancelEditMeetingDate: () => void;
  onSaveNewMeetingDate: () => void;
  onUpdateMeetingDate: (oldDate: string, newDate: string) => void;
  onNewMeetingDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BoardMeetingDatesSection: React.FC<
  BoardMeetingDatesSectionProps
> = ({
  meetingDates,
  editingMeetingDate,
  isAddingMeetingDate,
  newMeetingDate,
  onAddMeetingDateClick,
  onCancelAddMeetingDate,
  onSetEditingMeetingDate,
  onCancelEditMeetingDate,
  onSaveNewMeetingDate,
  onUpdateMeetingDate,
  onNewMeetingDateChange,
}) => (
  <div className="flex flex-col gap-4">
    <h5>Board Meeting Dates</h5>
    <div className="flex flex-col">
      {meetingDates.map((dateString) => (
        <div key={dateString} className="py-2 border-b-1 border-slate-200">
          {editingMeetingDate === dateString ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                defaultValue={dateString}
                onBlur={(e) => {
                  const newSelectedDate = e.target.value;
                  if (newSelectedDate && newSelectedDate !== dateString) {
                    onUpdateMeetingDate(dateString, newSelectedDate);
                  } else if (!newSelectedDate) {
                    onCancelEditMeetingDate();
                  } else {
                    onCancelEditMeetingDate();
                  }
                }}
                className="h-8 w-[150px] text-sm"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={onCancelEditMeetingDate}
              >
                <span className="sr-only">Cancel</span>
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          ) : (
            <span
              onClick={() => onSetEditingMeetingDate(dateString)}
              className="cursor-pointer hover:text-blue-600"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  onSetEditingMeetingDate(dateString);
              }}
            >
              {format(parseISO(dateString), 'MMMM d, yyyy')}
            </span>
          )}
        </div>
      ))}
      {isAddingMeetingDate && (
        <div className="flex items-center gap-2 py-4 pl-1">
          <Input
            type="date"
            value={newMeetingDate}
            onChange={onNewMeetingDateChange}
            className="h-8 w-[150px] text-sm"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={onSaveNewMeetingDate}
          >
            <span className="sr-only">Save</span>
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={onCancelAddMeetingDate}
          >
            <span className="sr-only">Cancel</span>
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      )}
    </div>
    {!isAddingMeetingDate && !editingMeetingDate && (
      <Button
        variant="ghost"
        className="hover:bg-transparent text-blue-500 hover:text-blue-600 !pl-0 w-auto self-start"
        onClick={onAddMeetingDateClick}
      >
        <PlusIcon className="w-4 h-4" />
        Add meeting date
      </Button>
    )}
  </div>
);
