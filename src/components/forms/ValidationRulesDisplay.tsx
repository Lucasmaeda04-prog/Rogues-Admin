'use client'

import { useMemo, useEffect } from 'react'
import { FormField } from './GenericForm'
import { Campton } from '@/lib/fonts'
import { cn } from '@/lib/cn'

interface ValidationRulesDisplayProps {
  fields: FormField[]
  formData: Record<string, unknown>
  className?: string
  onValidationChange?: (isValid: boolean) => void
}

interface ValidationRule {
  id: string
  fieldName: string
  fieldLabel: string
  rule: string
  isValid: boolean
}

const getCustomValidationRules = (fieldName: string, fieldType: string): string[] => {
  const rules: string[] = []

  switch (fieldName) {
    case 'password':
      rules.push(
        'Must contain at least 1 uppercase letter',
        'Must contain at least 1 number'
      )
      break
    case 'confirmPassword':
      rules.push('Must match the password field')
      break
    case 'deadline':
      rules.push('Must be in DD/MM/YYYY - HH:MM format (if provided)')
      break
    case 'email':
      rules.push('Must be a valid email address')
      break
    default:
      if (fieldType === 'number') {
        rules.push('Must be a valid number')
      }
      break
  }

  return rules
}

const validateFieldRule = (field: FormField, value: unknown, rule: string, formData: Record<string, unknown>): boolean => {
  switch (rule) {
    case `Must be at least ${field.validation?.minLength} characters long`:
      return typeof value === 'string' && value.length >= (field.validation?.minLength || 0)
    
    case `Must not exceed ${field.validation?.maxLength} characters`:
      return typeof value === 'string' && value.length <= (field.validation?.maxLength || Infinity)
    
    case 'Must be a valid email address format':
      return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    
    case 'Must contain at least 1 uppercase letter':
      return typeof value === 'string' && /[A-Z]/.test(value)
    
    case 'Must contain at least 1 number':
      return typeof value === 'string' && /[0-9]/.test(value)
    
    case 'Must match the password field':
      return formData.password === value
    
    case 'Must be greater than 0':
      return typeof value === 'number' && value > 0
    
    case 'Cannot be negative':
      return typeof value === 'number' && value >= 0
    
    case 'Must be in DD/MM/YYYY - HH:MM format (if provided)':
      if (!value || (typeof value === 'string' && value.trim() === '')) return true
      return typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/.test(value)
    
    default:
      return true
  }
}

export function ValidationRulesDisplay({ fields, formData, className, onValidationChange }: ValidationRulesDisplayProps) {
  const validationRules = useMemo(() => {
    const rules: ValidationRule[] = []

    fields.forEach(field => {
      const fieldRules: string[] = []

      // Skip required field validation - not needed in checklist

      // Validation rules
      if (field.validation) {
        const { minLength, maxLength, pattern, custom } = field.validation

        if (minLength) {
          fieldRules.push(`Must be at least ${minLength} characters long`)
        }

        if (maxLength) {
          fieldRules.push(`Must not exceed ${maxLength} characters`)
        }

        if (pattern) {
          // Convert common patterns to human-readable text
          const patternString = pattern.toString()
          if (patternString.includes('@') && patternString.includes('\\.')) {
            fieldRules.push('Must be a valid email address format')
          } else {
            fieldRules.push('Must match the required format')
          }
        }

        if (custom) {
          // Handle common custom validation patterns
          const customRules = getCustomValidationRules(field.name, field.type)
          fieldRules.push(...customRules)
        }
      }

      // Add type-specific rules
      if (field.type === 'number') {
        if (field.name === 'price' || field.name === 'rewards') {
          fieldRules.push('Must be greater than 0')
        } else if (field.name === 'quantity') {
          fieldRules.push('Cannot be negative')
        }
      }

      // Convert to ValidationRule objects with validation status
      fieldRules.forEach((rule, index) => {
        if (fieldRules.length > 0) {
          const isValid = validateFieldRule(field, formData[field.name], rule, formData)
          rules.push({
            id: `${field.name}-${index}`,
            fieldName: field.name,
            fieldLabel: field.label,
            rule,
            isValid
          })
        }
      })
    })

    return rules
  }, [fields, formData])

  const allRulesValid = validationRules.every(rule => rule.isValid)

  useEffect(() => {
    onValidationChange?.(allRulesValid)
  }, [allRulesValid, onValidationChange])

  if (validationRules.length === 0) {
    return null
  }

  return (
    <div className={cn(
      "border-t border-gray-200 pt-3 mt-2",
      className
    )}>
      <h4 className={cn(
        "text-sm font-medium text-blue-900 mb-2",
        Campton.className
      )}>
        Requirements:
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
        {validationRules.map((rule) => (
          <div key={rule.id} className="flex items-start gap-2">
            <div
              className={cn(
                "mt-0.5 h-3 w-3 rounded-full border flex items-center justify-center flex-shrink-0",
                rule.isValid
                  ? "bg-cyan-500 border-cyan-500"
                  : "bg-white border-gray-300"
              )}
            >
              {rule.isValid && (
                <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
              )}
            </div>
            <label
              htmlFor={rule.id}
              className={cn(
                "text-sm cursor-default select-none font-light",
                rule.isValid ? "text-cyan-600 line-through opacity-60" : "text-gray-700",
                Campton.className
              )}
            >
              <span className="font-light">{rule.fieldLabel}:</span> {rule.rule}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
