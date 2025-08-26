export interface MultiDeleteReportDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRows: string[];
  onSuccess?: () => void;
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
