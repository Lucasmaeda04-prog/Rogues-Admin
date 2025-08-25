'use client';

import { Button } from '@/components/Button';
import { Modal } from '@/components/modals/Modal';
import { cn } from '@/lib/cn';
import { Campton } from '@/lib/fonts';
import { BadgeData } from '@/types';
import { useState } from 'react';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: BadgeData | null;
  onRequestBadge: (justification: string) => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({
  isOpen,
  onClose,
  badge,
  onRequestBadge,
}) => {
  const [justification, setJustification] = useState('');
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const handleRequest = async () => {
    if (!justification.trim()) return;
    
    setIsRequestLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onRequestBadge(justification);
      setJustification('');
      setIsRequestLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setJustification('');
    setIsRequestLoading(false);
    onClose();
  };

  if (!badge) return null;

  return (
      <div className="bg-gradient-to-r from-[rgba(236,23,81,1)] to-[rgba(7,78,138,1)] rounded-3xl p-[2px]">
        <div className="bg-[#1a1c1f] rounded-3xl overflow-hidden h-fit w-full">
          {/* Header with badge image */}
          <div className="relative bg-gradient-to-b from-[#2a1c2f] to-[#1a1c1f] p-8 flex flex-col items-center">
            {/* Badge Image */}
            <div className="relative mb-6">
              <img 
                src={badge.image}
                alt={badge.name}
                className={cn(
                  "w-24 h-28 object-contain transition-all duration-300",
                  !badge.isUnlocked && "grayscale opacity-50"
                )}
              />
              {!badge.isUnlocked && !badge.isRequested && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="white" 
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                      <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                </div>
              )}
              {!badge.isUnlocked && badge.isRequested && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="white" 
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Badge Title and Status */}
            <h2 className={cn(
              "text-white text-2xl font-bold mb-2 text-center",
              Campton.className
            )}>
              {badge.name}
            </h2>
            
            <div className={cn(
              "px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider",
              badge.isUnlocked 
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : badge.isRequested
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            )}>
              {badge.isUnlocked ? 'UNLOCKED' : badge.isRequested ? 'PENDING REVIEW' : 'LOCKED'}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-4">
            {/* Description */}
            <div className="mb-6">
              <h3 className={cn(
                "text-white text-lg font-semibold mb-3",
                Campton.className
              )}>
                Description
              </h3>
              <p className={cn(
                "text-white/80 text-sm leading-relaxed",
                Campton.className
              )}>
                {badge.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <h3 className={cn(
                "text-white text-lg font-semibold mb-3",
                Campton.className
              )}>
                How to Unlock
              </h3>
              <p className={cn(
                "text-white/80 text-sm leading-relaxed",
                Campton.className
              )}>
                {badge.requirement}
              </p>
            </div>

            {/* Request Section - Only show for locked badges that haven't been requested */}
            {!badge.isUnlocked && !badge.isRequested && (
              <div className="space-y-4">
                <div>
                  <h3 className={cn(
                    "text-white text-lg font-semibold mb-3",
                    Campton.className
                  )}>
                    Request This Badge
                  </h3>
                  <p className={cn(
                    "text-white/60 text-sm mb-4",
                    Campton.className
                  )}>
                    Explain why you believe you qualify for this badge:
                  </p>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Write your justification here..."
                    className={cn(
                      "w-full h-24 bg-white/5 border border-white/20 rounded-lg px-4 py-3",
                      "text-white placeholder-white/50 resize-none",
                      "focus:outline-none focus:border-[#ec1751] transition-colors",
                      Campton.className
                    )}
                    maxLength={500}
                  />
                  <div className="text-right mt-2">
                    <span className={cn(
                      "text-xs text-white/50",
                      Campton.className
                    )}>
                      {justification.length}/500
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    color="default"
                    className={cn(
                      "flex-1 text-white/80 hover:bg-white/10 font-extrabold py-3",
                      Campton.className
                    )}
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={handleRequest}
                    loading={isRequestLoading}
                    disabled={!justification.trim()}
                    color="primary"
                    className={cn(
                      "flex-1 font-extrabold py-3",
                      Campton.className
                    )}
                  >
                    {isRequestLoading ? 'REQUESTING...' : 'REQUEST BADGE'}
                  </Button>
                </div>
              </div>
            )}

            {/* Already Unlocked Message */}
            {badge.isUnlocked && (
              <div className="text-center py-4">
                <p className={cn(
                  "text-green-400 text-lg font-semibold",
                  Campton.className
                )}>
                  🎉 Congratulations! You have earned this badge!
                </p>
              </div>
            )}

            {/* Pending Review Message */}
            {!badge.isUnlocked && badge.isRequested && (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="2"
                    className="animate-pulse"
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <p className={cn(
                  "text-yellow-400 text-lg font-semibold mb-2",
                  Campton.className
                )}>
                  ⏳ Request Under Review
                </p>
                <p className={cn(
                  "text-white/60 text-sm",
                  Campton.className
                )}>
                  Your badge request has been submitted and is being reviewed by our team. You'll be notified once it's processed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};