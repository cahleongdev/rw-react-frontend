import { useEffect, useState, useMemo } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { toast } from 'sonner';

import axiosInstance from '@/api/axiosInstance';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { ScrollArea } from '@/components/base/ScrollArea';
import { Textarea } from '@/components/base/Textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/base/Table';

interface School {
  name: string;
  overdueReports: number;
}

interface SendReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schools: School[];
}

const SendReminderDialog = ({
  open,
  onOpenChange,
  schools,
}: SendReminderDialogProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Filter schools to only include those with overdue reports
  const schoolsWithOverdueReports = useMemo(
    () => schools.filter((school) => school.overdueReports > 0),
    [schools],
  );

  // State to track selected schools - initially empty
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

  // Update selected schools when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedSchools(
        schoolsWithOverdueReports.map((school) => school.name),
      );
    }
  }, [open, schoolsWithOverdueReports]);

  // Toggle school selection
  const toggleSchoolSelection = (schoolName: string) => {
    setSelectedSchools((prev) => {
      if (prev.includes(schoolName)) {
        return prev.filter((name) => name !== schoolName);
      } else {
        return [...prev, schoolName];
      }
    });
  };

  const handleSendReminders = async () => {
    if (!message.trim()) {
      toast.error('Message Required', {
        description: 'Please enter a message to send to the schools.',
      });
      return;
    }

    if (selectedSchools.length === 0) {
      toast.error('No Schools Selected', {
        description:
          'Please select at least one school to send the reminder to.',
      });
      return;
    }

    try {
      setSending(true);

      // Prepare the data to send to the API
      const reminderData = {
        message: message,
        schools: selectedSchools,
      };

      // Send the reminder request to the API
      const response = await axiosInstance.post(
        '/notifications/send-reminders',
        reminderData,
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Reminders Sent', {
          description: `Successfully sent reminders to ${selectedSchools.length} schools.`,
        });

        // Close the dialog and reset the message
        setMessage('');
        onOpenChange(false);
      } else {
        throw new Error(`API request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      toast.error('Failed to Send Reminders', {
        description:
          'There was an error sending the reminders. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[522px] bg-white p-0 gap-0">
        <DialogHeader className="border-b-[1px] border-slate-200 p-4">
          <DialogTitle>
            <h3 className="text-slate-700 body1-medium">Send message</h3>
          </DialogTitle>
        </DialogHeader>

        <div className="p-[24px_16px] flex flex-col gap-6">
          <span className="text-black body1-medium">
            Send a message to {selectedSchools.length} of{' '}
            {schoolsWithOverdueReports.length} schools that have overdue
            reports.
          </span>
          <ScrollArea className="h-[150px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">Schools</TableHead>
                  <TableHead className="w-[30%]">Reports Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolsWithOverdueReports.length > 0 ? (
                  schoolsWithOverdueReports.map((school) => (
                    <TableRow key={school.name}>
                      <TableCell>
                        <div
                          className="flex items-start gap-2 max-w-[350px] cursor-pointer"
                          onClick={() => toggleSchoolSelection(school.name)}
                        >
                          <div className="mt-1 shrink-0">
                            {selectedSchools.includes(school.name) ? (
                              <CheckIcon className="size-4 text-orange-500" />
                            ) : (
                              <CheckIcon className="size-4 text-slate-300" />
                            )}
                          </div>
                          <span className="break-words line-clamp-2">
                            {school.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {school.overdueReports} overdue reports
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No schools with overdue reports
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <DialogFooter className="border-t border-beige-300 bg-beige-50">
          <div className="flex flex-col gap-2 p-4 w-full">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[89px] w-full resize-none bg-white p-3"
              placeholder="Hi, I'm reminding you that your report is overdue. Please submit it as soon as possible, or send me a message if you have issues."
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="border-slate-500 bg-white rounded-[3px] w-[72px] h-[34px]"
                onClick={() => onOpenChange(false)}
                disabled={sending}
              >
                <span className="text-slate-700 button3">Cancel</span>
              </Button>
              <Button
                className="bg-blue-500 rounded-[3px] w-[72px] h-[34px]"
                onClick={handleSendReminders}
                disabled={sending || selectedSchools.length === 0}
              >
                <span className="text-white button3">
                  {sending ? 'Sending...' : 'Send'}
                </span>
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendReminderDialog;
