import { Button } from '@/components/base/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/base/Dialog';

interface AddUserVerifyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  schoolName: string;
  onGoBack: () => void;
  onAddAnyway: () => void;
}

const AddUserVerify = ({
  open,
  onOpenChange,
  userName,
  schoolName,
  onGoBack,
  onAddAnyway,
}: AddUserVerifyProps) => {
  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent className="w-[520px] bg-white p-0 gap-0">
        <DialogHeader className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <DialogTitle className="text-base font-bold leading-[140%]">
            Verify recipients
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="p-4 border-b border-[#EFD7B2] min-h-[225px] text-base font-medium leading-[140%]">
          {userName} is from a different school{' '}
          {schoolName ? `(${schoolName})` : ''} than the current recipients of
          this message. Either go back and select a different user
          (recommended), or add them anyway (not recommended).
        </DialogDescription>

        <DialogFooter className="flex justify-end gap-2 p-2">
          <Button
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 h-9 px-3 py-2 rounded-[6px]"
            onClick={onGoBack}
          >
            <span className="text-white text-sm font-semibold">Go Back</span>
          </Button>
          <Button
            variant="ghost"
            className="text-xs text-slate-700 font-semibold"
            onClick={onAddAnyway}
          >
            Add Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserVerify;
