import React from "react";

interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange: (newChecked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, disabled, onChange }: SwitchProps) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center cursor-pointer"
    >
      <span
        className={`w-7.5 h-4.5 py-[1px] px-[1px] box-border rounded-full transition-colors duration-300 ${checked ? (disabled ? "bg-[#FFEDD5]" : "bg-[#F97316]") : (disabled ? "bg-gray-100" : "bg-gray-300")
          }`}
      >
        <div
          className={`w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${checked ? "translate-x-3" : "translate-x-0"
            } ${disabled ? 'bg-[#F1F5F9]' : 'bg-white'}`}
        ></div>
      </span>
    </div>
  );
};

export default Switch;
