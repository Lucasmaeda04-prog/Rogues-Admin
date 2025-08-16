'use client'

import { useState } from 'react'
import { useAuth, useAdmins } from '@/hooks'
import GenericForm from '@/components/forms/GenericForm'
import { adminFormConfig } from '@/components/forms/form-configs'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'

export default function AdminsTab() {
  const { user } = useAuth()
  const { admins, createAdmin, deleteAdmin } = useAdmins()
  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    adminId?: string
    adminName?: string
  }>({ isOpen: false })

  const handleAdminSubmit = async (formData: Record<string, any>) => {
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setIsLoading(true)
    
    const result = await createAdmin({
      name: formData.adminName,
      email: formData.email,
      password: formData.password,
      isSuperAdmin: formData.isSuper
    })

    if (result.success) {
      alert('Admin created successfully!')
    } else {
      alert(`Error creating admin: ${result.error}`)
    }
    
    setIsLoading(false)
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
      alert(`Admin "${deleteModal.adminName}" deleted successfully!`)
      setDeleteModal({ isOpen: false })
    } else {
      alert(`Error deleting admin: ${result.error}`)
    }
    
    setIsLoading(false)
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false })
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
          config={adminFormConfig}
          onSubmit={handleAdminSubmit}
          isLoading={isLoading}
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
                      <button className="text-blue-600 hover:text-blue-900" title="Edit admin">✏️</button>
                      <button 
                        className="text-red-600 hover:text-red-900" 
                        title="Delete admin"
                        onClick={() => handleDeleteClick(admin.adminId, admin.name || admin.email)}
                      >
                        🗑️
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