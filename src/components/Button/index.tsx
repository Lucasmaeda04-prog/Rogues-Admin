import { cn } from '@/lib/cn';
import type { ComponentProps, ReactNode } from 'react';
import type { StrictOmit } from 'ts-essentials';
import { IconLoading } from '../Icons';

type BaseProps = {
  /** @default "contained" */
  variant?: 'contained' | 'outlined';
  /** @default "default" */
  size?: 'x-small' | 'small' | 'default' | 'large';
  /** @default "primary" */
  color?: 'primary' | 'secondary' | 'tertiary' | 'default';
  children: ReactNode;
  className?: string;
  loading?: boolean;
  loadingColor?: string;
};

type ButtonOnlyProps = BaseProps &
  StrictOmit<ComponentProps<'button'>, 'children'>;

export type ButtonProps = ButtonOnlyProps;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  size = 'default',
  color = 'primary',
  loading,
  className: buttonClassName,
  loadingColor,
  ...rest
}) => {
  const className = {
    size: {
      small: 'text-xs py-0.5 px-3',
      default: 'text-sm py-1 px-3',
      large: 'text-base py-2.5 px-5 font-semibold',
    },
    variant: {
      contained: {
        primary:
          'bg-rogues-default-150 hover:bg-rogues-default-150/50 text-white',
        secondary:
          'bg-white/10 border border-transparent hover:bg-white/15 text-[#F0F0F0]',
        tertiary: 'bg-black text-white hover:bg-black/70',
      },
      outlined: {
        default:
          'border border-rogues-default-150 hover:bg-rogues-default-150 text-rogues-default-150 hover:text-white',
      },
    },
    common:
      'rounded-md flex items-center justify-center transition duration-200 ease-linear h-fit w-fit outline-none',
    disabled:
      'cursor-not-allowed bg-white/10 opacity-40 hover:bg-white/15 text-white',
  };

  const commonClasses = cn(
    className.common,
    className.size[size as keyof typeof className.size],
    variant
      ? (className.variant as { [key: string]: { [key: string]: string } })[
          variant
        ][color]
      : '',
    { [className.disabled]: (rest as { disabled?: boolean }).disabled },
    buttonClassName,
  );

  return (
    <button
      className={cn(
        'gap-x-2 transition-[width] duration-100 ease-in',
        commonClasses,
      )}
      {...rest}
    >
      {loading && (
        <IconLoading color={loadingColor || '#fff'} className="size-4" />
      )}
      {children}
    </button>
  );
};
