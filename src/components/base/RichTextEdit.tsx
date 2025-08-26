import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { cn } from '@/utils/tailwind';

interface RichTextEditProps {
  key?: string;
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  helperText?: string;
  className?: string;
  reactQuillRef?: React.RefObject<ReactQuill>;
  modules?: ReactQuill.QuillOptions['modules'];
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const RichTextEdit: React.FC<RichTextEditProps> = ({
  key,
  label,
  required = false,
  value,
  onChange,
  placeholder = 'Type announcement here',
  error,
  helperText,
  className,
  reactQuillRef,
  modules,
  onKeyDown,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="body2-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={cn(
          'border rounded-md overflow-hidden flex flex-col h-[200px]',
          error ? 'border-red-500' : 'border-slate-300',
          className,
        )}
      >
        <ReactQuill
          key={key}
          ref={reactQuillRef}
          theme="snow"
          className="h-full resize-none bg-white focus-visible:ring-blue-500"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
        />
        <style>
          {`
          .ql-toolbar {
            flex-wrap: wrap;
            background-color: #f8fafc; /* bg-slate-50, adjust as needed */
            border-top-left-radius: 0.375rem; /* rounded-md */
            border-top-right-radius: 0.375rem; /* rounded-md */
            border: none !important;
            border-bottom: 1px solid #cbd5e1 !important; /* border-slate-300 */
            padding: 8px; /* Add some padding to the toolbar */
          }
          .ql-container {
            height: calc(100% - 42px); /* Adjust 42px based on actual toolbar height if needed */
            overflow-y: auto;
            border-bottom-left-radius: 0.375rem; /* rounded-md */
            border-bottom-right-radius: 0.375rem; /* rounded-md */
            border-top: none !important;
            border: none !important;
          }
          .ql-editor {
            padding: 12px;
            line-height: 1.5;
          }
          .ProseMirror a {
            color: blue;
            text-decoration: underline;
            cursor: pointer;
          }
        `}
        </style>
      </div>

      <div className="flex justify-between items-center">
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    </div>
  );
};

export { RichTextEdit };
