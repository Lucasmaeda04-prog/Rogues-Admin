'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Modal from './modal'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  loadingText?: string
  icon?: string
  itemName?: string // Nome específico do item sendo deletado
}

function InfoIcon({ icon = "/assets/info.svg" }: { icon?: string }) {
  return (
    <div className="w-[50px] h-[50px] flex items-center justify-center">
      <Image 
        src={icon} 
        alt="Info" 
        width={50}
        height={50}
        className="w-[50px] h-[50px]"
      />
    </div>
  );
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item ?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
  loadingText = "Deleting...",
  icon,
  itemName
}: DeleteConfirmationModalProps) {
  // Generate dynamic message if not provided
  const finalMessage = message || 
    `Are you sure you want to delete ${itemName ? `"${itemName}"` : 'this item'} ? This action cannot be undone`
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      showCloseButton={false}
      className="rounded-[32px] shadow-2xl border-2 border-[rgba(0,0,0,0.2)]"
    >
      <div className="flex flex-col gap-[21px] items-center justify-center px-[22px] py-[35px]">
          {/* Info Icon */}
          <div className="flex items-center justify-center">
            <InfoIcon icon={icon} />
          </div>

          {/* Text Content */}
          <div className="text-center">
            <h2 className="text-[#0f1237] text-[20px] font-semibold mb-3 leading-normal">
              {title}
            </h2>
            <p className="text-[#0f1237] text-[14px] font-light leading-normal max-w-[371px]">
              {finalMessage}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-[15px] items-start justify-start">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="bg-[#949191] text-white text-[14px] font-semibold px-3 py-[11px] rounded-md w-40 h-10 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-[#ff0150] text-white text-[14px] font-semibold px-3 py-[11px] rounded-md w-40 h-10 border border-[#ff0150] hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? loadingText : confirmLabel}
            </button>
          </div>
        </div>
    </Modal>
  )
}