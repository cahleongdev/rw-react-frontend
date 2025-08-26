import React from 'react';
import {
  XMarkIcon,
  EyeIcon,
  CloudArrowDownIcon,
} from '@heroicons/react/24/outline';
// import { Page, Document, PDFDownloadLink } from '@react-pdf/renderer';

import {
  TransparencyReport,
  TransparencySchool,
} from '@containers/Transparency/index.types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';

// Define props for the presentational component
export interface ShowReportFilesProps {
  open: boolean;
  onClose: () => void;
  report: TransparencyReport;
  school: TransparencySchool;
}

const ShowReportFiles: React.FC<ShowReportFilesProps> = ({
  open,
  onClose,
  report,
  school,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg gap-0 p-0"
        showClose={false}
      >
        <DialogHeader className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <div className="flex flex-col justify-left items-start">
            <DialogTitle className="text-slate-800 text-xl">
              View Files
            </DialogTitle>
            <DialogDescription className="text-slate-700">
              Files Submitted by {school.name}
            </DialogDescription>
          </div>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </DialogHeader>
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-row bg-slate-100 justify-between items-center py-2 px-4 border-t border-b border-slate-200">
            <p className="text-slate-700">File Name</p>
          </div>
          <div className="flex flex-col gap-1 pl-2">
            {report.file_urls && report.file_urls.length > 0 ? (
              report.file_urls.map((fileUrl) => (
                <div className="flex flex-row gap-2 justify-between items-center p-2">
                  <p className="body2-semibold text-slate-700">
                    {fileUrl.file_name}
                  </p>
                  <div className="flex flex-row gap-2">
                    <a
                      href={fileUrl.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* TODO: Try out with actual files */}
                      {/* <PDFDownloadLink
                        document={<Document>
                          <Page>

                          </Page>
                        </Document>}
                      >
                      </PDFDownloadLink> */}
                      <Button
                        variant="outline"
                        className="rounded-lg px-4 py-3 border-none shadow-none body3-semibold text-slate-700 leading-[1.0]"
                        onClick={onClose}
                        type="button"
                      >
                        <CloudArrowDownIcon className="size-8" />
                      </Button>
                    </a>
                    <a
                      href={fileUrl.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="rounded-lg p-4 shadow-none border-none body3-semibold text-slate-700 "
                        onClick={onClose}
                        type="button"
                      >
                        <EyeIcon className="size-8" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-row gap-2">
                <p>No files found</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="p-4 gap-2 justify-end border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <Button
            className="rounded-[3px] px-4 py-3 bg-blue-500 body3-semibold text-white leading-[1.0]"
            onClick={onClose}
            type="submit"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShowReportFiles;
