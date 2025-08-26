import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/base/Button';
import { CustomInput } from '@/components/base/CustomInput';
import { Dropdown } from '@/components/base/Dropdown';
import { RichTextEdit } from '@/components/base/RichTextEdit';
import { FileUploadInput } from '@/components/base/FileUploadInput';
import VideoThumbnailUpload from '@/components/Reports/NewReportForm/SetupStep/VideoThumbnailUpload';

import { ReportResponse, FileUrl } from '@/containers/Reports/index.types';

import CategoryDropdown from './CategoryDropdown';

import { RootState } from '@/store';

import useFileUpload from '@/hooks/useFileUpload';

import { STORAGE_PATH } from '@containers/Settings/index.constants';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }], // H1, H2, H3, H4 options
    [{ font: [] }], // Font selection
    [{ color: [] }, { background: [] }], // Font color and background color
    ['bold', 'italic', 'underline', 'strike'], // Text styles
    [{ list: 'ordered' }, { list: 'bullet' }], // Ordered and unordered lists
    [{ align: [] }], // Alignments: left, center, right
    [{ indent: '-1' }, { indent: '+1' }], // Indent and outdent
    ['clean'], // Remove formatting
    ['link', 'image'], // Link, image
  ],
};

interface SetupStepProps {
  formData: ReportResponse;
  handleChange: <K extends keyof ReportResponse>(
    field: K,
    value: ReportResponse[K],
  ) => void;
  handleNext: () => void;
  isSubmitting: boolean;
  stepLabels: string[];
  currentStep: number;
  reportNameError?: boolean;
}

