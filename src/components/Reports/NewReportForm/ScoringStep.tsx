import React, { useEffect, useState } from 'react';

import { Button } from '@/components/base/Button';
import { ReportResponse, Scoring } from '@/containers/Reports/index.types';

interface ScoringStepProps {
  formData: ReportResponse;
  handleChange: <K extends keyof ReportResponse>(
    field: K,
    value: ReportResponse[K],
  ) => void;
  handleNext: () => void;
  isSubmitting: boolean;
  stepLabels: string[];
  currentStep: number;
}

const ScoringStep: React.FC<ScoringStepProps> = ({
  formData,
  handleChange,
  handleNext,
  isSubmitting,
  stepLabels,
  currentStep,
}) => {
  const [useScoring, setUseScoring] = useState<boolean>(
    formData.use_scoring === undefined ? true : formData.use_scoring,
  );
  // Default static scoring descriptions
  const defaultScoring = {
    exceed: 'Exceeds Standard',
    meet: 'Meets Standard',
    approach: 'Approaching Standard',
    notmeet: 'Does Not Meet Standard',
  };

  useEffect(() => {
    handleChange('use_scoring', useScoring);
    handleChange('has_scoring', useScoring);
    if (useScoring) {
      const newScoringData: Scoring = {
        id: formData.scoring?.id || '', // Preserve ID if it exists
        ...defaultScoring,
      };
      handleChange('scoring', newScoringData);
    } else {
      handleChange('scoring', null);
    }
  }, [
    useScoring,
    handleChange,
    formData.scoring?.id, // Keep dependency on id if needed for updates
  ]);

  const handleNextClick = () => {
    handleNext();
  };
  return (
    <div className="mx-auto flex gap-6 flex-col p-6 w-[884px]">
      <h2>Scoring</h2>

      <div className="flex flex-col gap-4">
        <p className="text-slate-700 body2-regular">
          Define how you want this report to be scored.
        </p>
        <div className="border border-slate-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div
              className={`
                flex items-center justify-center cursor-pointer
                w-5 h-5 rounded-full mt-0.5
                ${
                  useScoring
                    ? 'bg-white border-2 border-orange-500'
                    : 'bg-gray-100 border-1 border-gray-200'
                }
              `}
              onClick={() => setUseScoring(true)}
            >
              {useScoring && (
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <span className="body2-regular text-slate-700">Use scoring</span>
              <p className="body3-regular text-slate-500">
                The standard scoring descriptions will be used.
              </p>

              {useScoring && (
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-teal-500 rounded shrink-0"></div>
                    <span className="p-2 w-full body2-regular text-slate-400 border border-slate-300 rounded-md">
                      {defaultScoring.exceed}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded shrink-0"></div>
                    <span className="p-2 w-full body2-regular text-slate-400 border border-slate-300 rounded-md">
                      {defaultScoring.meet}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-400 rounded shrink-0"></div>
                    <span className="p-2 w-full body2-regular text-slate-400 border border-slate-300 rounded-md">
                      {defaultScoring.approach}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded shrink-0"></div>
                    <span className="p-2 w-full body2-regular text-slate-400 border border-slate-300 rounded-md">
                      {defaultScoring.notmeet}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border border-slate-300 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div
              className={`
                flex items-center justify-center cursor-pointer
                w-5 h-5 rounded-full mt-0.5
                ${
                  !useScoring
                    ? 'bg-white border-2 border-orange-500'
                    : 'bg-gray-100 border-1 border-gray-200'
                }
              `}
              onClick={() => setUseScoring(false)}
            >
              {!useScoring && (
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <span className="body2-regular text-slate-700">
                Exempt from scoring
              </span>
              <p className="body3-regular text-slate-500">
                Select this if you don't need this report to be scored.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleNextClick}
        disabled={isSubmitting}
        className="w-full h-[52px] rounded-[6px] bg-orange-500 text-white max-w-[884px] py-[14px] mt-4"
      >
        {`Next: ${stepLabels[currentStep]}`}
      </Button>
    </div>
  );
};

export default ScoringStep;
