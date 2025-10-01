'use client'

import { useState, useEffect, useMemo } from 'react'
import { Campton } from '@/lib/fonts'
import { cn } from '@/lib/cn'
import CustomSelect from './CustomSelect'
import ImageUpload from '../ui/ImageUpload'
import { CategorySelector } from './CategorySelector'
import { ValidationRulesDisplay } from './ValidationRulesDisplay'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'checkbox' | 'select' | 'radio' | 'image-upload' | 'category-selector'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: { value: string | number; label: string }[] // For select fields
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: unknown, formData?: Record<string, unknown>) => string | null // Returns error message or null
  }
  description?: string
  conditionalDisabled?: (formData: Record<string, unknown>) => boolean // Conditionally disable field
  group?: string // Group name for side-by-side layout
  groupWidth?: string // Custom width for grouped fields (e.g., 'flex-1', 'w-[230px]')
}

export interface FieldGroup {
  name: string
  fields: FormField[]
  className?: string // Custom CSS classes for the group container
}

export interface FormConfig {
  title: string
  fields: FormField[]
  submitLabel?: string
  cancelLabel?: string
  showCancel?: boolean
}

interface GenericFormProps {
  config: FormConfig
  onSubmit: (data: Record<string, unknown>) => void
  onCancel?: () => void
  onChange?: (data: Record<string, unknown>) => void
  isLoading?: boolean
  initialData?: Record<string, unknown>
  className?: string
  hideTitle?: boolean
  hideBorder?: boolean
  showValidationRules?: boolean
  readOnly?: boolean
}