const SetupStep: React.FC<SetupStepProps> = ({
  formData,
  handleChange,
  handleNext,
  isSubmitting,
  stepLabels,
  currentStep,
  reportNameError,
}) => {
  const [name, setName] = useState(formData.name);
  const [description, setDescription] = useState(formData.description);
  const [completionTime, setCompletionTime] = useState(
    formData.completion_time,
  );
  const categoryOptions = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const [categories, setCategories] = useState<string[]>(formData.categories);
  const [schoolYear, setSchoolYear] = useState(formData.school_year || '25-26');
  const [videoUrl, setVideoUrl] = useState(formData.video_url);
  const [step1Title, setStep1Title] = useState(
    formData.content?.step1.title || '',
  );
  const [step1Description, setStep1Description] = useState(
    formData.content?.step1.description || '',
  );
  const [step2Title, setStep2Title] = useState(
    formData.content?.step2.title || '',
  );
  const [step2Description, setStep2Description] = useState(
    formData.content?.step2.description || '',
  );
  const [step3Title, setStep3Title] = useState(
    formData.content?.step3.title || '',
  );
  const [step3Description, setStep3Description] = useState(
    formData.content?.step3.description || '',
  );
  const [videoCover, setVideoCover] = useState(formData.video_cover); // Stores URL/name
  const [fileUrls, setFileUrls] = useState<FileUrl[]>(formData.file_urls || []);

  const [videoCoverFile, setVideoCoverFile] = useState<File | null>(null);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);

  const [isVideoThumbnailDialogOpen, setIsVideoThumbnailDialogOpen] =
    useState(false);

  const { uploadFile } = useFileUpload();
  const [isUploading, setIsUploading] = useState(false);

  const [isVideoUrlEditable, setIsVideoUrlEditable] = useState(
    !formData.video_url,
  );
  const [tempVideoUrl, setTempVideoUrl] = useState(formData.video_url || '');
  const [videoUrlError, setVideoUrlError] = useState<string>('');

  // useEffects to sync with formData
  useEffect(() => {
    handleChange('name', name);
  }, [name]);
  useEffect(() => {
    handleChange('description', description);
  }, [description]);
  useEffect(() => {
    handleChange('completion_time', completionTime);
  }, [completionTime]);
  useEffect(() => {
    handleChange('categories', categories);
  }, [categories]);
  useEffect(() => {
    handleChange('school_year', schoolYear);
  }, [schoolYear]);
  useEffect(() => {
    handleChange('video_url', videoUrl);
  }, [videoUrl]);
  useEffect(() => {
    handleChange('video_cover', videoCover);
  }, [videoCover]); // For non-file-upload changes to videoCover if any
  useEffect(() => {
    handleChange('file_urls', fileUrls);
  }, [fileUrls]); // For non-file-upload changes to fileUrls

  useEffect(() => {
    handleChange('content', {
      step1: { title: step1Title, description: step1Description },
      step2: { title: step2Title, description: step2Description },
      step3: { title: step3Title, description: step3Description },
    });
  }, [
    step1Title,
    step1Description,
    step2Title,
    step2Description,
    step3Title,
    step3Description,
    handleChange,
  ]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleNextClick = async () => {
    setIsUploading(true);
    let currentVideoCover: string | null = videoCover;
    let currentFileUrls = [...fileUrls];

    try {
      if (videoCoverFile) {
        const uploadedFileName = await uploadFile(videoCoverFile);
        if (uploadedFileName) {
          currentVideoCover = STORAGE_PATH + uploadedFileName;
          handleChange('video_cover', currentVideoCover); // Update immediately after upload
          setVideoCover(currentVideoCover); // also update local state if needed for UI
        }
      }

      const newUploadedResourceFiles: FileUrl[] = [];
      const filesToUpload = resourceFiles.filter(
        (rf) =>
          !fileUrls.some(
            (fu) =>
              fu.file_name === rf.name && fu.file_url !== 'pending-upload',
          ),
      );

      for (const file of filesToUpload) {
        const uploadedFileName = await uploadFile(file);
        if (uploadedFileName) {
          newUploadedResourceFiles.push({
            file_url: uploadedFileName,
            file_name: file.name,
          });
        }
      }

      // Update fileUrls by replacing pending ones and adding new ones
      // while keeping already uploaded ones from initial formData or previous saves.
      const existingUploadedUrls = fileUrls.filter(
        (fu) => fu.file_url !== 'pending-upload',
      );
      currentFileUrls = [...existingUploadedUrls, ...newUploadedResourceFiles];
      handleChange('file_urls', currentFileUrls);
      setFileUrls(currentFileUrls); // also update local state for UI consistency

      handleNext();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveVideoUrl = () => {
    if (!videoUrlError && tempVideoUrl) {
      setVideoUrl(tempVideoUrl);
      setIsVideoUrlEditable(false);
    } else if (!tempVideoUrl) {
      // Allow clearing the URL
      setVideoUrl(null);
      setIsVideoUrlEditable(false);
    }
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempVideoUrl(value);
    if (!value) {
      setVideoUrlError('');
      return;
    }
    if (!isValidUrl(value)) {
      setVideoUrlError('Please enter a valid URL');
    } else {
      setVideoUrlError('');
    }
  };

  const handleEditVideoUrl = () => {
    setTempVideoUrl(videoUrl || ''); // Reset temp to current saved URL or empty
    setIsVideoUrlEditable(true);
  };

  const handleVideoCoverSelected = async (file: File | null) => {
    if (file !== null && file !== undefined) {
      setVideoCoverFile(file);
      const filename = await uploadFile(file, undefined, 'avatar');
      const videoCoverUrl = STORAGE_PATH + filename;
      setVideoCover(videoCoverUrl);
    } else {
      setVideoCover(null);
    }
  };

  const handleResourceFilesSelected = (files: File[]) => {
    const newResourceFiles = [...resourceFiles, ...files];
    setResourceFiles(newResourceFiles);

    const newFileEntries = files.map((file) => ({
      file_url: 'pending-upload', // Mark as pending
      file_name: file.name,
    }));
    setFileUrls((prevFileUrls) => [...prevFileUrls, ...newFileEntries]);
  };

  const handleRemoveFileUrl = (fileToRemove: FileUrl) => {
    setFileUrls((prevFileUrls) =>
      prevFileUrls.filter(
        (f) =>
          f.file_name !== fileToRemove.file_name ||
          f.file_url !== fileToRemove.file_url,
      ),
    );
    if (fileToRemove.file_url === 'pending-upload') {
      setResourceFiles((prevResourceFiles) =>
        prevResourceFiles.filter((rf) => rf.name !== fileToRemove.file_name),
      );
    }
  };

  return (
    <div className="mx-auto flex gap-10 flex-col p-6">
      <div className="flex flex-col gap-6">
        <h2>Report Setup</h2>
        <div className="flex flex-col">
          <h3 className="text-slate-700">Report Details</h3>
          <p className="body2-regular text-slate-700">
            Set up the basic information about this report and how it should be
            used.
          </p>
        </div>
        <CustomInput
          label="Report Name"
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Report"
          className="w-[365px]"
          required
          error={reportNameError ? 'Report name is required.' : undefined}
        />

        <Dropdown
          label="School Year"
          options={[
            { value: '23-24', label: '23 - 24' },
            { value: '24-25', label: '24 - 25' },
            { value: '25-26', label: '25 - 26' },
          ]}
          value={schoolYear || ''}
          onValueChange={(value) => setSchoolYear(value)}
          className="w-[223px]"
          placeholder="Select School Year"
        />

        <CategoryDropdown
          label="Categories"
          options={categoryOptions}
          selectedCategories={categories || []}
          onChange={(selected) => setCategories(selected)}
          className="w-[365px]"
        />

        <Dropdown
          options={[
            { value: '15', label: '15 minutes' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
            { value: '120', label: '2 hours' },
          ]}
          value={completionTime || ''}
          onValueChange={(value) => setCompletionTime(value)}
          className="w-[223px]"
          label="Estimated Completion Time"
          placeholder="30 minutes"
        />

        <RichTextEdit
          modules={modules}
          value={description || ''}
          onChange={(value) => setDescription(value)}
          className="w-[836px] h-[300px]"
          label="Report Description"
          required
          maxLength={2000}
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-slate-700">Step Descriptions</h3>
          <p className="body2-regular text-slate-700">
            Define the names and description for each three steps for this
            report.
          </p>
        </div>
        <div className="flex flex-col gap-3 p-6 bg-slate-50 rounded-[16px]">
          <CustomInput
            label="Step 1 Title"
            value={step1Title || ''}
            onChange={(e) => setStep1Title(e.target.value)}
            placeholder="Enter Step 1 Title"
          />
          <RichTextEdit
            modules={modules}
            value={step1Description || ''}
            onChange={(value) => setStep1Description(value)}
            className="w-[836px]"
            label="Step 1 Description"
            required
            placeholder="Step 1 Description"
          />
        </div>
        <div className="flex flex-col gap-3 p-6 bg-slate-50 rounded-[16px]">
          <CustomInput
            label="Step 2 Title"
            value={step2Title || ''}
            onChange={(e) => setStep2Title(e.target.value)}
            placeholder="Enter Step 2 Title"
          />
          <RichTextEdit
            modules={modules}
            value={step2Description || ''}
            onChange={(value) => setStep2Description(value)}
            className="w-[836px]"
            label="Step 2 Description"
            required
            placeholder="Step 2 Description"
          />
        </div>
        <div className="flex flex-col gap-3 p-6 bg-slate-50 rounded-[16px]">
          <CustomInput
            label="Step 3 Title"
            value={step3Title || ''}
            onChange={(e) => setStep3Title(e.target.value)}
            placeholder="Enter Step 3 Title"
          />
          <RichTextEdit
            modules={modules}
            value={step3Description || ''}
            onChange={(value) => setStep3Description(value)}
            className="w-[836px]"
            label="Step 3 Description"
            required
            placeholder="Step 3 Description"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-slate-700">Video Upload (optional)</h3>
          <p className="body2-regular text-slate-700">
            Upload a video with instructions
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-slate-700">Link</span>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <CustomInput
                    value={tempVideoUrl || ''}
                    onChange={handleVideoUrlChange}
                    placeholder="Enter Link"
                    className="flex-1"
                    disabled={!isVideoUrlEditable}
                    error={videoUrlError}
                  />
                  {isVideoUrlEditable ? (
                    <Button
                      className="bg-slate-500 text-white rounded-[6px] px-6 py-2 h-[38px]"
                      onClick={handleSaveVideoUrl}
                      disabled={!!videoUrlError || !tempVideoUrl} // Disable save if error or empty and it was not initially empty
                    >
                      Save Link
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="h-[38px] p-2 hover:bg-slate-100"
                      onClick={handleEditVideoUrl}
                    >
                      <PencilIcon className="h-5 w-5 text-slate-500" />
                    </Button>
                  )}
                </div>
                {videoUrlError && (
                  <span className="text-sm text-red-500">{videoUrlError}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-slate-700">Video Thumbnail</h3>

          {videoCover ? (
            <img
              src={videoCover || ''}
              alt="Video Cover"
              width={144}
              height={144}
              className="rounded-md object-cover mb-5"
            />
          ) : (
            <p className="body2-regular text-slate-700">
              Upload an image to serve as the preview image for the video.
            </p>
          )}
          <Button
            onClick={() => setIsVideoThumbnailDialogOpen(true)}
            className="w-[144px]"
            variant="outline"
          >
            Upload Thumbnail
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-slate-700">Resource files (optional)</h3>
            <p className="body1-regular text-slate-700">
              Upload additional resource files.
            </p>
          </div>
          <FileUploadInput
            className="w-[365px]"
            onFilesSelected={handleResourceFilesSelected}
            multiple
          />
          <div className="flex flex-col gap-2 mt-2">
            {fileUrls && fileUrls.length > 0 ? (
              fileUrls.map((file, index) => (
                <React.Fragment key={`${file.file_name}-${index}`}>
                  <div className="flex items-center justify-between p-2 hover:bg-slate-100 rounded">
                    <div className="flex-1 truncate">
                      <span className="text-sm font-medium text-slate-800">
                        {file.file_name}
                      </span>
                      {file.file_url === 'pending-upload' && (
                        <span className="ml-2 text-xs text-amber-600">
                          (Pending upload)
                        </span>
                      )}
                      {file.file_url !== 'pending-upload' && file.file_url && (
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-xs text-blue-500 hover:underline"
                        >
                          (View)
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-4 h-4 cursor-pointer hover:bg-slate-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFileUrl(file);
                      }}
                      title="Remove file"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  {index < fileUrls.length - 1 && (
                    <div className="border-b border-slate-200"></div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="flex items-center justify-center h-full mt-2">
                <span className="text-slate-500">No resources uploaded</span>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={handleNextClick}
          disabled={isSubmitting || isUploading || !name}
          className="w-full h-[52px] rounded-[6px] bg-orange-500 text-white max-w-[884px] py-[14px]"
        >
          {isUploading
            ? 'Uploading files...'
            : `Next: ${stepLabels[currentStep]}`}
        </Button>
      </div>
      <VideoThumbnailUpload
        isOpen={isVideoThumbnailDialogOpen}
        onOpenChange={setIsVideoThumbnailDialogOpen}
        onFilesSelected={handleVideoCoverSelected}
        isLoading={isUploading}
        initialVideoCover={videoCover}
      />
    </div>
  );
};

export default SetupStep;
