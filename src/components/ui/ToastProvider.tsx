'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Toast, ToastType } from './Toast'

interface ToastData {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string, duration?: number) => void
  showSuccess: (title: string, description?: string) => void
  showError: (title: string, description?: string) => void
  showWarning: (title: string, description?: string) => void
  showInfo: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showToast = (type: ToastType, title: string, description?: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastData = {
      id,
      type,
      title,
      description,
      duration
    }
    
    setToasts(prev => [newToast, ...prev])
  }

  const showSuccess = (title: string, description?: string) => {
    showToast('success', title, description)
  }

  const showError = (title: string, description?: string) => {
    showToast('error', title, description)
  }

  const showWarning = (title: string, description?: string) => {
    showToast('warning', title, description)
  }

  const showInfo = (title: string, description?: string) => {
    showToast('info', title, description)
  }

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-lg">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            description={toast.description}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}