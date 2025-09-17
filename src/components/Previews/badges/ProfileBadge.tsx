'use client';

import { cn } from '@/lib/cn';
import { BadgeData } from '@/types';
import Image from 'next/image';

interface ProfileBadgeProps {
  badge: BadgeData;
}


const ProfileBadge: React.FC<ProfileBadgeProps> = ({ badge }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group",
        "hover:scale-110 hover:shadow-2xl transform-gpu",
        badge.isUnlocked 
          ? "bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50"
          : badge.isRequested
          ? "bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-500/50"
          : "bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50",
        "shadow-lg"
      )}
    >
      {/* Background glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        badge.isUnlocked ? "bg-emerald-500/20" : badge.isRequested ? "bg-yellow-500/20" : "bg-rose-500/20"
      )}></div>

      {/* Lock indicator for locked badges */}
      {!badge.isUnlocked && !badge.isRequested && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      )}

      {/* Pending indicator for requested badges */}
      {!badge.isUnlocked && badge.isRequested && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
      )}
      
      {/* Unlock indicator for unlocked badges */}
      {badge.isUnlocked && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M6 12l4 4 8-8"/>
          </svg>
        </div>
      )}
      
      {/* Badge image */}
      <div className="w-20 h-24 relative group-hover:scale-105 transition-transform duration-300">
        {(() => {
          const src = badge.image || ''
          const classes = cn(
            "w-full h-full object-contain transition-all duration-300",
            !badge.isUnlocked && "grayscale opacity-50"
          )
          // Use Next Image for all cases (GIFs included) to satisfy linting
          return (
            <Image 
              src={src}
              alt={badge.title}
              width={80}
              height={96}
              className={classes}
              unoptimized
            />
          )
        })()}
      </div>

      {/* Badge name */}
      <div className="text-center">
        <span className={cn(
          "text-sm font-semibold leading-tight tracking-wide",
          badge.isUnlocked ? "text-emerald-200" : badge.isRequested ? "text-yellow-200" : "text-rose-200"
        )}>
          {badge.title}
        </span>
      </div>

      {/* Shine effect for unlocked badges */}
      {badge.isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700 ease-in-out"></div>
      )}
    </div>
  );
};

export default ProfileBadge;
