import { useState, useEffect, useRef } from 'react';
import { CheckIcon, ArrowsPointingOutIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

import axiosInstance from '@/api/axiosInstance';

import { DonutChart } from '@/components/base/Charts/DonutChart';
import { Widget } from '@/components/base/Widget';
import { Button } from '@/components/base/Button';

import { cn } from '@/utils/tailwind';

// Define the API response types
interface GlanceApiResponse {
  submitted: {
    submitted: number;
    not_submitted: number;
  };
  timeliness: {
    on_time: number;
    late: number;
    past_due: number;
  };
  status: {
    completed: number;
    pending: number;
    returned: number;
    incomplete: number;
  };
}

interface FilterValuesApiResponse {
  reports: { id: string; name: string }[];
  schools: { id: string; name: string }[];
  domains: string[];
  teams: { id: string; first_name: string; last_name: string }[];
}

// Chart configurations
const submittedConfig = {
  Submitted: { label: 'Submitted', color: '#2A79FF' },
  NotSubmitted: { label: 'Not Submitted', color: '#F04A4C' },
};

const timelinessConfig = {
  OnTime: { label: 'On-Time', color: '#2A79FF' },
  Late: { label: 'Late', color: '#FFB020' },
  PastDue: { label: 'Past Due', color: '#F04A4C' },
};

const statusConfig = {
  Completed: { label: 'Completed', color: '#2A79FF' },
  Pending: { label: 'Pending', color: '#FFB020' },
  Returned: { label: 'Returned', color: '#FF8B3E' },
  Incomplete: { label: 'Incomplete', color: '#F04A4C' },
};

const qualityConfig = {
  Exceeds: { label: 'Exceeds', color: '#2A79FF' },
  Meets: { label: 'Meets', color: '#FFB020' },
  Approaches: { label: 'Approaches', color: '#FF8B3E' },
  DoesNotMeet: { label: 'Does not meet', color: '#F04A4C' },
};

// Default quality data (not provided by API)
const qualityData = [
  { name: 'Exceeds', value: 19, fill: qualityConfig.Exceeds.color },
  { name: 'Meets', value: 23, fill: qualityConfig.Meets.color },
  { name: 'Approaches', value: 30, fill: qualityConfig.Approaches.color },
  { name: 'Does not meet', value: 30, fill: qualityConfig.DoesNotMeet.color },
];

const ReportsAtGlance = () => {
  // State to store API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    submitted: { name: string; value: number; fill: string }[];
    timeliness: { name: string; value: number; fill: string }[];
    status: { name: string; value: number; fill: string }[];
  } | null>(null);

  // State for filter options
  const [filterOptions, setFilterOptions] = useState({
    school: [{ id: 'all-schools', label: 'All', value: 'all' }],
    report: [{ id: 'all-reports', label: 'All', value: 'all' }],
    domain: [{ id: 'all-domains', label: 'All', value: 'all' }],
    team: [{ id: 'all-teams', label: 'All', value: 'all' }],
    year: [
      { id: 'all-years', label: 'All', value: 'all' },
      { id: 'year-2025', label: '2025', value: '2025' },
      { id: 'year-2024', label: '2024', value: '2024' },
      { id: 'year-2023', label: '2023', value: '2023' },
      { id: 'year-2022', label: '2022', value: '2022' },
    ],
    month: [
      { id: 'all-months', label: 'All', value: 'all' },
      { id: 'month-1', label: 'January', value: '1' },
      { id: 'month-2', label: 'February', value: '2' },
      { id: 'month-3', label: 'March', value: '3' },
      { id: 'month-4', label: 'April', value: '4' },
      { id: 'month-5', label: 'May', value: '5' },
      { id: 'month-6', label: 'June', value: '6' },
      { id: 'month-7', label: 'July', value: '7' },
      { id: 'month-8', label: 'August', value: '8' },
      { id: 'month-9', label: 'September', value: '9' },
      { id: 'month-10', label: 'October', value: '10' },
      { id: 'month-11', label: 'November', value: '11' },
      { id: 'month-12', label: 'December', value: '12' },
    ],
  });

  // State for filter values
  const [filters, setFilters] = useState({
    school: 'all',
    report: 'all',
    domain: 'all',
    team: 'all',
    year: 'all',
    month: 'all',
  });

  // State for dropdown visibility
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Refs for dropdown positioning
  const dropdownRefs = {
    school: useRef<HTMLDivElement>(null),
    report: useRef<HTMLDivElement>(null),
    domain: useRef<HTMLDivElement>(null),
    team: useRef<HTMLDivElement>(null),
    year: useRef<HTMLDivElement>(null),
    month: useRef<HTMLDivElement>(null),
  };

  // Function to fetch data with specific filters
  const fetchGlanceDataWithFilters = (currentFilters: typeof filters) => {
    setLoading(true);

    // Build query parameters based on provided filters
    const params: Record<string, string> = {};

    if (currentFilters.school !== 'all')
      params.school_id = currentFilters.school;
    if (currentFilters.report !== 'all')
      params.report_id = currentFilters.report;
    if (currentFilters.domain !== 'all') params.domain = currentFilters.domain;
    if (currentFilters.team !== 'all') params.team_id = currentFilters.team;
    if (currentFilters.year !== 'all') params.year = currentFilters.year;
    if (currentFilters.month !== 'all') params.month = currentFilters.month;

    console.log('Request params:', params);

    axiosInstance
      .get<GlanceApiResponse>('/dashboards/glance/', { params })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const apiData: GlanceApiResponse = response.data;

        // Transform API data to match our chart format
        const transformedData = {
          submitted: [
            {
              name: 'Submitted',
              value: apiData.submitted.submitted,
              fill: submittedConfig.Submitted.color,
            },
            {
              name: 'Not Submitted',
              value: apiData.submitted.not_submitted,
              fill: submittedConfig.NotSubmitted.color,
            },
          ],
          timeliness: [
            {
              name: 'On-Time',
              value: apiData.timeliness.on_time,
              fill: timelinessConfig.OnTime.color,
            },
            {
              name: 'Late',
              value: apiData.timeliness.late,
              fill: timelinessConfig.Late.color,
            },
            {
              name: 'Past Due',
              value: apiData.timeliness.past_due,
              fill: timelinessConfig.PastDue.color,
            },
          ],
          status: [
            {
              name: 'Completed',
              value: apiData.status.completed,
              fill: statusConfig.Completed.color,
            },
            {
              name: 'Pending',
              value: apiData.status.pending,
              fill: statusConfig.Pending.color,
            },
            {
              name: 'Returned',
              value: apiData.status.returned,
              fill: statusConfig.Returned.color,
            },
            {
              name: 'Incomplete',
              value: apiData.status.incomplete,
              fill: statusConfig.Incomplete.color,
            },
          ],
        };

        setData(transformedData);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching glance data:', err);
        setError('Failed to load reports data. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle filter changes
  const handleFilterChange = (
    filterName: keyof typeof filters,
    value: string,
  ) => {
    // Close the dropdown
    setActiveDropdown(null);

    // Create new filters object with the updated value
    const newFilters = {
      ...filters,
      [filterName]: value,
    };

    // Update filters state
    setFilters(newFilters);

    // Fetch data with the new filters
    fetchGlanceDataWithFilters(newFilters);
  };

  // Update the original fetchGlanceData to use the new function
  const fetchGlanceData = () => {
    fetchGlanceDataWithFilters(filters);
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const activeRef =
          dropdownRefs[activeDropdown as keyof typeof dropdownRefs];
        if (
          activeRef.current &&
          !activeRef.current.contains(event.target as Node)
        ) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  // Function to fetch filter values from API
  const fetchFilterValues = async () => {
    try {
      const response = await axiosInstance.get<FilterValuesApiResponse>(
        '/dashboards/filtervalues/',
      );

      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const apiData = response.data;

      // Transform API data to match our filter options format
      setFilterOptions((prev) => ({
        ...prev,
        school: [
          { id: 'all-schools', label: 'All', value: 'all' },
          ...apiData.schools.map((school) => ({
            id: school.id,
            label: school.name,
            value: school.id,
          })),
        ],
        report: [
          { id: 'all-reports', label: 'All', value: 'all' },
          ...apiData.reports.map((report) => ({
            id: report.id,
            label: report.name,
            value: report.id,
          })),
        ],
        domain: [
          { id: 'all-domains', label: 'All', value: 'all' },
          ...apiData.domains.map((domain) => ({
            id: `domain-${domain}`,
            label: domain,
            value: domain,
          })),
        ],
        team: [
          { id: 'all-teams', label: 'All', value: 'all' },
          ...apiData.teams.map((team) => ({
            id: team.id,
            label: `${team.first_name} ${team.last_name}`,
            value: team.id,
          })),
        ],
      }));
    } catch (err) {
      console.error('Error fetching filter values:', err);
      // We don't set an error state here as we can still use the default values
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    // Fetch both the glance data and filter values
    fetchGlanceData();
    fetchFilterValues();
  }, []);

  // Render dropdown menu
  const renderDropdownMenu = (filterName: keyof typeof filters) => {
    const options = filterOptions[filterName];
    const selectedValue = filters[filterName];

    return (
      <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden w-48">
        <div className="max-h-[300px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className={cn(
                'flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer',
                option.value === selectedValue && 'bg-blue-50',
              )}
              onClick={() => handleFilterChange(filterName, option.value)}
            >
              <span>{option.label}</span>
              {option.value === selectedValue && (
                <CheckIcon className="h-4 w-4 text-blue-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Widget>
      <div className="flex flex-col p-[16px_24px] w-full gap-6">
        <div className="flex gap-6 items-center">
          <span className="text-base">Reports at a glance</span>
          {/* Filters with Popup Dropdowns */}
          <div className="flex gap-4 text-xs text-gray-700 flex-1 items-center">
            <div className="relative" ref={dropdownRefs.school}>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => toggleDropdown('school')}
              >
                <span>School:</span>
                <span className="font-medium">
                  {
                    filterOptions.school.find((o) => o.value === filters.school)
                      ?.label
                  }
                </span>
                <ChevronDownIcon
                  className={cn(
                    'h-3 w-3 transition-transform',
                    activeDropdown === 'school' && 'transform rotate-180',
                  )}
                />
              </div>
              {activeDropdown === 'school' && renderDropdownMenu('school')}
            </div>

            <div className="relative" ref={dropdownRefs.report}>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => toggleDropdown('report')}
              >
                <span>Report:</span>
                <span className="font-medium">
                  {
                    filterOptions.report.find((o) => o.value === filters.report)
                      ?.label
                  }
                </span>
                <ChevronDownIcon
                  className={cn(
                    'h-3 w-3 transition-transform',
                    activeDropdown === 'report' && 'transform rotate-180',
                  )}
                />
              </div>
              {activeDropdown === 'report' && renderDropdownMenu('report')}
            </div>

            <div className="relative" ref={dropdownRefs.domain}>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => toggleDropdown('domain')}
              >
                <span>Domain:</span>
                <span className="font-medium">
                  {
                    filterOptions.domain.find((o) => o.value === filters.domain)
                      ?.label
                  }
                </span>
                <ChevronDownIcon
                  className={cn(
                    'h-3 w-3 transition-transform',
                    activeDropdown === 'domain' && 'transform rotate-180',
                  )}
                />
              </div>
              {activeDropdown === 'domain' && renderDropdownMenu('domain')}
            </div>

            <div className="relative" ref={dropdownRefs.team}>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => toggleDropdown('team')}
              >
                <span>Team:</span>
                <span className="font-medium">
                  {
                    filterOptions.team.find((o) => o.value === filters.team)
                      ?.label
                  }
                </span>
                <ChevronDownIcon
                  className={cn(
                    'h-3 w-3 transition-transform',
                    activeDropdown === 'team' && 'transform rotate-180',
                  )}
                />
              </div>
              {activeDropdown === 'team' && renderDropdownMenu('team')}
            </div>

            <div className="relative" ref={dropdownRefs.month}>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => toggleDropdown('month')}
              >
                <span>Month:</span>
                <span className="font-medium">
                  {
                    filterOptions.month.find((o) => o.value === filters.month)
                      ?.label
                  }
                </span>
                <ChevronDownIcon
                  className={cn(
                    'h-3 w-3 transition-transform',
                    activeDropdown === 'month' && 'transform rotate-180',
                  )}
                />
              </div>
              {activeDropdown === 'month' && renderDropdownMenu('month')}
            </div>

            <div className="relative" ref={dropdownRefs.year}>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                onClick={() => toggleDropdown('year')}
              >
                <span>Year:</span>
                <span className="font-medium">
                  {
                    filterOptions.year.find((o) => o.value === filters.year)
                      ?.label
                  }
                </span>
                <ChevronDownIcon
                  className={cn(
                    'h-3 w-3 transition-transform',
                    activeDropdown === 'year' && 'transform rotate-180',
                  )}
                />
              </div>
              {activeDropdown === 'year' && renderDropdownMenu('year')}
            </div>
          </div>
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
          <div className="flex justify-between w-full">
            <DonutChart
              title="Submitted"
              data={data?.submitted || []}
              config={submittedConfig}
            />
            <DonutChart
              title="Timeliness"
              data={data?.timeliness || []}
              config={timelinessConfig}
            />
            <DonutChart
              title="Status"
              data={data?.status || []}
              config={statusConfig}
            />
            <DonutChart
              title="Quality"
              data={qualityData}
              config={qualityConfig}
            />
          </div>
        )}
      </div>
    </Widget>
  );
};

export default ReportsAtGlance;
