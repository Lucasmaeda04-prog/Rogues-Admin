import React, { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
  className?: string
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true,
  className = ""
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={handleOverlayClick}
      ></div>
      
      {/* Modal content */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto ${className}`}
          style={{ filter: 'none !important' }}
        >
          {(title || showCloseButton) && (
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-4">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 ml-auto"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
          <div className={title || showCloseButton ? "px-6 pb-6" : ""}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}