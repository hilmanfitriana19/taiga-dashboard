import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height = 'h-4',
  width = 'w-full',
  rounded = true,
  animate = true
}) => {
  return (
    <div
      className={`
        bg-surface-800 ${height} ${width} 
        ${rounded ? 'rounded-md' : ''} 
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card p-5 space-y-4">
      <Skeleton height="h-6\" width="w-2/3" />
      <Skeleton height="h-4\" width="w-full" />
      <Skeleton height="h-4\" width="w-5/6" />
      <div className="flex justify-between pt-2">
        <Skeleton height="h-4\" width="w-1/4" />
        <Skeleton height="h-4\" width="w-1/4" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 border-b border-surface-800">
      {Array(columns).fill(0).map((_, i) => (
        <Skeleton key={i} height="h-5" />
      ))}
    </div>
  );
};

export default Skeleton;