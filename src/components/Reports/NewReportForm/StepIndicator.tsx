// src/pages/AgencyAdmin/ReportsPage/components/StepIndicator.tsx
import React from 'react';
import { CheckIcon } from 'lucide-react'; // Assuming you're using lucide-react for icons
import { ChevronRightIcon } from '@heroicons/react/16/solid';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
  isEditMode?: boolean;
  onStepClick?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels = [],
  className,
  onStepClick,
}) => {
  const handleStepClick = (stepNumber: number) => {
    if (!onStepClick) return;
    onStepClick(stepNumber);
  };

  return (
    <div className={className}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isLastStep = stepNumber === totalSteps;
        return (
          <div
            key={index}
            className={`flex items-center p-2 gap-2 cursor-pointer`}
            onClick={() => handleStepClick(stepNumber)}
          >
            <div
              className={`
                flex items-center justify-center
                w-5 h-5 rounded-full
                ${isActive
                  ? 'bg-white border-2 border-orange-500'
                  : isCompleted
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-500 border-1 border-gray-200'
                }
                z-10
              `}
            >
              {isCompleted ? (
                <CheckIcon className="w-4 h-4" />
              ) : isActive ? (
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              ) : (
                <span className="body3-regular">{stepNumber}</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {labels[index] && (
                <span
                  className={`body2-regular ${isActive
                    ? 'text-orange-500 font-medium'
                    : isCompleted
                      ? 'text-orange-500'
                      : 'text-gray-500'
                    }`}
                >
                  {labels[index]}
                </span>
              )}
              {!isLastStep && (
                <span className="text-orange-500">
                  <ChevronRightIcon
                    className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-gray-500'}`}
                  />
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
