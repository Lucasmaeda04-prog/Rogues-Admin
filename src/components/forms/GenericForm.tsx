'use client'

import { useState, useEffect, useMemo } from 'react'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'checkbox' | 'select'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: { value: string | number; label: string }[] // For select fields
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => string | null // Returns error message or null
  }
  description?: string
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
  onSubmit: (data: Record<string, any>) => void
  onCancel?: () => void
  isLoading?: boolean
  initialData?: Record<string, any>
  className?: string
}

export default function GenericForm({ 
  config, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  initialData = {},
  className = ""
}: GenericFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const memoizedInitialData = useMemo(() => {
    const initData: Record<string, any> = {}
    config.fields.forEach(field => {
      if (field.type === 'checkbox') {
        initData[field.name] = initialData[field.name] ?? false
      } else {
        initData[field.name] = initialData[field.name] ?? ''
      }
    })
    return initData
  }, [config.fields.length, JSON.stringify(initialData)])

  useEffect(() => {
    setFormData(memoizedInitialData)
  }, [memoizedInitialData])

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`
    }

    if (field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`
      }
      
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `${field.label} must be no more than ${field.validation.maxLength} characters`
      }
      
      if (field.validation.pattern && !field.validation.pattern.test(value)) {
        return `${field.label} format is invalid`
      }
      
      if (field.validation.custom) {
        return field.validation.custom(value)
      }
    }

    return null
  }

  const handleChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
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
    const resetData: Record<string, any> = {}
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
    const commonProps = {
      id: field.name,
      disabled: isLoading || field.disabled,
      className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        errors[field.name] ? 'border-red-300' : 'border-gray-300'
      }`
    }

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            required={field.required}
          />
        )

      case 'select':
        return (
          <select
            {...commonProps}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              disabled={isLoading || field.disabled}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
          </div>
        )

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow border p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{config.title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {config.fields.map(field => (
          <div key={field.name}>
            {field.type !== 'checkbox' && (
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && '*'}
              </label>
            )}
            
            {renderField(field)}
            
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
            
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-6">
          {(config.showCancel !== false) && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {config.cancelLabel || 'Cancel'}
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (config.submitLabel || 'Save')}
          </button>
        </div>
      </form>
    </div>
  )
}