import React from 'react';
import {
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  FaceFrownIcon,
  ShareIcon,
  CalendarIcon,
  DocumentMagnifyingGlassIcon,
  UserIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  InboxArrowDownIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

import { DataLoading } from '@/components/base/Loading';

export interface PrivilegeItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const agencyPrivilegesData: PrivilegeItem[] = [
  { id: '1', label: 'Dashboard', icon: ChartBarSquareIcon },
  { id: '3', label: 'Schools', icon: BuildingOffice2Icon },
  { id: '2', label: 'Reports', icon: ClipboardDocumentCheckIcon },
  { id: '4', label: 'Submissions', icon: ClipboardDocumentCheckIcon },
  { id: '5', label: 'Applications', icon: DocumentTextIcon },
  { id: '6', label: 'Complaints', icon: FaceFrownIcon },
  { id: '7', label: 'Accountability', icon: ShareIcon },
  { id: '9', label: 'Reportwell University', icon: CalendarIcon },
  { id: '13', label: 'Transparency', icon: DocumentMagnifyingGlassIcon },
  { id: '17', label: 'Inbox', icon: InboxArrowDownIcon },
  { id: '18', label: 'Analytics', icon: ChartPieIcon },
];

export const schoolPrivilegesData: PrivilegeItem[] = [
  { id: '1', label: 'Dashboard', icon: ChartBarSquareIcon },
  { id: '8', label: 'Your School', icon: BuildingOffice2Icon },
  { id: '2', label: 'Reports', icon: ChartBarSquareIcon },
  { id: '5', label: 'Applications', icon: DocumentTextIcon },
  {
    id: '9',
    label: 'Reportwell University',
    icon: UserIcon,
  },
  { id: '14', label: 'Calendar', icon: CalendarIcon },
  { id: '15', label: 'Subscription', icon: CreditCardIcon },
  { id: '16', label: 'FAQ', icon: QuestionMarkCircleIcon },
  { id: '17', label: 'Inbox', icon: InboxArrowDownIcon },
  { id: '18', label: 'Analytics', icon: ChartPieIcon },
];

interface PrivilegeButtonProps {
  item: PrivilegeItem;
  selected: boolean;
  onToggle: () => void;
  isLoading?: boolean; // Added to disable button during async operations
}

const PrivilegeButton: React.FC<PrivilegeButtonProps> = ({
  item,
  selected,
  onToggle,
  isLoading,
}) => {
  const IconComponent = item.icon;
  return (
    <button
      onClick={onToggle}
      disabled={isLoading} // Disable button if loading
      className={`flex flex-col items-center justify-center p-4 m-2 w-32 h-32 rounded-lg shadow-md transition-colors
                  ${selected ? 'bg-rose-100 border-rose-300 border-2 text-rose-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 border text-slate-800'}
                  ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      <IconComponent
        className={`h-10 w-10 mb-2 ${selected ? 'text-rose-600' : 'text-slate-700'}`}
      />
      <span className={'text-sm font-medium'}>{item.label}</span>
    </button>
  );
};

interface PrivilegesSettingsFormProps {
  selectedAgencyPrivileges: string[];
  selectedSchoolPrivileges: string[];
  onTogglePrivilege: (privilegeId: string, type: 'agency' | 'school') => void;
  agencyDataExists: boolean; // To handle cases where agency data might not be available
  isLoading: boolean; // General loading state for updates or initial load
  error?: string; // To display any relevant errors
}

const PrivilegesSettings: React.FC<PrivilegesSettingsFormProps> = ({
  selectedAgencyPrivileges,
  selectedSchoolPrivileges,
  onTogglePrivilege,
  agencyDataExists,
  isLoading,
  error,
}) => {
  if (isLoading && !agencyDataExists) {
    // Show data loading only if agency data isn't there yet and it's the initial load
    return <DataLoading />;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!agencyDataExists && !isLoading) {
    // If not loading and still no data, it means data wasn't found or another error
    return (
      <div className="text-center p-4">
        Agency data not found or an error occurred.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 overflow-y-auto h-full p-1">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          Access Privileges
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Select which modules the agency has access to{' '}
          <span className="font-semibold text-slate-700">
            Selected ({selectedAgencyPrivileges.length})
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {agencyPrivilegesData.map((item) => (
            <PrivilegeButton
              key={`agency-${item.id}`}
              item={item}
              selected={selectedAgencyPrivileges.includes(item.id)}
              onToggle={() => onTogglePrivilege(item.id, 'agency')}
              isLoading={isLoading} // Pass loading state to individual buttons
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1 pt-4">
          School Access Privileges
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Select which modules the agency's schools have access to{' '}
          <span className="font-semibold text-slate-700">
            Selected ({selectedSchoolPrivileges.length})
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {schoolPrivilegesData.map((item) => (
            <PrivilegeButton
              key={`school-${item.id}`}
              item={item}
              selected={selectedSchoolPrivileges.includes(item.id)}
              onToggle={() => onTogglePrivilege(item.id, 'school')}
              isLoading={isLoading} // Pass loading state to individual buttons
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivilegesSettings;
