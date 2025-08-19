'use client';

import { useState, useEffect } from 'react';
import { Campton } from '@/lib/fonts';
import { cn } from '@/lib/cn';
import ShopCard from '@/components/shopCard';
import ImageUpload from '@/components/ui/ImageUpload';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleChange = (field: keyof ShopItemFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (!formData.tag.trim()) {
      newErrors.tag = 'Tag is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      tag: '',
      category: '',
      image: ''
    });
    setErrors({});
    onClose();
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
          className="bg-white rounded-[22px] w-full max-w-[1400px] max-h-[95vh] min-h-[700px] overflow-y-auto pointer-events-auto flex flex-col lg:flex-row"
          style={{ filter: 'none !important' }}
        >
          {/* Left Side - Form */}
          <div className="flex-1 p-7 lg:pr-[21px] flex flex-col min-w-0 lg:min-w-[500px]">
            <div className="mb-6">
              <h2 className={cn(
                "text-[#020202] text-[28px] font-semibold mb-2",
                Campton.className
              )}>
                {mode === 'edit' ? 'Edit Item Shop' : 'Create Item Shop'}
              </h2>
              <p className={cn(
                "text-[#949191] text-[14px] font-light",
                Campton.className
              )}>
                Fill the inputs bellow
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
              {/* Item Name */}
              <div className="space-y-3">
                <label className={cn(
                  "block text-[#4b4b4b] text-[18px] font-medium",
                  Campton.className
                )}>
                  Item Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter your name"
                    className={cn(
                      "w-full h-[47px] px-3.5 py-0 bg-[#f9f9f9] rounded-[10px] border-[1.3px] border-[#efefef] text-[14px] font-light placeholder:text-[#949191] focus:outline-none focus:border-[#020202]",
                      Campton.className,
                      errors.name && "border-red-500"
                    )}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className={cn(
                  "block text-[#4b4b4b] text-[18px] font-medium",
                  Campton.className
                )}>
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter item description"
                    rows={3}
                    className={cn(
                      "w-full px-3.5 py-2 bg-[#f9f9f9] rounded-[10px] border-[1.3px] border-[#efefef] text-[14px] font-light placeholder:text-[#949191] focus:outline-none focus:border-[#020202] resize-none",
                      Campton.className,
                      errors.description && "border-red-500"
                    )}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500 text-xs">{errors.description}</p>
                )}
              </div>

              {/* Price and Quantity */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-[38px]">
                <div className="flex-1 sm:w-[230px] space-y-3">
                  <label className={cn(
                    "block text-[#4b4b4b] text-[18px] font-medium",
                    Campton.className
                  )}>
                    Price *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="Put a number > 0"
                      min="0"
                      className={cn(
                        "w-full px-3.5 py-2 bg-[#f9f9f9] rounded-[10px] border-[1.3px] border-[#efefef] text-[14px] font-light placeholder:text-[#949191] focus:outline-none focus:border-[#020202]",
                        Campton.className,
                        errors.price && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs">{errors.price}</p>
                  )}
                </div>

                <div className="flex-1 sm:w-[251px] space-y-3">
                  <label className={cn(
                    "block text-[#4b4b4b] text-[18px] font-medium",
                    Campton.className
                  )}>
                    Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.quantity || ''}
                      onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                      placeholder="Put a number > 0"
                      min="0"
                      className={cn(
                        "w-full px-3.5 py-2 bg-[#f9f9f9] rounded-[10px] border-[1.3px] border-[#efefef] text-[14px] font-light placeholder:text-[#949191] focus:outline-none focus:border-[#020202]",
                        Campton.className,
                        errors.quantity && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.quantity && (
                    <p className="text-red-500 text-xs">{errors.quantity}</p>
                  )}
                </div>
              </div>

              {/* Tag and Category */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                <div className="flex-1 space-y-3">
                  <label className={cn(
                    "block text-[#4b4b4b] text-[18px] font-medium",
                    Campton.className
                  )}>
                    Tag *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.tag}
                      onChange={(e) => handleChange('tag', e.target.value)}
                      placeholder="Enter tag"
                      className={cn(
                        "w-full px-3.5 py-2 bg-[#f9f9f9] rounded-[10px] border-[1.3px] border-[#efefef] text-[14px] font-light placeholder:text-[#949191] focus:outline-none focus:border-[#020202]",
                        Campton.className,
                        errors.tag && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.tag && (
                    <p className="text-red-500 text-xs">{errors.tag}</p>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <label className={cn(
                    "block text-[#4b4b4b] text-[18px] font-medium",
                    Campton.className
                  )}>
                    Category *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="Enter category"
                      className={cn(
                        "w-full px-3.5 py-2 bg-[#f9f9f9] rounded-[10px] border-[1.3px] border-[#efefef] text-[14px] font-light placeholder:text-[#949191] focus:outline-none focus:border-[#020202]",
                        Campton.className,
                        errors.category && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-xs">{errors.category}</p>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="space-y-3">
                <label className={cn(
                  "block text-[#4b4b4b] text-[18px] font-medium",
                  Campton.className
                )}>
                  Image
                </label>
                <ImageUpload
                  value={formData.image}
                  onChange={(value) => handleChange('image', value)}
                  disabled={isLoading}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 mt-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className={cn(
                    "flex-1 h-[47px] bg-[#a0a0a0] text-white rounded-[9px] border border-[#efefef] text-[20px] font-semibold hover:bg-[#909090] transition-colors disabled:opacity-50",
                    Campton.className
                  )}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex-1 sm:w-[317px] h-[47px] bg-[#09171a] text-white rounded-[9px] border border-[#efefef] text-[20px] font-semibold hover:bg-[#131f22] transition-colors disabled:opacity-50",
                    Campton.className
                  )}
                >
                  {isLoading ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Preview */}
          <div className="w-full lg:w-[600px] lg:min-w-[500px] bg-white lg:rounded-r-[22px] rounded-b-[22px] lg:rounded-b-none pl-[20px] flex flex-col">
            <div className="w-full h-full bg-black lg:rounded-l-[16px] rounded-b-[22px] lg:rounded-b-none p-[35px] flex flex-col">
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