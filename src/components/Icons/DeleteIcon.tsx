interface DeleteIconProps {
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
}

export default function DeleteIcon({ 
  width = 16, 
  height = 16, 
  className = "",
  strokeWidth = 2 
}: DeleteIconProps) {
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
      <polyline points="3,6 5,6 21,6"/>
      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
    </svg>
  );
}