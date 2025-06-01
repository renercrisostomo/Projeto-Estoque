"use client";

import React from 'react';

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bgColor?: string;
  textColor?: string; // Added textColor prop
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, icon: Icon, bgColor = "bg-primary", textColor = "text-white" }) => (
  <div className={`p-6 rounded-lg shadow-lg ${textColor} ${bgColor} min-w-0 break-words`}>
    <div className="flex items-center">
      <div className="p-3 bg-white bg-opacity-25 rounded-full">
        <Icon className="h-8 w-8 text-dark" />
      </div>
      <div className="ml-4 min-w-0 flex-1">
        <p className="text-lg font-medium truncate">{title}</p>
        <p className="text-3xl font-bold truncate">{value}</p>
      </div>
    </div>
  </div>
);

export default OverviewCard;
