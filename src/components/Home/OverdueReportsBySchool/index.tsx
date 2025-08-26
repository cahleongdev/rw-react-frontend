import { useState, useEffect } from 'react';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

import axiosInstance from '@/api/axiosInstance';

import { BarChart } from '@/components/base/Charts/BarChart';
import { Widget } from '@/components/base/Widget';
import { Button } from '@/components/base/Button';

import SendReminderDialog from './SendReminderDialog';

// Define the type for school data
interface SchoolOverdueReport {
  name: string;
  overdueReports: number;
}

// Define the API response type based on the actual API response
interface OverdueReportApiItem {
  school_name: string;
  submission_count: number;
}

const OverdueReportsBySchool = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schools, setSchools] = useState<SchoolOverdueReport[]>([]);

  // Function to fetch data from API
  const fetchOverdueReportsData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<OverdueReportApiItem[]>(
        '/dashboards/overduereports',
      );

      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Process the API response to aggregate submissions by school
      const schoolMap = new Map<string, number>();

      response.data.forEach((item) => {
        const currentCount = schoolMap.get(item.school_name) || 0;
        schoolMap.set(item.school_name, currentCount + item.submission_count);
      });

      // Convert the map to our expected format
      const processedSchools: SchoolOverdueReport[] = Array.from(
        schoolMap.entries(),
      )
        .map(([name, count]) => ({
          name,
          overdueReports: count,
        }))
        // Sort by overdueReports in descending order
        .sort((a, b) => b.overdueReports - a.overdueReports);

      setSchools(processedSchools);
      setError(null);
    } catch (err) {
      console.error('Error fetching overdue reports data:', err);
      setError('Failed to load overdue reports data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchOverdueReportsData();
  }, []);

  return (
    <Widget>
      <div className="flex flex-col w-full p-[16px_24px] border-b-[1px] border-beige-500 flex-1">
        <div className="flex flex-col w-full gap-6 flex-1">
          <div className="flex gap-6 items-center justify-between w-full">
            <span className="text-base">Overdue Reports by School</span>
            <Button
              variant="ghost"
              size="icon"
              className="relative w-6 h-6 drag-handle cursor-move"
            >
              <ArrowsPointingOutIcon className="size-6 text-slate-300" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-[250px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-[250px] text-red-500">
              {error}
            </div>
          ) : (
            <BarChart schools={schools} />
          )}
        </div>
      </div>
      <div className="flex w-full justify-end p-[6px_8px]">
        <Button
          variant="outline"
          className="cursor-pointer bg-white border-slate-300 rounded-[6px] h-[34px] p-[8px_12px]"
          onClick={() => setDialogOpen(true)}
        >
          <span className="text-slate-700 button3">Send reminders</span>
        </Button>
      </div>

      <SendReminderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        schools={schools}
      />
    </Widget>
  );
};

export default OverdueReportsBySchool;
