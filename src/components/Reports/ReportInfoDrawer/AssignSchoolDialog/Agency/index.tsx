import React, { Dispatch, SetStateAction } from 'react';
import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { Checkbox } from '@/components/base/Checkbox';
import { ScrollArea } from '@/components/base/ScrollArea';
import { SearchBar } from '@/components/base/SearchBar';

import { SchoolResponse } from '@/store/slices/schoolsSlice';

interface AssignSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  loading: boolean;
  filteredSchools: SchoolResponse[];
  assignedSchools: SchoolResponse[];
  unassignedSchools: SchoolResponse[];
  handleAssign: (school: SchoolResponse) => void;
  setUnassignedSchools: Dispatch<SetStateAction<SchoolResponse[]>>;
  setAssignedSchools: Dispatch<SetStateAction<SchoolResponse[]>>;
  handleUnassign: (school: SchoolResponse) => void;
  handleSelectAll: () => void;
  handleSubmit: () => void;
}

const AssignSchoolDialog: React.FC<AssignSchoolDialogProps> = ({
  open,
  onOpenChange,
  searchText,
  setSearchText,
  filteredSchools,
  assignedSchools,
  handleAssign,
  setUnassignedSchools,
  setAssignedSchools,
  handleUnassign,
  handleSelectAll,
  unassignedSchools,
  loading,
  handleSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] h-[607px] bg-white p-0 gap-0 flex flex-col">
        <DialogHeader className="border-b border-slate-200 p-4">
          <DialogTitle>
            <h3 className="text-slate-700 body1-medium">
              Select schools to assign
            </h3>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left column - School selection */}
          <div className="border-r border-slate-200 flex flex-col h-full w-1/2">
            <div className="flex items-center gap-2 h-[54px] px-4 py-2 bg-slate-50 border-b border-slate-200">
              <SearchBar
                placeholder="Search schools"
                className="w-full"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <ScrollArea className="flex-1 p-4">
              {filteredSchools.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer"
                    >
                      <Checkbox
                        checked={assignedSchools.some(
                          (s) => s.id === school.id,
                        )}
                        onCheckedChange={() => handleAssign(school)}
                        className="border-slate-300"
                      />
                      <span onClick={() => handleAssign(school)}>
                        {school.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-4">
                  No schools found
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Right column - Selected schools */}
          <div className="flex flex-col h-full w-1/2">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 h-[54px]">
              <p className="body2-medium">
                Selected schools ({assignedSchools.length})
              </p>
              {assignedSchools.length > 0 && (
                <Button
                  variant="ghost"
                  className="text-red-500 h-auto p-1 text-xs"
                  onClick={() => {
                    setUnassignedSchools((prev) => [
                      ...prev,
                      ...assignedSchools,
                    ]);
                    setAssignedSchools([]);
                  }}
                >
                  Remove all
                </Button>
              )}
            </div>
            {assignedSchools.length === 0 ? (
              <div className="flex flex-col items-center p-6 gap-6">
                <div className="w-[100.5px] h-[96px] mb-4">
                  <img
                    src="/assets/images/list-document.svg"
                    alt="No schools selected"
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <p className="body1-medium">Add Schools</p>
                  <p className="body2-regular text-slate-500 text-center">
                    Use search on the left to add schools either by name, or by
                    report.
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-2">
                  {assignedSchools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center justify-between py-3 px-4 border-b border-slate-100 last:border-b-0"
                    >
                      <span className="text-sm text-slate-800">
                        {school.name}
                      </span>
                      <Button
                        variant="ghost"
                        className="h-6 w-6 p-0 rounded-full hover:bg-slate-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnassign(school);
                        }}
                      >
                        <X className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <div className="flex gap-2 w-full p-4 border-t border-slate-200">
          <div className="flex-1">
            <Button
              variant="ghost"
              className="p-[8px_12px] rounded-[3px] text-blue-500"
              onClick={handleSelectAll}
              disabled={unassignedSchools.length === 0}
            >
              <p className="body2-medium">Select all</p>
            </Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-[72px] rounded-[3px] h-[34px] p-[8px_12px] border-slate-500"
            >
              <span className="body2-medium">Cancel</span>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-[72px] rounded-[3px] h-[34px] p-[8px_12px] bg-blue-500"
            >
              <span className="body2-medium text-white">Assign</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignSchoolDialog;
