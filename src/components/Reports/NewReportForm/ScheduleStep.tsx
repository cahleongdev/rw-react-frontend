import React, { useEffect, useState } from 'react';
import { X, PlusIcon, PencilIcon, XCircleIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/base/Button';
import { Input } from '@/components/base/Input';
import { Badge } from '@/components/base/Badge';
import { DateInput } from '@/components/base/DateInput';
import { Dropdown } from '@/components/base/Dropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/Table';

import { ReportResponse, Schedule } from '@/containers/Reports/index.types';

import { getDateFromString } from '@/utils/date';

interface ScheduleStepProps {
  formData: ReportResponse;
  handleChange: <K extends keyof ReportResponse>(
    field: K,
    value: ReportResponse[K],
  ) => void;
  handleNext: () => void;
  isSubmitting: boolean;
  stepLabels: string[];
  currentStep: number;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({
  formData,
  handleChange,
  handleNext,
  isSubmitting,
  stepLabels,
  currentStep,
}) => {
  // Local state variables
  const [scheduleType, setScheduleType] = useState(
    formData.schedule_type || 'SPECIFIC_DATES',
  );
  const [schedules, setSchedules] = useState<Schedule[]>(
    formData.schedules || [],
  );
  const [editing, setEditing] = useState<boolean[]>(
    (formData.schedules || []).map(() => false),
  );
  const [recurringFirstOccurrence, setRecurringFirstOccurrence] = useState(
    formData.recurring_first_occurrence,
  );
  const [recurringInterval, setRecurringInterval] = useState(
    formData.recurring_interval,
  );
  const [recurringPeriod, setRecurringPeriod] = useState(
    formData.recurring_period,
  );
  const [recurringOccurrences, setRecurringOccurrences] = useState(
    formData.recurring_occurrences,
  );
  const [datePickerValue, setDatePickerValue] = useState<string>('');
  const [reportNames, setReportNames] = useState<Schedule[]>(
    formData.schedules || [],
  );

  // Propagate changes to parent form data
  useEffect(() => {
    handleChange('schedule_type', scheduleType);
  }, [scheduleType, handleChange]);

  useEffect(() => {
    // reportNames is the source of truth for schedules in formData
    handleChange('schedules', reportNames);
  }, [reportNames, handleChange]);

  useEffect(() => {
    handleChange('recurring_first_occurrence', recurringFirstOccurrence);
  }, [recurringFirstOccurrence, handleChange]);

  useEffect(() => {
    handleChange('recurring_interval', recurringInterval);
  }, [recurringInterval, handleChange]);

  useEffect(() => {
    handleChange('recurring_period', recurringPeriod);
  }, [recurringPeriod, handleChange]);

  useEffect(() => {
    handleChange('recurring_occurrences', recurringOccurrences);
  }, [recurringOccurrences, handleChange]);

  // Handle schedule type change
  const handleScheduleTypeChange = (type: string) => {
    setScheduleType(type);
    // Clear existing schedules when switching types; useEffects will handle formData updates
    setSchedules([]);
    setReportNames([]);
    if (type === 'SPECIFIC_DATES') {
      setRecurringFirstOccurrence(null);
      setRecurringInterval(null);
      setRecurringPeriod(null);
      setRecurringOccurrences(null);
    }
  };

  // Generate dates based on recurring settings
  const generateRecurringDates = (): string[] => {
    if (!recurringFirstOccurrence) return [];

    const dates: string[] = [];
    const startDate = getDateFromString(recurringFirstOccurrence);
    const period = recurringPeriod || 'quarter';
    const occurrences = recurringOccurrences || 4;
    const frequency = recurringInterval || 1;

    // Add the first date
    dates.push(startDate.toISOString().split('T')[0]);

    // Generate subsequent dates based on period and frequency
    for (let i = 1; i < occurrences; i++) {
      const nextDate = new Date(startDate);

      switch (period) {
        case 'week':
          nextDate.setDate(nextDate.getDate() + 7 * frequency * i);
          break;
        case 'month':
          nextDate.setMonth(nextDate.getMonth() + frequency * i);
          break;
        case 'quarter':
          nextDate.setMonth(nextDate.getMonth() + 3 * frequency * i);
          break;
        case 'year':
          nextDate.setFullYear(nextDate.getFullYear() + frequency * i);
          break;
      }
      dates.push(nextDate.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Get generated dates based on schedule type
  const getGeneratedDates = (): string[] => {
    if (scheduleType === 'SPECIFIC_DATES') {
      return schedules.map((schedule) => schedule.schedule_time) || [];
    } else if (scheduleType === 'RECURRING_DATES') {
      return generateRecurringDates();
    }
    return [];
  };

  // Effect to initialize and update reportNames and, if recurring, schedules
  useEffect(() => {
    const dates = getGeneratedDates();

    const newReportNames = dates.map((date) => {
      const existingNameEntry = reportNames.find(
        (rn) => rn.schedule_time === date,
      );
      if (existingNameEntry) return existingNameEntry;

      const dateObj = getDateFromString(date);
      let defaultName = formData.name || 'New Report';

      if (dates.length > 1) {
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const year = dateObj.getFullYear();
        const day = dateObj.getDate();
        defaultName = `${defaultName} ${month} ${day}, ${year}`;
      }

      return {
        id: '', // Assuming new schedules don't have an ID until saved
        schedule_time: date,
        report_name: defaultName,
      };
    });
    setReportNames(newReportNames);

    if (scheduleType === 'RECURRING_DATES') {
      // For recurring dates, schedules are directly derived from generated dates + report names
      setSchedules(newReportNames);
    }
    // For SPECIFIC_DATES, `schedules` is managed by handleAddDate/handleRemoveDate
    // and `reportNames` is updated accordingly in those functions.
  }, [
    formData.name,
    scheduleType,
    // For SPECIFIC_DATES, `schedules` state is a dependency
    // For RECURRING_DATES, recurring parameters are dependencies
    ...(scheduleType === 'SPECIFIC_DATES'
      ? [schedules]
      : [
          recurringFirstOccurrence,
          recurringInterval,
          recurringPeriod,
          recurringOccurrences,
        ]),
  ]);

  const handleReportNameChange = (date: string, name: string) => {
    const updatedNames = reportNames.map((reportName) =>
      reportName.schedule_time === date
        ? { ...reportName, report_name: name }
        : reportName,
    );
    setReportNames(updatedNames);
    if (scheduleType === 'SPECIFIC_DATES') {
      setSchedules(updatedNames); // Keep schedules in sync with reportNames for specific dates
    }
  };

  const handleRemoveDate = (dateToRemove: string) => {
    if (scheduleType === 'SPECIFIC_DATES') {
      const updatedSchedules = schedules.filter(
        (schedule) => schedule.schedule_time !== dateToRemove,
      );
      setSchedules(updatedSchedules);
      // reportNames will be updated by the useEffect due to `schedules` changing
    }
    // For RECURRING_DATES, removal is not directly done this way;
    // dates are generated, so user would modify recurring parameters.
  };

  const handleAddDate = () => {
    if (datePickerValue && scheduleType === 'SPECIFIC_DATES') {
      const dateExists = schedules.some(
        (schedule) => schedule.schedule_time === datePickerValue,
      );

      if (!dateExists) {
        const dateObj = getDateFromString(datePickerValue);
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const year = dateObj.getFullYear();
        const day = dateObj.getDate();
        const defaultName = `${formData.name || 'New Report'} ${month} ${day}, ${year}`;

        const newSchedule: Schedule = {
          id: '', // Assuming new schedules don't have an ID until saved
          schedule_time: datePickerValue,
          report_name: defaultName,
        };
        setSchedules([...schedules, newSchedule]);
        // reportNames will be updated by the useEffect due to `schedules` changing
      }
      setDatePickerValue(''); // Clear the input
    }
  };

  const handleNextClick = () => {
    // All handleChange calls are now handled by useEffects based on local state changes.
    handleNext();
  };

  const handleEditingToggle = (index: number) => {
    const newEditing = [...editing]; // Create a new array
    newEditing[index] = !newEditing[index];
    setEditing(newEditing);
  };

  // Effect to reset editing state when reportNames changes (e.g. dates added/removed)
  useEffect(() => {
    setEditing(reportNames.map(() => false));
  }, [reportNames]);

  // Check if we should show the report names section and next button
  const showReportNamesSection =
    (scheduleType === 'RECURRING_DATES' &&
      !!recurringFirstOccurrence &&
      reportNames.length > 0) ||
    (scheduleType === 'SPECIFIC_DATES' && reportNames.length > 0);

  return (
    <div className="mx-auto flex gap-6 flex-col p-6 w-[884px]">
      <h2>Schedule</h2>
      <div className="flex flex-col gap-2 w-[483px]">
        <h3 className="text-slate-700">Due Date</h3>
        <p className="body2-regular text-slate-700">
          Select specific dates or a recurring dates for reports that go out on
          a cadence. This will be the default schedule; you will be able to
          override the schedule for specific schools when you assign the report.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Specific Date(s) Option */}
        <div className="border border-slate-300 rounded-lg p-4 gap-4 flex flex-col">
          <div className="flex items-center gap-2">
            <div
              className={`
                flex items-center justify-center
                w-4 h-4 rounded-full cursor-pointer
                ${
                  scheduleType === 'SPECIFIC_DATES'
                    ? 'bg-white border-2 border-orange-500'
                    : 'bg-gray-100 border-1 border-gray-200'
                }
              `}
              onClick={() => handleScheduleTypeChange('SPECIFIC_DATES')}
            >
              {scheduleType === 'SPECIFIC_DATES' && (
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              )}
            </div>
            <span className="body2-regular text-slate-700">
              Specific Date(s)
            </span>
          </div>

          {scheduleType === 'SPECIFIC_DATES' && (
            <div className="pl-6 flex flex-col gap-4">
              {/* Display selected dates */}
              {schedules && schedules.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {schedules.map((schedule, index) => (
                    <Badge
                      key={index}
                      className="bg-slate-100 text-slate-700 px-3 py-1 flex items-center gap-2"
                    >
                      {getDateFromString(
                        schedule.schedule_time,
                      ).toLocaleDateString()}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDate(schedule.schedule_time);
                        }}
                      >
                        <X className="h-3 w-3 cursor-pointer" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Date picker and add button */}
              <div className="flex items-center gap-4">
                <DateInput
                  value={datePickerValue}
                  onChange={setDatePickerValue}
                  label="Date"
                  disabled={scheduleType !== 'SPECIFIC_DATES'}
                />
                <Button
                  variant="ghost"
                  className="text-orange-500 flex items-center gap-1"
                  onClick={handleAddDate}
                  disabled={
                    scheduleType !== 'SPECIFIC_DATES' || !datePickerValue
                  }
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add date</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Recurring Dates Option */}
        <div className="border border-slate-300 rounded-lg p-4 gap-4 flex flex-col">
          <div className="flex items-center gap-2">
            <div
              className={`
                flex items-center justify-center
                w-4 h-4 rounded-full cursor-pointer
                ${
                  scheduleType === 'RECURRING_DATES'
                    ? 'bg-white border-2 border-orange-500'
                    : 'bg-gray-100 border-1 border-gray-200'
                }
              `}
              onClick={() => handleScheduleTypeChange('RECURRING_DATES')}
            >
              {scheduleType === 'RECURRING_DATES' && (
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              )}
            </div>
            <span className="body2-regular text-slate-700">
              Recurring Dates
            </span>
          </div>

          {scheduleType === 'RECURRING_DATES' && (
            <div className="pl-6 flex flex-col gap-4">
              {/* Date of first occurrence */}
              <div className="flex items-center gap-2">
                <span className="text-slate-700 w-[180px] body2-regular">
                  Date of first occurrence:
                </span>
                <DateInput
                  value={recurringFirstOccurrence || ''}
                  onChange={(value) => setRecurringFirstOccurrence(value)}
                  className="w-[180px]"
                  disabled={scheduleType !== 'RECURRING_DATES'}
                />
              </div>

              {/* Repeat every */}
              <div className="flex items-center gap-2">
                <span className="text-slate-700 w-[180px] body2-regular">
                  Repeat every:
                </span>
                <div className="flex items-center gap-2">
                  <Dropdown
                    options={[
                      { value: '1', label: '1' },
                      { value: '2', label: '2' },
                      { value: '3', label: '3' },
                      { value: '4', label: '4' },
                    ]}
                    value={recurringInterval?.toString() || '1'}
                    onValueChange={(value) =>
                      setRecurringInterval(parseInt(value))
                    }
                    className="w-[80px]"
                    disabled={scheduleType !== 'RECURRING_DATES'}
                  />
                  <Dropdown
                    options={[
                      { value: 'quarter', label: 'Quarter' },
                      { value: 'month', label: 'Month' },
                      { value: 'week', label: 'Week' },
                      { value: 'year', label: 'Year' },
                    ]}
                    value={recurringPeriod || 'quarter'}
                    onValueChange={(value) => setRecurringPeriod(value)}
                    className="w-[150px]"
                    disabled={scheduleType !== 'RECURRING_DATES'}
                  />
                </div>
              </div>

              {/* End after */}
              <div className="flex items-center gap-2">
                <span className="text-slate-700 w-[180px] body2-regular">
                  End after:
                </span>
                <Dropdown
                  options={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '8', label: '8' },
                    { value: '12', label: '12' },
                  ]}
                  value={recurringOccurrences?.toString() || '4'}
                  onValueChange={(value) =>
                    setRecurringOccurrences(parseInt(value))
                  }
                  className="w-[80px]"
                  disabled={scheduleType !== 'RECURRING_DATES'}
                />
                <span className="text-slate-700 body2-regular">
                  occurrences
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Names Section */}
      {showReportNamesSection && (
        <div className="mt-8">
          <h3 className="text-slate-700 mb-2">Report Names</h3>
          <p className="body2-regular text-slate-700 mb-4">
            Report names will be auto-generated based on your date selections
            above. You can make changes to them below.
          </p>

          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-left text-slate-700 font-medium">
                  DATE
                </TableHead>
                <TableHead className="text-left text-slate-700 font-medium">
                  NAME
                </TableHead>
                <TableHead className="w-16"></TableHead> {/* Actions */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportNames.map((rn, index) => {
                const dateObj = getDateFromString(rn.schedule_time);
                return (
                  <TableRow key={index} className="border-t border-slate-200">
                    <TableCell className="text-slate-700">
                      {format(dateObj, 'MMMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {editing[index] ? (
                        <Input
                          value={rn.report_name || ''}
                          onChange={(e) =>
                            handleReportNameChange(
                              rn.schedule_time,
                              e.target.value,
                            )
                          }
                          className="border-none h-8" // Simplified style
                        />
                      ) : (
                        rn.report_name || ''
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditingToggle(index)}
                          title={editing[index] ? 'Save Name' : 'Edit Name'}
                        >
                          <PencilIcon className="h-4 w-4 text-slate-500" />
                        </Button>
                        {/* Remove button only for specific dates in this UI section for individual items.
                            Recurring dates are managed by changing recurring settings. */}
                        {scheduleType === 'SPECIFIC_DATES' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemoveDate(rn.schedule_time)}
                            title="Remove this date"
                          >
                            <XCircleIcon className="h-4 w-4 text-slate-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Only show the Next button when we have valid schedules */}
          <Button
            onClick={handleNextClick}
            disabled={isSubmitting}
            className="w-full h-[52px] rounded-[6px] bg-orange-500 text-white max-w-[884px] py-[14px] mt-4"
          >
            {
              `Next: ${stepLabels[currentStep]}` /* Assuming currentStep is 1-indexed for labels array */
            }
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScheduleStep;
