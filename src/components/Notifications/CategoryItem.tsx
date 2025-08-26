import React from 'react';

interface CategoryItemProps {
  title: string;
};

const CategoryItem: React.FC<CategoryItemProps> = ({ title }) => {
  return (
    <div className="flex w-full h-[48px] items-end px-[24px] py-[12px] border-b-[2px] border-beige-300">
      <div className="text-[14px] font-[500] text-neutral-500">{title}</div>
    </div>
  );
};

export default CategoryItem;
