export interface DeleteReportDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRow: string;
}

export interface FormData {
  name: string;
  gradeserved: string[];
  type: string;
  county: string;
  address: string;
  city: string;
  state: string;
  district: string;
  zipcode: string;
}
