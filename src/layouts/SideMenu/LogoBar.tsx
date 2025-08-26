import React from 'react';

const LogoBar: React.FC = () => {
  return (
    <div className="flex gap-2 items-center">
      <img
        src="/assets/images/logos/reportwell.svg"
        alt="Reportwell Logo"
        className="w-[30.876px] h-[26px]"
      />
      <img
        src="/assets/images/logos/reportwell-txt.svg"
        alt="Reportwell Logo"
        className="w-[89.847px] h-[16.316px]"
      />
    </div>
  );
};

export default LogoBar;
