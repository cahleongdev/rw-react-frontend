import React, { useState } from 'react';

import { cn } from '@/utils/tailwind';

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  children?: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  tabClassName,
  activeTabClassName,
  inactiveTabClassName,
}) => {
  return (
    <div className={cn('flex border-b', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            'px-4 py-2 cursor-pointer transition-colors',
            tabClassName,
            activeTab === tab.id
              ? cn('border-b-2 border-black text-black', activeTabClassName)
              : cn('text-gray-500', inactiveTabClassName),
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface TabsContentProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  tabId,
  activeTab,
  children,
  className,
}) => {
  if (activeTab !== tabId) return null;

  return <div className={className}>{children}</div>;
};

interface TabsContainerProps {
  defaultTab: string;
  children: React.ReactNode;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  defaultTab,
  children,
  onTabChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Clone children and pass activeTab and handleTabChange props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === Tabs) {
        return React.cloneElement(
          child as React.ReactElement<TabsProps>,
          {
            activeTab,
            onTabChange: handleTabChange,
          },
        );
      }
      if (child.type === TabsContent) {
        return React.cloneElement(
          child as React.ReactElement<TabsContentProps>,
          {
            activeTab,
          },
        );
      }
    }
    return child;
  });

  return <div className={className}>{childrenWithProps}</div>;
};
