'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { Campton } from '@/lib/fonts';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  disabled = false,
  className,
  error = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={selectRef}
      className={cn(
        "relative w-full",
        className
      )}
    >
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2.5 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
          "flex items-center justify-between bg-white",
          error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-gray-400 hover:shadow-sm',
          isOpen && !disabled && 'border-blue-500 ring-2 ring-blue-200 shadow-sm',
          Campton.className
        )}
      >
        <span className={cn(
          "truncate",
          !selectedOption ? "text-gray-500" : "text-gray-900"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        {/* Arrow Icon */}
        <svg
          className={cn(
            "w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2 text-gray-500",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95 duration-200">
          {options.length === 0 ? (
            <div className={cn(
              "px-3 py-2 text-gray-500 text-sm",
              Campton.className
            )}>
              No options available
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-3 py-2.5 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors text-sm border-b border-gray-50 last:border-b-0",
                  value === option.value ? "bg-blue-100 text-blue-900 font-medium" : "text-gray-900 hover:text-blue-700",
                  "first:rounded-t-lg last:rounded-b-lg",
                  Campton.className
                )}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}