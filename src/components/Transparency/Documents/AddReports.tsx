import * as React from 'react';
import { Checkbox, Indicator } from '@radix-ui/react-checkbox';
import {
  XMarkIcon,
  XCircleIcon,
  CheckIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  // ArrowUpIcon,
  // ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { ScrollArea } from '@radix-ui/react-scroll-area';

import { TransparencyReport } from '@containers/Transparency/index.types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { SearchBar } from '@components/base/SearchBar';
import { useState } from 'react';

interface AddReportsProps {
  open: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  setSearchText: (text: string) => void;
  searchText: string;
  assignedReports: TransparencyReport[];
  handleAssign: (report: TransparencyReport) => void;
  handleUnassign: (report: TransparencyReport) => void;
  handleSelectAll: () => void;
  unassignedReports: TransparencyReport[];
  setUnassignedReports: (unassignedReports: TransparencyReport[]) => void;
  setAssignedReports: (reports: TransparencyReport[]) => void;
  loading: boolean;
}

const AddReports: React.FC<AddReportsProps> = ({
  open,
  onSubmit,
  onClose,
  setSearchText,
  searchText,
  assignedReports,
  handleAssign,
  handleUnassign,
  handleSelectAll,
  unassignedReports,
  setUnassignedReports,
  setAssignedReports,
  loading,
}: AddReportsProps) => {
  const [unassignedDirection, setUnassignedDirection] = useState<
    Map<string, 'asc' | 'desc'>
  >(
    new Map([
      ['name', 'asc'],
      ['due_date', 'asc'],
    ]),
  );
  const [assignedDirection, setAssignedDirection] = useState<
    Map<string, 'asc' | 'desc'>
  >(
    new Map([
      ['name', 'asc'],
      ['due_date', 'asc'],
    ]),
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  const sortReports = (
    reports: TransparencyReport[],
    sortBy: string,
    isAssigned: boolean,
  ) => {
    const direction = isAssigned ? assignedDirection : unassignedDirection;
    const sortDirection = direction.get(sortBy) === 'asc' ? 1 : -1;

    let sortedReports: TransparencyReport[] = [];
    if (sortBy === 'name') {
      sortedReports = reports.sort(
        (a, b) => a.name.localeCompare(b.name) * sortDirection,
      );
    } else if (sortBy === 'due_date') {
      sortedReports = reports.sort(
        (a, b) =>
          (new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) *
          sortDirection,
      );
    }

    const updatedDirection = sortDirection === 1 ? 'desc' : 'asc';

    const newMap = new Map(direction);
    newMap.set(sortBy, updatedDirection);
    if (isAssigned) {
      setAssignedReports(sortedReports);
      setAssignedDirection(newMap);
    } else {
      setUnassignedReports(sortedReports);
      setUnassignedDirection(newMap);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogContent
          className="bg-white rounded-[8px] p-0 sm:max-w-[60vw] sm:min-h-[20vh] sm:max-h-[80vh] gap-0"
          showClose={false}
        >
          <DialogHeader className="gap-0 flex flex-row justify-between items-center p-4 border-b border-slate-200">
            <DialogTitle className="text-xl">
              Add Reports and Documents to Folder
            </DialogTitle>
            <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
            <DialogDescription className="text-sm text-slate-500 hidden">
              Add reports and documents to the folder.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 h-[calc(80vh-180px)]">
            {/* Left column - Reports selection */}
            <div className="border-r border-slate-200 flex flex-col h-full w-1/2">
              <div className="flex items-center gap-2 h-[54px] px-4 py-2 bg-slate-50 border-b border-slate-200 flex-row">
                <p className="body2-medium">Add Reports</p>
                <SearchBar
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[calc(100%-54px)] flex-1  overflow-y-auto">
                <div className="px-6 bg-white bg-slate-100 flex flex-row gap-2 justify-between px-4 border-b border-slate-200">
                  <div className="flex flex-row gap-2 items-center">
                    <h5 className="text-slate-900">Report Name</h5>
                    <Button
                      onClick={() => {
                        sortReports(unassignedReports, 'name', false);
                      }}
                      className="bg-white text-slate-1000 hover:bg-slate-200 h-[40px] shadow-none justify-center items-center"
                    >
                      {unassignedDirection.get('name') === 'asc' ? (
                        <BarsArrowUpIcon className="size-6 text-orange-500" />
                      ) : (
                        <BarsArrowDownIcon className="size-6 text-orange-500" />
                      )}
                    </Button>
                  </div>
                  {/* TODO: When Report Years is added back */}
                  {/* <div className="flex flex-row gap-2 items-center">
                    <h5 className="text-slate-900">Due Date</h5>
                    <Button
                      onClick={() => {
                        sortReports(unassignedReports, 'due_date', false);
                      }}
                      className="bg-white text-slate-1000 hover:bg-slate-200 h-[40px] shadow-none justify-center items-center"
                    >
                      {unassignedDirection.get('due_date') === 'asc' ? (
                        <ArrowUpIcon className="size-6 text-slate-400" />
                      ) : (
                        <ArrowDownIcon className="size-6 text-slate-400" />
                      )}
                    </Button>
                  </div> */}
                  <div className="flex flex-row gap-2">
                    <span> </span>
                  </div>
                </div>
                {unassignedReports.length > 0 ? (
                  <div className="flex flex-col gap-2 overflow-auto p-4">
                    {unassignedReports.map((report) => (
                      <div
                        key={report.id}
                        className="group flex items-center gap-2 p-2 hover:bg-slate-100 group-hover:border group-hover:border-slate-200 rounded cursor-pointer group-hover:shadow-lg rounded-lg"
                        onClick={() => handleAssign(report)}
                      >
                        <div className="flex justify-left w-full items-center gap-2">
                          <Checkbox
                            onCheckedChange={() => handleAssign(report)}
                            className="size-5 group-hover:bg-green-500 rounded border border-slate-200 group-hover:block"
                            checked={true}
                          >
                            <Indicator className="CheckboxIndicator hidden group-hover:block rounded group-hover:bg-green-500 group-hover:shadow-lg">
                              <CheckIcon className="size-5 overflow-hidden text-white" />
                            </Indicator>
                          </Checkbox>
                          <p
                            className="text-sm ml-2"
                            onClick={() => handleAssign(report)}
                          >
                            {report.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <div className="w-[100.5px] h-[96px] mb-4 items-center justify-center">
                      <img
                        src="assets/images/svg/no-results.svg"
                        alt="No results"
                        className="w-full h-full items-center justify-center"
                      />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <p className="body1-medium">No results were found</p>
                      <p className="body2-regular text-slate-500 text-center">
                        Try clearing your filters and search
                      </p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Right column - Selected reports and documents */}
            <div className="flex flex-col h-full w-1/2">
              <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 h-[54px]">
                <p className="body2-medium">
                  Selected reports and documents ({assignedReports.length})
                </p>
                {assignedReports.length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-red-500 h-auto p-2 border-transparent text-sm hover:text-red-500 hover:bg-red-100 hover:border hover:border-red-200"
                    onClick={() => {
                      setUnassignedReports([
                        ...unassignedReports,
                        ...assignedReports,
                      ]);
                      setAssignedReports([]);
                    }}
                  >
                    Remove all
                  </Button>
                )}
              </div>
              <div className="overflow-y-scroll">
                <div className="px-6 bg-white bg-slate-100 flex flex-row gap- justify-between border-b border-slate-200">
                  <div className="flex flex-row gap-2 items-center">
                    <h5 className="text-slate-900">Report Name</h5>
                    <Button
                      onClick={() => {
                        sortReports(assignedReports, 'name', true);
                      }}
                      className="bg-white text-slate-1000 hover:bg-slate-200 h-[40px] shadow-none justify-center items-center"
                    >
                      {assignedDirection.get('name') === 'asc' ? (
                        <BarsArrowUpIcon className="size-6 text-orange-500" />
                      ) : (
                        <BarsArrowDownIcon className="size-6 text-orange-500" />
                      )}
                    </Button>
                  </div>
                  {/* TODO: When Report Years is added back */}
                  {/* <div className="flex flex-row gap-2 items-center">
                    <h5 className="text-slate-900">Due Date</h5>
                    <Button
                      onClick={() => {
                        sortReports(assignedReports, 'due_date', true);
                      }}
                      className="bg-white text-slate-1000 hover:bg-slate-200 h-[40px] shadow-none justify-center items-center"
                    >
                      {assignedDirection.get('due_date') === 'asc' ? (
                        <ArrowUpIcon className="size-6 text-slate-400" />
                      ) : (
                        <ArrowDownIcon className="size-6 text-slate-400" />
                      )}
                    </Button>
                  </div> */}
                  <div className="flex flex-row gap-2">
                    <span> </span>
                  </div>
                </div>
                {assignedReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 gap-6 h-[calc(100%-54px)]">
                    <div className="w-[100.5px] h-[96px] mb-4">
                      <img
                        src="/assets/images/list-document.svg"
                        alt="No schools selected"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <p className="body1-medium items-center justify-center">
                        Add Reports and Documents
                      </p>
                      <p className="body2-regular text-slate-500 text-center">
                        Use search on the left to add reports
                      </p>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100%-54px)] flex-1 p-4 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {assignedReports.map((report) => (
                        <div
                          key={report.id}
                          className="group flex items-center justify-between gap-2 py-2 px-4 shadow-none hover:bg-slate-100 cursor-pointer rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnassign(report);
                          }}
                        >
                          <p className="text-sm text-slate-800">
                            {report.name}
                          </p>
                          <XCircleIcon className="size-5 text-slate-900 group-hover:text-red-500 cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 border-t border-slate-200 bg-beige-100">
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <Button
                  variant="ghost"
                  className="p-[8px_12px] rounded text-blue-500 hover:text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:border"
                  onClick={handleSelectAll}
                  disabled={unassignedReports.length === 0}
                >
                  <p className="body2-medium hover:text-blue-500 ">
                    Select all
                  </p>
                </Button>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="w-[72px] rounded-[3px] h-[34px] p-[8px_12px] border-slate-500"
                >
                  <span className="body2-medium">Cancel</span>
                </Button>
                <Button
                  type="submit"
                  onClick={(e) => {
                    handleSubmit(
                      e as unknown as React.FormEvent<HTMLFormElement>,
                    );
                  }}
                  disabled={loading}
                  className="w-[72px] rounded-[3px] h-[34px] p-[8px_12px] bg-blue-500"
                >
                  <span className="body2-medium text-white">Assign</span>
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddReports;
