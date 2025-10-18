'use client';

import { useState, useEffect, useMemo } from 'react';
import { Campton } from '@/lib/fonts';
import { cn } from '@/lib/cn';
import ShopCard from '@/components/Previews/shopCard';
import GenericForm from '@/components/forms/GenericForm';
import { shopItemFormConfig } from '@/components/forms/form-configs';
import { useShopCategories } from '@/hooks/useShop';
import { useBadges } from '@/hooks';

interface CreateShopItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShopItemFormData) => void;
  isLoading?: boolean;
  editData?: ShopItemFormData | null;
  mode?: 'create' | 'edit' | 'view';
}

export interface ShopItemFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  tag: string;
  categoryId: number;
  image?: string;
  requiredBadgeId?: string | null;
  roleName?: string;
}

export default function CreateShopItemModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData = null,
  mode = 'create'
}: CreateShopItemModalProps) {
  const { categories } = useShopCategories()
  const { badges } = useBadges()

  const [formData, setFormData] = useState<ShopItemFormData>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    tag: '',
    categoryId: 0,
    image: '',
    requiredBadgeId: '',
    roleName: ''
  });

  const badgeOptions = useMemo(() => {
    return [
      { value: '', label: 'No badge required' },
      ...badges.map(badge => ({ value: badge.badgeId, label: badge.title }))
    ]
  }, [badges])

  const formConfig = useMemo(() => ({
    ...shopItemFormConfig,
    fields: shopItemFormConfig.fields.map(field => {
      if (field.name === 'requiredBadgeId') {
        return {
          ...field,
          options: badgeOptions
        }
      }
      if (field.name === 'roleName') {
        // Hide roleName field for Shopify items (when tag is 'shopify')
        const isShopifyItem = formData.tag === 'shopify'
        return {
          ...field,
          disabled: mode === 'view' || isShopifyItem,
          description: isShopifyItem
            ? 'Role name is not available for Shopify items'
            : 'Displayed only for Discord items. Leave empty for Shopify imports.'
        }
      }
      return field
    })
  }), [badgeOptions, mode, formData.tag])

  // Update form data when editData changes
  useEffect(() => {
    if (editData && (mode === 'edit' || mode === 'view')) {
      setFormData(editData);
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        tag: '',
        categoryId: 0,
        image: '',
        requiredBadgeId: '',
        roleName: ''
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
    if (mode === 'view') {
      return
    }

    const shopData: ShopItemFormData = {
      name: typeof data.name === 'string' ? data.name : '',
      description: typeof data.description === 'string' ? data.description : '',
      price: typeof data.price === 'number' ? data.price : Number(data.price) || 0,
      quantity: typeof data.quantity === 'number' ? data.quantity : Number(data.quantity) || 0,
      tag: typeof data.tag === 'string' ? data.tag : '',
      categoryId: typeof data.categoryId === 'number' ? data.categoryId : Number(data.categoryId) || 0,
      image: typeof data.image === 'string' ? data.image : '',
      requiredBadgeId: typeof data.requiredBadgeId === 'string' ? data.requiredBadgeId : '',
      roleName: typeof data.roleName === 'string' ? data.roleName : ''
    };
    
    // Update local state for preview in real-time
    setFormData(shopData);
  };

  const handleFormSubmit = (data: Record<string, unknown>) => {
    if (mode === 'view') {
      return
    }
    const shopData: ShopItemFormData = {
      name: typeof data.name === 'string' ? data.name : '',
      description: typeof data.description === 'string' ? data.description : '',
      price: typeof data.price === 'number' ? data.price : Number(data.price) || 0,
      quantity: typeof data.quantity === 'number' ? data.quantity : Number(data.quantity) || 0,
      tag: typeof data.tag === 'string' ? data.tag : '',
      categoryId: typeof data.categoryId === 'number' ? data.categoryId : Number(data.categoryId) || 0,
      image: typeof data.image === 'string' ? data.image : '',
      requiredBadgeId: typeof data.requiredBadgeId === 'string' ? (data.requiredBadgeId || null) : null,
      roleName: typeof data.roleName === 'string' ? data.roleName || undefined : undefined
    };
    
    onSubmit(shopData);
  };

  const getDefaultImage = () => {
    return '/assets/1f0370151ddcfa7a9e9c8817eaf92f77a581778b.png';
  };

  const getCategoryName = (categoryId: number) => {
    if (!categoryId) return 'Category';
    const category = categories.find(cat => cat.shopItemCategoryId === categoryId);
    return category ? category.name : 'Category';
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
                {mode === 'edit' ? 'Edit Shop Item' : mode === 'view' ? 'View Shop Item' : 'Create Shop Item'}
              </h2>
              <p className={cn("text-[#949191] text-[14px] font-light", Campton.className)}>
                {mode === 'view' ? 'Shopify items are read-only inside this panel.' : 'Fill the inputs below'}
              </p>
            </div>

            <GenericForm
              config={formConfig}
              onSubmit={handleFormSubmit}
              onCancel={onClose}
              onChange={handleFormChange}
              isLoading={isLoading}
              initialData={formData as unknown as Record<string, unknown>}
              className="flex-1"
              hideTitle={true}
              hideBorder={true}
              showValidationRules={mode !== 'view'}
              readOnly={mode === 'view'}
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
                category={getCategoryName(formData.categoryId)}
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
