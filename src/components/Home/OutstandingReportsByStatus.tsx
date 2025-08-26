import { useState, useEffect } from 'react';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow, parseISO, isPast } from 'date-fns';

import axiosInstance from '@/api/axiosInstance';

import { DonutChart } from '@/components/base/Charts/DonutChart';
import { Widget } from '@/components/base/Widget';
import { Button } from '@/components/base/Button';
import { ScrollArea } from '@/components/base/ScrollArea';
import { Tabs } from '@/components/base/Tabs';

// Define the API response type
interface OutstandingReportsApiResponse {
  Incomplete: {
    count: number;
    reports: Record<string, { count: number; last_date: string }>;
  };
  Returned: {
    count: number;
    reports: Record<string, { count: number; last_date: string }>;
  };
  Pending: {
    count: number;
    reports: Record<string, { count: number; last_date: string }>;
  };
}

// Define the report type
interface Report {
  title: string;
  schools: number;
  deadline: string;
}

const OutstandingReportsByStatus = () => {
  const [activeTab, setActiveTab] = useState('Incomplete');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<
    { name: string; value: number; fill: string }[]
  >([]);
  const [reportsByStatus, setReportsByStatus] = useState<
    Record<string, Report[]>
  >({
    Incomplete: [],
    Returned: [],
    Pending: [],
  });

  const tabs = [
    { id: 'Incomplete', label: 'Incomplete' },
    { id: 'Returned', label: 'Returned' },
    { id: 'Pending', label: 'Pending' },
  ];

  const statusConfig = {
    Incomplete: { label: 'Incomplete', color: '#40A688' },
    Returned: { label: 'Returned', color: '#91BE6D' },
    Pending: { label: 'Pending', color: '#577793' },
  };

  // Function to format deadline in a user-friendly way
  const formatDeadline = (dateString: string): string => {
    if (!dateString) {
      return 'TBD';
    }

    try {
      const date = parseISO(dateString);

      // If the date is in the past, return "overdue"
      if (isPast(date)) {
        return 'overdue';
      }

      // Format the relative time
      const distance = formatDistanceToNow(date, { addSuffix: false });

      // Simplify the output for better UI display
      if (distance.includes('less than a minute')) return 'now';
      if (distance.includes('about 1 month')) return '1 month';
      if (distance.includes('about ')) return distance.replace('about ', '');
      if (distance.includes('days')) {
        const days = parseInt(distance.split(' ')[0]);
        if (days <= 7) return `${days} days`;
        if (days <= 14) return 'next week';
        if (days <= 21) return '2 weeks';
        if (days <= 28) return '3 weeks';
        return '1 month';
      }
      if (distance.includes('months')) {
        const months = parseInt(distance.split(' ')[0]);
        return `${months} months`;
      }

      return distance;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'TBD';
    }
  };

  // Function to fetch data from API
  const fetchOutstandingReportsData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<OutstandingReportsApiResponse>(
        '/dashboards/outstandingreports',
      );

      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const apiData = response.data;

      // Transform API data for the donut chart
      const transformedChartData = [
        {
          name: 'Incomplete',
          value: apiData.Incomplete.count,
          fill: statusConfig.Incomplete.color,
        },
        {
          name: 'Returned',
          value: apiData.Returned.count,
          fill: statusConfig.Returned.color,
        },
        {
          name: 'Pending',
          value: apiData.Pending.count,
          fill: statusConfig.Pending.color,
        },
      ];

      // Transform API data for the reports list
      const transformedReports: Record<string, Report[]> = {
        Incomplete: Object.entries(apiData.Incomplete.reports).map(
          ([title, data]) => ({
            title,
            schools: data.count,
            deadline: formatDeadline(data.last_date),
          }),
        ),
        Returned: Object.entries(apiData.Returned.reports).map(
          ([title, data]) => ({
            title,
            schools: data.count,
            deadline: formatDeadline(data.last_date),
          }),
        ),
        Pending: Object.entries(apiData.Pending.reports).map(
          ([title, data]) => ({
            title,
            schools: data.count,
            deadline: data.last_date ? formatDeadline(data.last_date) : 'TBD',
          }),
        ),
      };

      setStatusData(transformedChartData);
      setReportsByStatus(transformedReports);
      setError(null);
    } catch (err) {
      console.error('Error fetching outstanding reports data:', err);
      setError(
        'Failed to load outstanding reports data. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchOutstandingReportsData();
  }, []);

  return (
    <Widget>
      <div className="flex flex-col gap-6 p-[16px_24px] w-full flex-1">
        <div className="flex gap-6 items-center justify-between">
          <span className="text-base">Outstanding reports by status</span>
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-move relative w-6 h-6"
          >
            <ArrowsPointingOutIcon className="size-6 text-slate-300" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[200px] text-red-500">
            {error}
          </div>
        ) : (
          <div className="flex gap-6 justify-between h-full">
            <DonutChart
              data={statusData}
              config={statusConfig}
              innerRadius="70%"
            />
            <div className="max-w-lg flex-col flex w-full">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {/* Content */}
              <div className="h-[250px] pt-4">
                <ScrollArea className="h-full">
                  <div className="mt-4 space-y-4">
                    {reportsByStatus[activeTab]?.length > 0 ? (
                      reportsByStatus[activeTab].map((report) => (
                        <div
                          key={report.title}
                          className="flex justify-between items-center gap-2"
                        >
                          <div className="flex flex-col gap-1 flex-1">
                            <p className="text-lg font-semibold flex-1 overflow-hidden">
                              {report.title}
                            </p>
                            <p className="text-gray-500">
                              {report.schools} schools
                            </p>
                          </div>
                          <p className="text-gray-700 font-medium w-[85px]">
                            {report.deadline}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No reports found</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
      </div>
    </Widget>
  );
};

export default OutstandingReportsByStatus;
