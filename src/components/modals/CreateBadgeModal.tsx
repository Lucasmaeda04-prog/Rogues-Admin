'use client';

import { useState, useEffect } from 'react';
import { Campton } from '@/lib/fonts';
import { cn } from '@/lib/cn';
import ProfileBadge from '@/components/Previews/badges/ProfileBadge';
import { BadgeModal } from '@/components/Previews/badges/BadgeModal';
import GenericForm from '@/components/forms/GenericForm';
import { badgeFormConfig } from '@/components/forms/form-configs';

interface CreateBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BadgeFormData) => void;
  isLoading?: boolean;
  editData?: BadgeFormData | null;
  mode?: 'create' | 'edit';
}

export interface BadgeFormData {
  title: string;
  description: string;
  howToUnlock: string;
  image: string;
}

export default function CreateBadgeModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  editData = null,
  mode = 'create'
}: CreateBadgeModalProps) {
  const [formData, setFormData] = useState<BadgeFormData>({
    title: '',
    description: '',
    howToUnlock: '',
    image: ''
  });


  // Update form data when editData changes
  useEffect(() => {
    if (editData && mode === 'edit') {
      setFormData(editData);
    } else if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        howToUnlock: '',
        image: ''
      });
    }
  }, [editData, mode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormChange = (data: Record<string, unknown>) => {
    const badgeData: BadgeFormData = {
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description : '',
      howToUnlock: typeof data.howToUnlock === 'string' ? data.howToUnlock : '',
      image: typeof data.image === 'string' ? data.image : ''
    };
    
    // Update local state for preview in real-time
    setFormData(badgeData);
  };

  const handleFormSubmit = (data: Record<string, unknown>) => {
    const badgeData: BadgeFormData = {
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description : '',
      howToUnlock: typeof data.howToUnlock === 'string' ? data.howToUnlock : '',
      image: typeof data.image === 'string' ? data.image : ''
    };
    
    onSubmit(badgeData);
  };

  // Create preview data for ProfileBadge
  const previewBadgeData = {
    id: 999, // Preview ID
    name: formData.title || 'Badge Title',
    description: formData.description || 'Badge description will appear here',
    requirement: formData.howToUnlock || 'This is how you can unlock this badge',
    image: formData.image || '/assets/1f0370151ddcfa7a9e9c8817eaf92f77a581778b.png', // Default badge image
    isUnlocked: true, // Show as unlocked for better preview
    isRequested: false
  };


  return (
    <div className="fixed inset-0 z-50">
        <div 
          className="absolute inset-0 backdrop-blur-sm bg-black/30"
          onClick={handleOverlayClick}
        />
        
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div 
            className="bg-white rounded-[22px] w-full max-w-[1400px] max-h-[95vh] overflow-y-auto pointer-events-auto flex flex-col lg:flex-row"
            style={{ filter: 'none !important' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side - Form */}
            <div className="flex-1 p-7 lg:pr-[21px] flex flex-col min-w-0 lg:min-w-[500px]">
              <div className="mb-6">
                <h2 className={cn("text-[#020202] text-[28px] font-semibold mb-2", Campton.className)}>
                  {mode === 'edit' ? 'Edit Badge' : 'Create Badge'}
                </h2>
                <p className={cn("text-[#949191] text-[14px] font-light", Campton.className)}>
                  Fill the inputs bellow
                </p>
              </div>

              <GenericForm
                config={badgeFormConfig}
                onSubmit={handleFormSubmit}
                onCancel={onClose}
                onChange={handleFormChange}
                isLoading={isLoading}
                initialData={formData as unknown as Record<string, unknown>}
                className="flex-1"
                hideTitle={true}
                hideBorder={true}
              />
            </div>

            {/* Right Side - Preview */}
            <div className="w-full lg:w-[600px] lg:min-w-[500px] bg-white lg:rounded-r-[22px] rounded-b-[22px] lg:rounded-b-none pl-[20px] flex flex-col max-h-full">
              <div className="w-full h-full bg-black lg:rounded-l-[16px] lg:rounded-r-[22px] rounded-b-[22px] lg:rounded-b-none p-[35px] flex flex-col overflow-y-auto">
                <div className="mb-6">
                  <h3 className={cn(
                    "text-[#d7d7d7] text-[28px] w-full mb-2",
                    Campton.className
                  )}>
                    Badge Preview
                  </h3>
                </div>
                
                <div className="flex-1 flex flex-col gap-4">
                  {/* Profile Badge Preview */}
                  <div className="flex flex-col gap-5">
                    <h4 className={cn("text-[#d7d7d7] text-[20px] font-medium", Campton.className)}>
                      Profile Badge
                    </h4>
                    
                    <div className="flex justify-center">
                      <div className="w-[200px]">
                        <ProfileBadge badge={previewBadgeData} />
                      </div>
                    </div>
                  </div>

                  {/* Badge Modal Preview */}
                  <div className="flex flex-col gap-5">
                    <h4 className={cn("text-[#d7d7d7] text-[20px] font-medium", Campton.className)}>
                      Badge Modal
                    </h4>
                    
                    <div className="flex justify-center">
                      <div className="w-full max-w-[400px] scale-75 sm:scale-90 lg:scale-75 xl:scale-90 origin-top">
                        <BadgeModal
                          isOpen={true}
                          onClose={() => {}}
                          badge={previewBadgeData}
                          onRequestBadge={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}