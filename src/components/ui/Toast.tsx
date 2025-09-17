'use client'

import { useCallback, useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  onClose: (id: string) => void
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    descriptionColor: 'text-green-700'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    descriptionColor: 'text-red-700'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    descriptionColor: 'text-yellow-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    descriptionColor: 'text-blue-700'
  }
}

export function Toast({ id, type, title, description, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const config = toastConfig[type]
  const IconComponent = config.icon

  const handleClose = useCallback(() => {
    setIsRemoving(true)
    setTimeout(() => {
      onClose(id)
    }, 300) // Match animation duration
  }, [id, onClose])

  useEffect(() => {
    // Show animation
    setIsVisible(true)

    // Auto close after duration
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, handleClose])

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out mb-3
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 min-w-[380px] max-w-lg w-full
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <p className={`text-sm font-medium ${config.titleColor} leading-5`}>
            {title}
          </p>
          {description && (
            <p className={`mt-1 text-sm ${config.descriptionColor} leading-5 whitespace-normal`}>
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleClose}
            className={`inline-flex items-center justify-center rounded-md ${config.bgColor} text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1.5`}
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
