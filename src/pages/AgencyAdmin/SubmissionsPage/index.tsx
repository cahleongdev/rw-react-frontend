import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Update import path for the renamed and moved container
import { SubmissionsContainer } from '@/containers/Submissions/AgencyAdmin';
import {
  SubmissionStatus,
  LocalSubmissionFilters,
} from '@/store/slices/submissionsSlice';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SubmissionsPage: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const queryView = query.get('view');
  const initialView = (
    queryView === 'by-report' ? 'by-report' : 'by-school'
  ) as 'by-report' | 'by-school';

  const initialFilters: Partial<LocalSubmissionFilters> = {
    category: query.get('category') || 'all',
    teamMember: query.get('teamMember') || 'all',
    school: query.get('school') || 'all',
    status: (query.get('status') as SubmissionStatus | 'All') || 'All',
    year: query.get('year') || 'all',
  };

  const handleFiltersChangeForURL = (
    newFilters: LocalSubmissionFilters,
    newView: 'by-report' | 'by-school',
  ) => {
    const params = new URLSearchParams();
    params.set('view', newView);
    (Object.keys(newFilters) as Array<keyof LocalSubmissionFilters>).forEach(
      (key) => {
        const value = newFilters[key];
        if (value && value !== 'all' && String(value).trim() !== '') {
          params.set(key, String(value));
        }
      },
    );
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <SubmissionsContainer
      initialView={initialView}
      initialFilters={initialFilters}
      onFiltersChangeForURL={handleFiltersChangeForURL}
    />
  );
};

export default SubmissionsPage;
