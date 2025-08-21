'use client';

import { cn } from '@/lib/cn';
import Image from 'next/image';
import { Campton } from '@/lib/fonts';
import { IconDiscord, IconX } from '@/components/Icons';
import { formatDeadline } from '@/lib/taskUtils';

import { Button } from '@/components/Button';

export interface TaskModalProps {
  task: {
    title: string;
    description: string;
    rewards: number;
    verificationSteps: string[];
    socialMedia?: 'discord' | 'X';
    deadline?: string | Date;
  };
  onVerify: () => void;
  onGoToMission?: () => void;
  isVerifying?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  onVerify,
  onGoToMission,
  isVerifying = false,
}) => {
  const handleVerifyClick = () => {
    onVerify();
  };

  const handleGoToMission = () => {
    if (onGoToMission) {
      onGoToMission();
    }
  };

  const getSocialMediaInfo = () => {
    const socialMedia = task.socialMedia || 'discord';
    
    switch (socialMedia) {
      case 'X':
        return {
          icon: <IconX className="w-4 h-4" />,
          name: 'X',
          bgColor: 'bg-rogues-default-145'
        };
      case 'discord':
      default:
        return {
          icon: <IconDiscord className="w-4 h-4" />,
          name: 'Discord',
          bgColor: 'bg-blue-600'
        };
    }
  };

  const socialInfo = getSocialMediaInfo();

  return (
      <div className="bg-gradient-to-r from-[rgba(236,23,81,1)] to-[rgba(7,78,138,1)] rounded-3xl p-[2px]">
        <div className="bg-black/95 rounded-3xl overflow-hidden h-fit w-full">
          {/* Header with background image */}
          <div 
            className="relative bg-cover bg-center bg-no-repeat p-6 h-[160px]" 
            style={{backgroundImage: 'url(/assets/BACKGROUND.png)'}}
        >
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/40 rounded-t-3xl"></div>
          
          {/* Content */}
          <div className="relative z-[1] flex flex-col justify-end h-full">
            <h2 className={cn("text-white text-2xl font-semibold mb-4", Campton.className)}>
              {task.title}
            </h2>
            
            {/* Reward info and Social media badge - aligned to bottom */}
            <div className="flex items-center gap-3">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-light">
                Earn +{task.rewards} Carrots
              </span>
              <div className={cn("px-3 py-1 rounded-full flex items-center gap-2", socialInfo.bgColor)}>
                {socialInfo.icon}
                {socialInfo.name !== 'X' && (
                  <span className="text-white text-xs font-light">{socialInfo.name}</span>
                )} 
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          {/* Deadline */}
          {task.deadline && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#C8C8C8' }}>
              <Image 
                src="/assets/clock.svg" 
                alt="Clock" 
                width={12}
                height={12}
                className="w-3 h-3"
              />
              <span className={cn("text-black text-xs font-light", Campton.className)}>
                Deadline: {formatDeadline(task.deadline)}
              </span>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6">
            <h3 className={cn("text-white text-lg font-light mb-4", Campton.className)}>
              Complete the following steps to redeem {task.rewards}+ Credits:
            </h3>
            
            {/* Verification Steps */}
            {task.verificationSteps.length > 0 && (
              <ul className="space-y-3 mb-6">
                {task.verificationSteps.map((step, index) => (
                  <li key={index} className="text-white/80 text-sm flex  font-light items-start">
                    <span className="text-white mr-3 flex-shrink-0">
                      •
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outlined"
              onClick={handleGoToMission}
              color="default"
              className={cn(
                "flex-1 text-rogues-default-150 hover:bg-pink-500/10 font-extrabold py-3",
                Campton.className
              )}
            >
              GO TO MISSION !
            </Button>
            <Button
              onClick={handleVerifyClick}
              loading={isVerifying}
              color="primary"
              className={cn(
                "flex-1   hover:to-pink-700 font-bold py-3",
                Campton.className
              )}
            >
              {isVerifying ? 'CHECKING...' : 'CHECK TASK'}
            </Button>
          </div>
        </div>
        </div>
      </div>
  );
};

export default TaskModal;