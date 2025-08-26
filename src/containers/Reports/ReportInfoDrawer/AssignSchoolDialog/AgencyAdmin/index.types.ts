import { SchoolResponse } from '@/store/slices/schoolsSlice';

export interface AssignSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  onSubmit: () => void;
}

export interface SubmissionResponse {
  id: string;
  school: SchoolResponse;
  // Add other properties as needed
}
