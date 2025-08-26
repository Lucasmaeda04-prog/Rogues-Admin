'use client'

import { useState } from 'react'
import { useBadges } from '@/hooks'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import Image from 'next/image'
import CreateBadgeModal, { BadgeFormData } from '@/components/modals/CreateBadgeModal'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'
import { useToast } from '@/components/ui/ToastProvider'

export default function BadgesTab() {
  const { badges, createBadge, updateBadge, deleteBadge } = useBadges()
  const { showSuccess, showError } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingBadge, setEditingBadge] = useState<BadgeFormData | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    badgeId?: string
    badgeName?: string
  }>({ isOpen: false })

  const handleSubmitBadge = async (data: BadgeFormData) => {
    console.log(`${modalMode === 'edit' ? 'Updating' : 'Creating'} badge with form data:`, data)
    setIsLoading(true)
    
    try {
      // Convert BadgeFormData to CreateBadgeData
      const badgeData = {
        title: data.title,
        description: data.description,
        goal: data.goal,
        image: data.image
      }

      console.log('Sending to API:', badgeData)
      
      let result
      if (modalMode === 'edit' && editingBadge) {
        // Find the badge ID from the current editing badge
        const badgeToEdit = badges.find(b => b.title === editingBadge.title)
        if (badgeToEdit) {
          result = await updateBadge(badgeToEdit.badgeId, badgeData)
        } else {
          throw new Error('Badge not found for editing')
        }
      } else {
        result = await createBadge(badgeData)
      }
      
      if (result.success) {
        console.log(`Badge ${modalMode === 'edit' ? 'updated' : 'created'} successfully`)
        showSuccess(
          `Badge ${modalMode === 'edit' ? 'atualizada' : 'criada'}!`,
          `Badge "${data.title}" foi ${modalMode === 'edit' ? 'atualizada' : 'criada'} com sucesso`
        )
        handleCloseModal()
      } else {
        console.error(`Error ${modalMode === 'edit' ? 'updating' : 'creating'} badge:`, result.error)
        showError(
          `Erro ao ${modalMode === 'edit' ? 'atualizar' : 'criar'} badge`,
          result.error
        )
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      showError(
        `Erro inesperado`,
        `Ocorreu um erro ao ${modalMode === 'edit' ? 'atualizar' : 'criar'} a badge`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditBadge = (badge: Record<string, unknown>) => {
    const editData: BadgeFormData = {
      title: badge.title as string,
      description: (badge.description as string) || '',
      goal: (badge.goal as string) || '',
      image: (badge.image as string) || ''
    }
    
    setEditingBadge(editData)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleDeleteClick = (badge: Record<string, unknown>) => {
    setDeleteModal({
      isOpen: true,
      badgeId: badge.badgeId as string,
      badgeName: badge.title as string
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.badgeId) return
    
    setIsLoading(true)
    
    try {
      const result = await deleteBadge(deleteModal.badgeId)
      if (result.success) {
        console.log('Badge deleted successfully')
        showSuccess(
          'Badge excluída!',
          `Badge "${deleteModal.badgeName}" foi excluída com sucesso`
        )
        setDeleteModal({ isOpen: false })
      } else {
        console.error('Error deleting badge:', result.error)
        showError(
          'Erro ao excluir badge',
          result.error
        )
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      showError(
        'Erro inesperado',
        'Ocorreu um erro ao excluir a badge'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false })
  }

  const handleOpenCreateModal = () => {
    setEditingBadge(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBadge(null)
    setModalMode('create')
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">All badges models</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>Action</option>
            </select>
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>Actions</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Create Badge
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unlocks</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Creation</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {badges.map((badge, index) => (
              <tr key={badge.badgeId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                <td className="px-4 py-3 text-sm">
                   <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {badge.image ? (
                          <Image
                            src={badge.image}
                            alt={badge.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs">🏆</span>
                        )}
                    </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{badge.title}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{badge.description || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{badge.goal || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">N/A</td>
                <td className="px-4 py-3 text-sm text-gray-900">{new Date(badge.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditBadge(badge as unknown as Record<string, unknown>)}
                      className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                    >
                      <EditIcon width={16} height={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(badge as unknown as Record<string, unknown>)}
                      className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                      title="Delete badge"
                    >
                      <DeleteIcon width={16} height={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Badge Modal */}
      <CreateBadgeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitBadge}
        isLoading={isLoading}
        editData={editingBadge}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Badge ?"
        itemName={deleteModal.badgeName}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isLoading}
        loadingText="Deleting badge..."
      />
    </div>
  )
}