export default function GenericForm({ 
  config, 
  onSubmit, 
  onCancel,
  onChange, 
  isLoading = false, 
  initialData = {},
  className = "",
  hideTitle = false,
  hideBorder = false,
  showValidationRules = true,
  readOnly = false
}: GenericFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Group fields by group property
  const groupedFields = useMemo(() => {
    const groups: { [key: string]: FormField[] } = {}
    const ungrouped: FormField[] = []

    config.fields.forEach(field => {
      if (field.group) {
        if (!groups[field.group]) {
          groups[field.group] = []
        }
        groups[field.group].push(field)
      } else {
        ungrouped.push(field)
      }
    })

    return { groups, ungrouped }
  }, [config.fields])

  const memoizedInitialData = useMemo(() => {
    const initData: Record<string, unknown> = {}
    config.fields.forEach(field => {
      if (field.type === 'checkbox') {
        initData[field.name] = initialData[field.name] ?? false
      } else {
        initData[field.name] = initialData[field.name] ?? ''
      }
    })
    return initData
  }, [config.fields, initialData])

  useEffect(() => {
    setFormData(memoizedInitialData)
  }, [memoizedInitialData])

  const validateField = (field: FormField, value: unknown): string | null => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`
    }

    if (field.validation) {
      if (field.validation.minLength && typeof value === 'string' && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`
      }
      
      if (field.validation.maxLength && typeof value === 'string' && value.length > field.validation.maxLength) {
        return `${field.label} must be no more than ${field.validation.maxLength} characters`
      }
      
      if (field.validation.pattern && typeof value === 'string' && !field.validation.pattern.test(value)) {
        return `${field.label} format is invalid`
      }
      
      if (field.validation.custom) {
        return field.validation.custom(value, formData)
      }
    }

    return null
  }

  const handleChange = (fieldName: string, value: unknown) => {
    if (readOnly) {
      return
    }

    const newFormData = { ...formData, [fieldName]: value }
    setFormData(newFormData)
    
    // Call onChange callback with updated data
    onChange?.(newFormData)
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (readOnly) {
      return
    }
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    config.fields.forEach(field => {
      const error = validateField(field, formData[field.name])
      if (error) {
        newErrors[field.name] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  const handleReset = () => {
    const resetData: Record<string, unknown> = {}
    config.fields.forEach(field => {
      if (field.type === 'checkbox') {
        resetData[field.name] = false
      } else {
        resetData[field.name] = ''
      }
    })
    setFormData(resetData)
    setErrors({})
    onCancel?.()
  }

  const renderField = (field: FormField) => {
    const isConditionallyDisabled = field.conditionalDisabled ? field.conditionalDisabled(formData) : false
    const isFieldDisabled = readOnly || isLoading || field.disabled || isConditionallyDisabled
    
    const getInputClassName = (extraClasses = '') => cn(
      "w-full px-3.5 py-2 bg-[#f9f9f9] rounded-[10px] border-[1.3px] border-[#efefef] text-[14px] font-light placeholder:text-[#949191] focus:outline-none focus:border-[#020202]",
      Campton.className,
      errors[field.name] && "border-red-500",
      isConditionallyDisabled && "opacity-50 cursor-not-allowed",
      extraClasses
    )

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            disabled={isFieldDisabled}
            className={getInputClassName("resize-none")}
            value={(formData[field.name] as string) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            required={field.required}
          />
        )

      case 'select':
        return (
          <CustomSelect
            value={(formData[field.name] as string | number) || ''}
            onChange={(value) => handleChange(field.name, value)}
            options={field.options || []}
            placeholder={field.placeholder || `Select ${field.label}`}
            disabled={isFieldDisabled}
            error={!!errors[field.name]}
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              checked={(formData[field.name] as boolean) || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              disabled={isLoading || field.disabled}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name] === option.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={isLoading || field.disabled}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor={`${field.name}-${option.value}`} className="text-sm font-medium text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )

      case 'image-upload':
        return (
          <ImageUpload
            value={(formData[field.name] as string) || ''}
            onChange={(value) => handleChange(field.name, value)}
            disabled={isFieldDisabled}
          />
        )

      case 'category-selector':
        return (
          <CategorySelector
            value={formData[field.name] as string | number}
            onChange={(value) => handleChange(field.name, value)}
            error={errors[field.name]}
            label={field.label}
            required={field.required}
            disabled={readOnly || isFieldDisabled}
          />
        )

      case 'number':
        return (
          <input
            id={field.name}
            disabled={isFieldDisabled}
            className={getInputClassName()}
            type="number"
            value={(formData[field.name] as string | number) || ''}
            onChange={(e) => {
              const value = field.name === 'quantity' 
                ? parseInt(e.target.value) || 0 
                : parseFloat(e.target.value) || 0;
              handleChange(field.name, value);
            }}
            placeholder={field.placeholder}
            min="0"
            required={field.required}
          />
        )

      default:
        return (
          <input
            id={field.name}
            disabled={isFieldDisabled}
            className={getInputClassName(field.name === 'name' ? "h-[47px] py-0" : "")}
            type={field.type}
            value={(formData[field.name] as string | number) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
    }
  }

  const renderSingleField = (field: FormField, groupWidth?: string) => (
    <div key={field.name} className={cn("space-y-3", groupWidth)}>
      {field.type !== 'checkbox' && field.type !== 'category-selector' && (
        <label htmlFor={field.name} className={cn(
          "block text-[#4b4b4b] text-[18px] font-medium",
          Campton.className
        )}>
          {field.label} {field.required && '*'}
        </label>
      )}
      
      <div className="relative">
        {renderField(field)}
      </div>
      
      {errors[field.name] && (
        <p className="text-red-500 text-xs">{errors[field.name]}</p>
      )}
      
      {field.description && (
        <p className={cn("text-[#949191] text-xs", Campton.className)}>
          {field.description}
        </p>
      )}
    </div>
  )

  const renderGroup = (groupName: string, fields: FormField[]) => {
    // Determine group layout classes based on group name or use default
    const groupClasses = groupName === 'price-quantity' 
      ? "flex flex-col sm:flex-row gap-4 sm:gap-[38px]"
      : groupName === 'tag-category'
      ? "flex flex-col sm:flex-row gap-4 sm:gap-5"
      : "flex flex-col sm:flex-row gap-4"

    return (
      <div key={groupName} className={groupClasses}>
        {fields.map(field => {
          // Use custom width or default flex-1
          const fieldWidth = field.groupWidth || "flex-1"
          return renderSingleField(field, fieldWidth)
        })}
      </div>
    )
  }

  return (
    <div className={`bg-white ${!hideBorder ? 'rounded-lg shadow border' : ''} ${!hideBorder ? 'p-6' : ''} ${className} flex flex-col h-full`}>
      {!hideTitle && (
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{config.title}</h2>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="space-y-5 flex-1 overflow-y-auto">
          {/* Render ungrouped fields first */}
          {groupedFields.ungrouped.map(field => renderSingleField(field))}
          
          {/* Render grouped fields */}
          {Object.entries(groupedFields.groups).map(([groupName, fields]) => 
            renderGroup(groupName, fields)
          )}
        </div>

        {/* Validation Rules Display - At the end before buttons */}
        {showValidationRules && !readOnly && (
          <ValidationRulesDisplay 
            fields={config.fields} 
            formData={formData}
            className="mt-4 mb-4"
          />
        )}

        {!readOnly && (
          <div className="flex flex-col sm:flex-row gap-2.5 mt-4 flex-shrink-0">
            {(config.showCancel !== false) && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className={cn(
                  "flex-1 h-[47px] bg-[#a0a0a0] text-white rounded-[9px] border border-[#efefef] text-[20px] font-semibold hover:bg-[#909090] transition-colors disabled:opacity-50",
                  Campton.className
                )}
              >
                {config.cancelLabel || 'Cancel'}
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex-1 sm:w-[317px] h-[47px] bg-[#09171a] text-white rounded-[9px] border border-[#efefef] text-[20px] font-semibold hover:bg-[#131f22] transition-colors disabled:opacity-50",
                Campton.className
              )}
            >
              {isLoading ? 'Saving...' : (config.submitLabel || 'Save')}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
