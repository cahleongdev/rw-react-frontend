import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/base/Dialog';
import { CustomInput } from '@/components/base/CustomInput';
import { Button } from '@/components/base/Button';

interface EditCustomFieldsProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (fields: Record<string, string>) => void;
  initialFields: Record<string, string>;
}

const EditCustomFields = ({
  open,
  onClose,
  onSubmit,
  initialFields,
}: EditCustomFieldsProps) => {
  const [fields, setFields] =
    React.useState<Record<string, string>>(initialFields);

  React.useEffect(() => {
    if (open) {
      setFields(initialFields);
    }
  }, [open, initialFields]);

  if (!open) return null;

  const handleChange = (name: string, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(fields);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[520px] bg-white rounded-lg p-0 gap-0"
        showClose={false}
      >
        <DialogTitle className="hidden" />
        <div className="flex flex-row justify-between items-center p-4 border-b border-slate-200">
          <h3 className="text-slate-700">Edit Custom Fields</h3>
          <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 flex flex-col gap-4 justify-center items-center">
            {Object.entries(fields).map(([name, value]) => (
              <div className="flex flex-col gap-1 w-full" key={name}>
                <CustomInput
                  placeholder="Enter value"
                  label={name}
                  className="w-full"
                  value={value}
                  onChange={(e) => handleChange(name, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex-none border-t border-beige-300 bg-beige-50 rounded-b-lg">
            <DialogFooter className="flex justify-end gap-3 p-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-blue-500 body3-semibold text-white leading-[1.0] hover:bg-blue-600"
                type="submit"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomFields;
