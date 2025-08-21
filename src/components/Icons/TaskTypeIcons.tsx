import React from 'react';

interface IconProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

// Ícone para Daily Task (circular arrows)
export const DailyTaskIcon: React.FC<IconProps> = ({ 
  className = "", 
  width = 16, 
  height = 16, 
  color = "currentColor" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M8 2C10.7614 2 13 4.23858 13 7C13 9.76142 10.7614 12 8 12C5.23858 12 3 9.76142 3 7C3 5.89543 3.38196 4.88748 4.03553 4.08199"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path 
      d="M8 4.5V7L9.5 8.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path 
      d="M4.5 2L4 4.5L6.5 4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Ícone para One-time Task (checkmark)
export const OneTimeTaskIcon: React.FC<IconProps> = ({ 
  className = "", 
  width = 16, 
  height = 16, 
  color = "currentColor" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle 
      cx="8" 
      cy="8" 
      r="6" 
      stroke={color} 
      strokeWidth="1.5"
      fill="none"
    />
    <path 
      d="M5.5 8L7 9.5L10.5 6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Ícone para Deadline (clock)
export const DeadlineIcon: React.FC<IconProps> = ({ 
  className = "", 
  width = 16, 
  height = 16, 
  color = "currentColor" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle 
      cx="8" 
      cy="8" 
      r="6" 
      stroke={color} 
      strokeWidth="1.5"
      fill="none"
    />
    <path 
      d="M8 4V8L10.5 10.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);