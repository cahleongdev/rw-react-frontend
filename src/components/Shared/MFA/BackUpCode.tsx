import React, { useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import {
  PrinterIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { toast } from 'sonner';

import { Button } from '@/components/base/Button';

interface BackUpCodeProps {
  open: boolean;
  codes: string[];
  onClose: () => void;
  onRegenerate: () => void;
}

const BackUpCode: React.FC<BackUpCodeProps> = ({
  open,
  codes,
  onClose,
  onRegenerate,
}: BackUpCodeProps) => {
  const codesRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error(
        'Unable to open print window. Please check your popup settings.',
      );
      return;
    }

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ReportWell MFA Backup Codes</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            .title { font-size: 24px; margin-bottom: 20px; }
            .subtitle { font-size: 16px; margin-bottom: 30px; color: #666; }
            .codes { 
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              margin-bottom: 30px;
              font-family: monospace;
              font-size: 18px;
            }
            .warning {
              padding: 15px;
              background-color: #fff3cd;
              border: 1px solid #ffeeba;
              border-radius: 4px;
              color: #856404;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="title">ReportWell MFA Backup Codes</h1>
            <p class="subtitle">Keep these backup codes in a safe place. Each code can only be used once.</p>
            <div class="codes">
              ${codes.map((code) => `<div>${code}</div>`).join('')}
            </div>
            <div class="warning">
              Important: These codes are like passwords. Never share them with anyone.
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'));
      toast.success('Backup codes copied to clipboard');
    } catch (err: unknown) {
      console.error('Copy failed:', err);
      toast.error('Failed to copy backup codes');
    }
  };

  const handleDownload = () => {
    const content = `ReportWell MFA Backup Codes\n\nKeep these backup codes in a safe place. Each code can only be used once.\n\n${codes.join('\n')}\n\nImportant: These codes are like passwords. Never share them with anyone.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reportwell-backup-codes.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    try {
      onRegenerate();
      toast.success('New backup codes generated successfully');
    } catch (err: unknown) {
      console.error('Regenerate failed:', err);
      toast.error('Failed to generate new backup codes');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="min-w-[680px] p-0 gap-0 bg-white"
        showClose={false}
      >
        <DialogTitle hidden />
        <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-slate-700">Save Back Up Codes</h3>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>
        <div className="p-6 flex flex-col gap-4 h-[400px] items-center">
          <h5 className="text-slate-700">
            If you lose access to your auth app or device, you can login to
            Reportwell using your backup codes. Each code can only be used once
          </h5>
          <div className="grow flex flex-col justify-center items-center gap-4 w-fit">
            <div
              ref={codesRef}
              className="flex flex-col justify-center items-center rounded-[6px] border border-slate-300 p-4 w-full"
            >
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                {codes.map((code, index) => (
                  <div
                    key={index}
                    className="body1-medium text-primary font-mono"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <PrinterIcon className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                <PencilIcon className="w-4 h-4" />
                Copy
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <DocumentArrowDownIcon className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline" onClick={handleRegenerate}>
                <ArrowPathIcon className="w-4 h-4" />
                Regenerate
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row p-4 gap-2 justify-end border-t border-beige-300 bg-beige-50 rounded-b-lg">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackUpCode;
