export interface DuplicateReportDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRow: string;
  onSuccess?: () => void;
}
