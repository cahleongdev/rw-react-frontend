import React from 'react';

import { ArrowUpRightIcon, PlusIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/base/Button';
import { Badge } from '@/components/base/Badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/base/Table';
import {
  AssignedReport,
  EntityType,
} from '@containers/EntitySideDrawer/index.types';

interface AssignedReportsSectionProps {
  entityType: EntityType;
  assignedReports: AssignedReport[];
  onOpenReport: (reportId: string) => void;
  onAssignReportsClick?: () => void;
}

export const AssignedReportsSection: React.FC<AssignedReportsSectionProps> = ({
  entityType,
  assignedReports,
  onOpenReport,
  onAssignReportsClick,
}) => {
  const showAssignButton =
    (entityType === EntityType.School || entityType === EntityType.Network) &&
    typeof onAssignReportsClick === 'function';

  return (
    <div className="flex flex-col gap-2 py-4">
      <Table>
        <TableHeader>
          <TableRow className="border-none py-4 hover:bg-transparent">
            <TableHead className="text-slate-500 body3-bold px-0">
              NAME
            </TableHead>
            {(entityType === EntityType.SchoolUser ||
              entityType === EntityType.Network) && (
              <TableHead className="text-slate-500">SCHOOL</TableHead>
            )}
            <TableHead className="text-slate-500 body3-bold">STATUS</TableHead>
            <TableHead className="text-slate-500 body3-bold text-right px-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignedReports.length > 0 ? (
            assignedReports.map((report) => (
              <TableRow
                key={report.id}
                className="!border-b border-slate-200 px-0 hover:bg-transparent"
              >
                <TableCell className="body2-regular text-slate-950 px-0 min-w-[130px] max-w-[130px] truncate">
                  {report.name}
                </TableCell>
                {(entityType === EntityType.SchoolUser ||
                  entityType === EntityType.Network) && (
                  <TableCell className="body2-regular text-slate-950 mx-3 min-w-[100px] max-w-[130px] truncate">
                    {report.schoolName}
                  </TableCell>
                )}
                <TableCell>
                  <Badge
                    className={
                      report.status === 'Complete'
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 select-none'
                        : 'bg-slate-400 text-white hover:bg-slate-500 select-none'
                    }
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right px-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => onOpenReport(report.reportId ?? report.id)}
                  >
                    <ArrowUpRightIcon className="w-4 h-4" /> Open report
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center italic text-slate-500"
              >
                No reports assigned
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showAssignButton && (
        <Button
          variant="ghost"
          className="hover:bg-transparent text-blue-500 hover:text-blue-600 !pl-0 w-auto self-start mb-2"
          onClick={onAssignReportsClick}
        >
          <PlusIcon className="w-4 h-4" /> Assign report
        </Button>
      )}
    </div>
  );
};
