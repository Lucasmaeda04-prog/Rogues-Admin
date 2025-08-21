'use client';

import { useState, useEffect } from 'react';
import { Campton } from '@/lib/fonts';
import { cn } from '@/lib/cn';
import ShopCard from '@/components/Previews/shopCard';
import GenericForm from '@/components/forms/GenericForm';
import { shopItemFormConfig } from '@/components/forms/form-configs';

interface CreateShopItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShopItemFormData) => void;
  isLoading?: boolean;
  editData?: ShopItemFormData | null;
  mode?: 'create' | 'edit';
}

export interface ShopItemFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  tag: string;
  category: string;
  image?: string;
}

export default function CreateShopItemModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  editData = null,
  mode = 'create'
}: CreateShopItemModalProps) {
  const [formData, setFormData] = useState<ShopItemFormData>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    tag: '',
    category: '',
    image: ''
  });

  // Update form data when editData changes
  useEffect(() => {
    if (editData && mode === 'edit') {
      setFormData(editData);
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        tag: '',
        category: '',
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
    const shopData: ShopItemFormData = {
      name: typeof data.name === 'string' ? data.name : '',
      description: typeof data.description === 'string' ? data.description : '',
      price: typeof data.price === 'number' ? data.price : Number(data.price) || 0,
      quantity: typeof data.quantity === 'number' ? data.quantity : Number(data.quantity) || 0,
      tag: typeof data.tag === 'string' ? data.tag : '',
      category: typeof data.category === 'string' ? data.category : '',
      image: typeof data.image === 'string' ? data.image : ''
    };
    
    // Update local state for preview in real-time
    setFormData(shopData);
  };

  const handleFormSubmit = (data: Record<string, unknown>) => {
    const shopData: ShopItemFormData = {
      name: typeof data.name === 'string' ? data.name : '',
      description: typeof data.description === 'string' ? data.description : '',
      price: typeof data.price === 'number' ? data.price : Number(data.price) || 0,
      quantity: typeof data.quantity === 'number' ? data.quantity : Number(data.quantity) || 0,
      tag: typeof data.tag === 'string' ? data.tag : '',
      category: typeof data.category === 'string' ? data.category : '',
      image: typeof data.image === 'string' ? data.image : ''
    };
    
    onSubmit(shopData);
  };

  const getDefaultImage = () => {
    return '/assets/1f0370151ddcfa7a9e9c8817eaf92f77a581778b.png';
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={handleOverlayClick}
      />
      
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-[22px] w-full max-w-[1400px] max-h-[95vh] min-h-[700px] pointer-events-auto flex flex-col lg:flex-row"
          style={{ filter: 'none !important' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left side - Form */}
          <div className="flex-1 p-7 lg:pr-[21px] flex flex-col min-w-0 lg:min-w-[500px] overflow-y-auto">
            <div className="mb-6">
              <h2 className={cn("text-[#020202] text-[28px] font-semibold mb-2", Campton.className)}>
                {mode === 'edit' ? 'Edit Item Shop' : 'Create Item Shop'}
              </h2>
              <p className={cn("text-[#949191] text-[14px] font-light", Campton.className)}>
                Fill the inputs bellow
              </p>
            </div>

            <GenericForm
              config={shopItemFormConfig}
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
          <div className="w-full lg:w-[600px] lg:min-w-[500px] bg-white lg:rounded-r-[22px] rounded-b-[22px] lg:rounded-b-none pl-[20px] flex flex-col">
            <div className="w-full h-full bg-black lg:rounded-l-[16px] lg:rounded-r-[22px] rounded-b-[22px] lg:rounded-b-none p-[35px] flex flex-col">
              <div className="mb-6">
                <h3 className={cn(
                  "text-[#d7d7d7] text-[28px] w-full mb-2",
                  Campton.className
                )}>
                  Item Preview
                </h3>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
            
            <div className="w-80">
              <ShopCard
                title={formData.name || 'Item Name'}
                description={formData.description || 'Item description will appear here'}
                price={formData.price || 0}
                category={formData.category || 'Category'}
                stock={formData.quantity || 0}
                imageUrl={formData.image || getDefaultImage()}
                tag={formData.tag || undefined}
                onPurchase={() => {}}
                className="w-full"
              />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}