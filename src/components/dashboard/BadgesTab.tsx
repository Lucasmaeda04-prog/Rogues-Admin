'use client'

import { useState } from 'react'
import { useBadges } from '@/hooks'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import Image from 'next/image'
import CreateBadgeModal, { BadgeFormData } from '@/components/modals/CreateBadgeModal'

export default function BadgesTab() {
  const { badges } = useBadges()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateBadge = async (data: BadgeFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implement badge creation API call
      console.log('Creating badge:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsCreateModalOpen(false)
      // TODO: Refresh badges list or add optimistic update
    } catch (error) {
      console.error('Error creating badge:', error)
    } finally {
      setIsLoading(false)
    }
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
          onClick={() => setIsCreateModalOpen(true)}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
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
                            alt={badge.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs">🏆</span>
                        )}
                    </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{badge.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{badge.description || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{badge.title}</td>
                <td className="px-4 py-3 text-sm text-gray-900">N/A</td>
                <td className="px-4 py-3 text-sm text-gray-900">{new Date(badge.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors">
                      <EditIcon width={16} height={16} />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors">
                      <DeleteIcon width={16} height={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Badge Modal */}
      <CreateBadgeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBadge}
        isLoading={isLoading}
      />
    </div>
  )
}