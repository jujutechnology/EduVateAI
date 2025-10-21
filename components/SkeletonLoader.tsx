import React from 'react';

const combineClassNames = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div className={combineClassNames("bg-gray-200 dark:bg-gray-700 rounded animate-pulse", className)} />
);

export const SkeletonText: React.FC<{ className?: string }> = ({ className }) => (
  <div className={combineClassNames("bg-gray-200 dark:bg-gray-700 rounded animate-pulse", className)} />
);
