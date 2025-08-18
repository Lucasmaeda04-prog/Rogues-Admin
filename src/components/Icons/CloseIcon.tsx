interface CloseIconProps {
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
}

export default function CloseIcon({ 
  width = 16, 
  height = 16, 
  className = "",
  strokeWidth = 2 
}: CloseIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth}
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}