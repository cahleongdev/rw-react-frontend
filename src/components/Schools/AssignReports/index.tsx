import React from 'react';
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
import { X } from 'lucide-react';

export interface Report {
  id: string;
  name: string;
}

interface AssignReportsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportSearchText: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableReports: Report[];
  selectedReports: Report[];
  loading: boolean;
  onAssign: (report: Report) => void;
  onUnassign: (report: Report) => void;
  onSelectAll: () => void;
  onRemoveAll: () => void;
  onSubmit: () => void;
}

export const AssignReports: React.FC<AssignReportsProps> = ({
  open,
  onOpenChange,
  reportSearchText,
  onSearchChange,
  availableReports,
  selectedReports,
  loading,
  onAssign,
  onUnassign,
  onSelectAll,
  onRemoveAll,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] h-[607px] bg-white p-0 gap-0 flex flex-col">
        <DialogHeader className="border-b border-slate-200 p-4">
          <DialogTitle>
            <h3 className="text-slate-700 body1-medium">
              Select reports to assign
            </h3>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left column - Report selection */}
          <div className="border-r border-slate-200 flex flex-col h-full w-1/2">
            <div className="flex items-center gap-2 h-[54px] px-4 py-2 bg-slate-50 border-b border-slate-200">
              <SearchBar
                placeholder="Search reports"
                className="w-full"
                value={reportSearchText}
                onChange={onSearchChange}
              />
            </div>
            <ScrollArea className="flex h-[calc(100%-54px)] p-4">
              {availableReports.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {availableReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedReports.some(
                          (s) => s.id === report.id,
                        )}
                        onCheckedChange={() => onAssign(report)}
                        className="border-slate-300"
                      />
                      <span onClick={() => onAssign(report)}>
                        {report.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-4">
                  No reports found
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Right column - Selected reports */}
          <div className="flex flex-col h-full w-1/2">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 h-[54px]">
              <p className="body2-medium">
                Selected reports ({selectedReports.length})
              </p>
              {selectedReports.length > 0 && (
                <Button
                  variant="ghost"
                  className="text-red-500 h-auto p-1 text-xs"
                  onClick={onRemoveAll}
                >
                  Remove all
                </Button>
              )}
            </div>
            {selectedReports.length === 0 ? (
              <div className="flex flex-col items-center p-6 gap-6">
                <div className="w-[100.5px] h-[96px] mb-4">
                  <img
                    src="/assets/images/list-document.svg"
                    alt="No reports selected"
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <p className="body1-medium">Add reports</p>
                  <p className="body2-regular text-slate-500 text-center">
                    Use search on the left to add reports to this school.
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-2">
                  {selectedReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between py-3 px-4 border-b border-slate-100 last:border-b-0"
                    >
                      <span className="text-sm text-slate-800">
                        {report.name}
                      </span>
                      <Button
                        variant="ghost"
                        className="h-6 w-6 p-0 rounded-full hover:bg-slate-100"
                        onClick={() => onUnassign(report)}
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
              onClick={onSelectAll}
              disabled={availableReports.length === 0}
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
              onClick={onSubmit}
              disabled={loading || selectedReports.length === 0}
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
