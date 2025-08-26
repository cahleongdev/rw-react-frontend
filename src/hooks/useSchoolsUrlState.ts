import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface SchoolsUrlState {
  tab: 'schools' | 'users';
  search: string;
  sort: 'a-z' | 'z-a';
  type: string; // For schools: 'All' | 'Network' | 'School'
  status: string; // For schools: 'All' | 'Active' | 'Inactive', For users: 'All' | 'Active' | 'Inactive' | 'Pending'
}

const defaultState: SchoolsUrlState = {
  tab: 'schools',
  search: '',
  sort: 'a-z',
  type: 'All',
  status: 'All',
};

export const useSchoolsUrlState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getState = useCallback((): SchoolsUrlState => {
    return {
      tab: (searchParams.get('tab') as 'schools' | 'users') || defaultState.tab,
      search: searchParams.get('search') || defaultState.search,
      sort: (searchParams.get('sort') as 'a-z' | 'z-a') || defaultState.sort,
      type: searchParams.get('type') || defaultState.type,
      status: searchParams.get('status') || defaultState.status,
    };
  }, [searchParams]);

  const updateState = useCallback(
    (updates: Partial<SchoolsUrlState>) => {
      const currentState = getState();
      const newState = { ...currentState, ...updates };

      const newParams = new URLSearchParams();

      // Only add non-default values to URL
      Object.entries(newState).forEach(([key, value]) => {
        if (value && value !== defaultState[key as keyof SchoolsUrlState]) {
          newParams.set(key, value);
        }
      });

      setSearchParams(newParams);
    },
    [getState, setSearchParams],
  );

  return {
    state: getState(),
    updateState,
  };
};
