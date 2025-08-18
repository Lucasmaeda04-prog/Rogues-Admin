'use client';

import Image from 'next/image';
import { Button } from '../Button';
import { cn } from '@/lib/cn';
import { Campton } from '@/lib/fonts';

export interface ShopCardProps {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  tag?: string;
  onPurchase: () => void;
  className?: string;
}

const ShopCard: React.FC<ShopCardProps> = ({
  title,
  description,
  price,
  category,
  stock,
  imageUrl,
  tag,
  onPurchase,
  className,
}) => {
  const isOutOfStock = stock === 0;

  return (
    <div
      className={cn(
        'bg-black/90 rounded-2xl overflow-hidden border-2 border-white/10 hover:border-white/20 transition-all duration-300',
        className
      )}
    >
      {/* Product Image */}
      <div className="p-3">
        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover w-full h-full"
        />
        
        {/* Tag */}
        {tag && (
          <div className="absolute top-3 left-3 bg-yellow-500 px-2 py-1 rounded-full flex items-center gap-1">
            <span className={cn("text-black text-xs font-medium", Campton.className)}>
              {tag}
            </span>
          </div>
        )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={cn("text-white text-lg font-semibold", Campton.className)}>
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-lg">🥕</span>
            <span className={cn("text-rogues-default-150 text-xl font-bold", Campton.className)}>
              {price}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Category and Stock */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/60 text-xs uppercase tracking-wider">
            {category}
          </span>
          <span className={cn(
            "text-xs font-medium",
            stock > 5 ? "text-green-400" : stock > 0 ? "text-yellow-400" : "text-red-400"
          )}>
            {isOutOfStock ? "Out of stock" : `${stock} in stock`}
          </span>
        </div>

        {/* Purchase Button */}
        <Button
          onClick={onPurchase}
          disabled={isOutOfStock}
          color="primary"
          className={cn(
            "w-full font-bold py-3",
            isOutOfStock && "opacity-50 cursor-not-allowed",
            Campton.className
          )}
        >
          {isOutOfStock ? "OUT OF STOCK" : "PURCHASE"}
        </Button>
      </div>
    </div>
  );
};

export default ShopCard;