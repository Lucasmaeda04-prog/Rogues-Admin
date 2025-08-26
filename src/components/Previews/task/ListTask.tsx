'use client';

import { cn } from '@/lib/cn';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { IconConfirmed, IconDiscord, DailyTaskIcon, OneTimeTaskIcon } from '@/components/Icons';
import { Campton } from '@/lib/fonts';
import { formatDeadline } from '@/lib/taskUtils';

export interface TaskProps {
  title: string;
  description: string;
  rewards: number;
  initialState: 'claim' | 'done';
  onClaim?: () => void;
  className?: string;
  icon?: React.ReactNode;
  deadline?: string | Date;
  socialMedia?: 'discord' | 'X';
  isDaily?: boolean;
}

const TaskList: React.FC<TaskProps> = ({
  title,
  description,
  rewards,
  initialState,
  onClaim,
  className,
  icon,
  deadline,
  socialMedia,
  isDaily,
}) => {
  const [state] = useState<'claim' | 'done'>(initialState);

  const handleClaimClick = () => {
    onClaim?.();
  };

  const isCompleted = state === 'done';

  const getSocialMediaCircleColor = () => {
    switch (socialMedia) {
      case 'discord':
        return '#004D8A';
      case 'X':
        return '#555555';
      default:
        return '#004D8A'; // Default to Discord blue
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-4 max-sm:px-3 max-sm:py-3 rounded-xl backdrop-blur-[50px]',
        'bg-[#1E2331] border-2 border-[#353946]',
        className,
      )}
    >
      <div className="flex items-start gap-4 max-sm:gap-3 flex-1">
        {/* Content */}
        <div className="flex flex-col gap-2 flex-1">
          {/* Title */}
          <div className="flex items-center gap-2">
             {/* Social media icon in circle */}
            <div className="flex items-center justify-center -mt-0.5">
              <div 
                className="flex items-center justify-center w-6 h-6 rounded-full"
                style={{ backgroundColor: getSocialMediaCircleColor() }}
              >
                <div className={cn(
                  "text-white [&>svg]:w-full [&>svg]:h-full [&>svg]:text-current",
                  socialMedia === 'X' ? "w-3 h-3" : "w-4 h-4"
                )}>
                  {icon || <IconDiscord />}
                </div>
              </div>
            </div>
            <h3 className={cn("text-white font-medium text-base max-sm:text-sm", Campton.className)}>
              {title}
            </h3>
          </div>
          
          <p className={cn("text-white/70 text-sm max-sm:text-xs font-light", Campton.className)}>
            {description}
          </p>
          
          {/* Badges row */}
          <div className="flex items-center gap-3 max-sm:gap-2 mt-3 max-sm:mt-2">
            {/* Deadline badge */}
            {deadline && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ backgroundColor: '#C8C8C8' }}>
  
                <Image 
                  src="/assets/clock.svg" 
                  alt="Clock" 
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
                <span className={cn("text-black text-xs max-sm:text-[10px] font-light", Campton.className)}>
                  Deadline: {formatDeadline(deadline)}
                </span>
              </div>
            )}
            
            {/* Task type badge - só mostra se NÃO tiver deadline */}
            {!deadline && (
              <div className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs max-sm:text-[10px] font-light",
                isDaily 
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                  : "bg-green-500/20 text-green-300 border border-green-500/30"
              )}>
                {isDaily ? (
                  <DailyTaskIcon 
                    width={10} 
                    height={10} 
                    color="currentColor"
                    className="flex-shrink-0"
                  />
                ) : (
                  <OneTimeTaskIcon 
                    width={10} 
                    height={10} 
                    color="currentColor"
                    className="flex-shrink-0"
                  />
                )}
                <span className={cn("font-light", Campton.className)}>
                  {isDaily ? "Daily" : "One-time"}
                </span>
              </div>
            )}
            
            {/* Rewards badge */}
            <div className="flex items-center gap-1.5">
              <div 
                className="flex items-center justify-center w-5 h-5 rounded-full border"
                style={{ 
                  backgroundColor: '#353535',
                  borderColor: '#515151'
                }}
              >
                <Image 
                  src="/assets/mythic.png" 
                  alt="Carrot" 
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              </div>
              <span className={cn("text-white text-xs max-sm:text-[10px] font-light", Campton.className)}>
                +{rewards} carrots
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Action button */}
      <div className="ml-6 max-sm:ml-3">
        {isCompleted ? (
          <Button
            size="small"
            disabled
            className={cn(
              "bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 max-sm:px-2 max-sm:py-0.5 cursor-default hover:bg-green-500/20 font-extrabold text-sm max-sm:text-xs",
              Campton.className, 
            )}
          >
            <IconConfirmed color="#10B981" />
            DONE
          </Button>
        ) : (
          <Button
            size="small"
            color="primary"
            onClick={handleClaimClick}
            className={cn("px-6 py-1.5 max-sm:px-3 max-sm:py-0.5 font-extrabold text-sm max-sm:text-[10px]", Campton.className)}
          >
            CLAIM
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskList;