'use client'

import { useState } from 'react'
import { useAuth, useAdmins } from '@/hooks'
import GenericForm from '@/components/forms/GenericForm'
import { adminFormConfig, adminEditFormConfig } from '@/components/forms/form-configs'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import { useToast } from '@/components/ui/ToastProvider'

export default function AdminsTab() {
  const { user } = useAuth()
  const { admins, createAdmin, updateAdmin, deleteAdmin } = useAdmins()
  const { showSuccess, showError } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Record<string, unknown> | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    adminId?: string
    adminName?: string
  }>({ isOpen: false })

  const handleAdminSubmit = async (formData: Record<string, unknown>) => {
    if (formMode === 'create') {
      // Validate password confirmation for new admins
      if (formData.password !== formData.confirmPassword) {
        showError('Senhas não coincidem', 'As senhas digitadas não são iguais')
        return
      }

      setIsLoading(true)
      
      const result = await createAdmin({
        name: formData.adminName as string,
        email: formData.email as string,
        password: formData.password as string,
        isSuperAdmin: formData.isSuper as boolean
      })

      if (result.success) {
        showSuccess('Admin criado!', `Admin "${formData.adminName}" foi criado com sucesso`)
        handleResetForm()
      } else {
        showError('Erro ao criar admin', result.error)
      }
      
      setIsLoading(false)
    } else if (formMode === 'edit') {
      // Validate password confirmation for edit mode if password is being changed
      if (formData.password && formData.password !== formData.confirmPassword) {
        showError('Senhas não coincidem', 'As senhas digitadas não são iguais')
        return
      }

      setIsLoading(true)
      
      try {
        // Prepare update data - only include password if it's being changed
        const updateData: Record<string, unknown> = {
          name: formData.adminName as string,
          email: formData.email as string,
          isSuperAdmin: formData.isSuper as boolean
        }

        // Only include password if it's being changed (not empty)
        if (formData.password && (formData.password as string).trim() !== '') {
          updateData.password = formData.password as string
        }

        const result = await updateAdmin(editingAdmin?.adminId as string, updateData)
        
        if (result.success) {
          showSuccess('Admin atualizado!', `Admin "${formData.adminName}" foi atualizado com sucesso`)
          handleResetForm()
        } else {
          showError('Erro ao atualizar admin', result.error)
        }
      } catch (error) {
        showError('Erro inesperado', 'Ocorreu um erro ao atualizar o admin')
      }
      
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (adminId: string, adminName: string) => {
    setDeleteModal({
      isOpen: true,
      adminId,
      adminName
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.adminId) return
    
    setIsLoading(true)
    
    const result = await deleteAdmin(deleteModal.adminId)
    
    if (result.success) {
      showSuccess('Admin excluído!', `Admin "${deleteModal.adminName}" foi excluído com sucesso`)
      setDeleteModal({ isOpen: false })
    } else {
      showError('Erro ao excluir admin', result.error)
    }
    
    setIsLoading(false)
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false })
  }

  const handleEditClick = (admin: Record<string, unknown>) => {
    setEditingAdmin(admin)
    setFormMode('edit')
  }

  const handleResetForm = () => {
    setEditingAdmin(null)
    setFormMode('create')
  }

  const handleCancelEdit = () => {
    handleResetForm()
  }

  if (!user?.isSuper) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <div className="text-red-400 text-6xl mb-4">🚫</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only super admins can access this section.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-6 animate-fadeIn">
      {/* Left Side - Admin Form */}
      <div className="col-span-4">
        <GenericForm 
          config={formMode === 'edit' ? adminEditFormConfig : adminFormConfig}
          onSubmit={handleAdminSubmit}
          onCancel={formMode === 'edit' ? handleCancelEdit : undefined}
          isLoading={isLoading}
          initialData={editingAdmin ? {
            adminName: editingAdmin.name || '',
            email: editingAdmin.email || '',
            isSuper: editingAdmin.isSuperAdmin || false
          } : {}}
        />
      </div>

      {/* Right Side - Admin Table */}
      <div className="col-span-8">
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin, index) => (
                <tr key={admin.adminId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{admin.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{admin.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{admin.isSuperAdmin ? 'Super Admin' : 'Admin'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{new Date(admin.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditClick(admin as unknown as Record<string, unknown>)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors" 
                        title="Edit admin"
                      >
                        <EditIcon width={16} height={16} />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors" 
                        title="Delete admin"
                        onClick={() => handleDeleteClick(admin.adminId, admin.name || admin.email)}
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
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Admin ?"
        itemName={deleteModal.adminName}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isLoading}
        loadingText="Deleting admin..."
      />
    </div>
  )
}