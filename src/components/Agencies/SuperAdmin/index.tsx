import { Dispatch, SetStateAction } from 'react';
// import { useNavigate } from 'react-router-dom'; // Removed unused import
import {
  TrashIcon,
  Cog6ToothIcon,
  PencilIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import { SearchBar } from '@/components/base/SearchBar';
import { Button } from '@/components/base/Button';
import { Badge } from '@/components/base/Badge';
import { Checkbox } from '@/components/base/Checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/base/Table';
import { Loading } from '@/components/base/Loading';
import SortLabel from '@/components/Notifications/SortLabel'; // Assuming this is generic
import { Agency } from '@/store/types';

// Extend Agency type to include status, which might come from frontend logic if not in API
interface AgencyWithStatus extends Agency {
  status: 'active' | 'inactive'; // Or whatever your status types are
}

interface AgenciesProps {
  isAddAgencyOpen: boolean;
  setIsAddAgencyOpen: Dispatch<SetStateAction<boolean>>;

  sortOrder: 'newest' | 'oldest';
  setSortOrder: Dispatch<SetStateAction<'newest' | 'oldest'>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  loading: boolean;
  agencies: AgencyWithStatus[]; // This should be the filtered and sorted list

  handleEdit: (id: string) => void;
  handleView: (id: string) => void;
  handleDeletePrompt: (id: string) => void; // Renamed to avoid conflict, triggers delete dialog

  handleTabChange: (tab: string) => void;
  activeFilter: string; // 'Active' or 'Inactive'

  selectedRows: string[];
  setSelectedRows: Dispatch<SetStateAction<string[]>>;
  toggleSelectAll: () => void;
}

const AgenciesComponent: React.FC<AgenciesProps> = ({
  setIsAddAgencyOpen,
  sortOrder,
  setSortOrder,
  searchText,
  setSearchText,
  loading,
  agencies,
  handleEdit,
  handleView,
  handleDeletePrompt,
  handleTabChange,
  activeFilter,
  selectedRows,
  setSelectedRows,
  toggleSelectAll,
}) => {
  const tabLabels = ['Active', 'Inactive'];

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex justify-between items-center py-4 px-6 border-b-[1px] border-beige-300 bg-beige-100 flex-shrink-0 gap-4">
        <h3 className="text-slate-900 font-semibold">Agencies</h3>
        <div className="flex flex-1">
          {tabLabels.map((filter) => (
            <button
              key={filter}
              onClick={() => handleTabChange(filter)}
              className={`
                px-4 py-2 
                rounded-[5px]
                text-sm font-medium
                transition-colors
                ${
                  activeFilter === filter
                    ? 'bg-blue-50 text-blue-500 hover:bg-blue-50'
                    : 'bg-transparent text-slate-500 hover:bg-neutral-100'
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddAgencyOpen(true)}
            className="cursor-pointer bg-blue-500 rounded-[6px] hover:bg-blue-600 h-[36px] px-3 py-2 text-white button2-semibold flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Agency
          </Button>
        </div>
      </div>

      {/* Search and Filter bar */}
      <div className="flex w-full h-[56px] items-center p-4 border-b-[1px] border-beige-300 justify-between">
        <div className="flex gap-2 items-center">
          <div className="flex p-2">
            <SortLabel value={sortOrder} onSort={setSortOrder} />
          </div>
          {/* Category filter omitted as it's not relevant for agencies */}
        </div>
        <SearchBar
          placeholder="Search for agencies"
          className="w-[365px]"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Selection bar */}
      {selectedRows.length > 0 && (
        <div className="flex w-full gap-4 h-[56px] items-center p-[0px_24px] border-b-[1px] border-beige-300 bg-orange-50">
          <div className="flex items-center gap-2">
            <h5>
              {selectedRows.length} agency{selectedRows.length > 1 ? 's' : ''}{' '}
              selected
            </h5>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-slate-500 h-[36px] p-[10px]"
              onClick={() => {
                // For now, assume bulk delete is handled by container based on selectedRows
                // This button could trigger a specific bulk delete confirmation
                // For simplicity, let's say it prompts for the first selected agency
                if (selectedRows.length > 0) {
                  handleDeletePrompt(selectedRows[0]); // Or open a bulk delete dialog
                }
              }}
            >
              <TrashIcon className="h-6 w-6 text-slate-500" />
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      {loading ? (
        <Loading />
      ) : (
        <div className="py-4 flex-1 flex flex-col overflow-hidden">
          <Table>
            <TableHeader className="sticky top-0 bg-beige-100 z-10">
              <TableRow className="hover:bg-transparent">
                <TableCell className="py-2 px-4">
                  <Checkbox
                    checked={
                      agencies.length > 0 &&
                      selectedRows.length === agencies.length
                    }
                    onCheckedChange={toggleSelectAll}
                    className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                  />
                  <span className="body2-medium text-slate-500">
                    Agency Name
                  </span>
                </TableCell>
                <TableCell className="py-2 px-4">
                  <span className="body2-medium text-slate-500">Status</span>
                </TableCell>
                <TableCell className="py-2 px-4 flex justify-end">
                  {/* Cog icon can be for table settings, or remove if not needed */}
                  <Cog6ToothIcon className="h-6 w-6 text-slate-500" />
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencies.map((agency) => (
                <TableRow
                  key={agency.id}
                  className="border-b border-beige-500 hover:bg-beige-50/50 cursor-pointer bg-white"
                  // onClick={() => handleView(agency.id)} // Row click to view details
                >
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedRows.includes(agency.id)}
                        onCheckedChange={() => {
                          const newSelectedRows = selectedRows.includes(
                            agency.id,
                          )
                            ? selectedRows.filter((id) => id !== agency.id)
                            : [...selectedRows, agency.id];
                          setSelectedRows(newSelectedRows);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-2 border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white"
                      />
                      <span
                        className="body1-regular hover:text-primary"
                        onClick={() => handleView(agency.id)} // Make name clickable for view
                      >
                        {agency.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <Badge
                      variant={
                        agency.status === 'active' ? 'default' : 'secondary'
                      }
                      className={`${agency.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-900 border-yellow-300'} border rounded-[50px] p-[6px_12px] body2-bold`}
                    >
                      {agency.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleView(agency.id);}}
                        title="View Agency"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(agency.id);
                        }}
                        title="Edit Agency"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePrompt(agency.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete Agency"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Modals will be added here, triggered by state from container */}
    </div>
  );
};

export default AgenciesComponent;
