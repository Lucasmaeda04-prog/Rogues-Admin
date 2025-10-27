'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown, ClipboardCopy } from 'lucide-react'
import { useBadges } from '@/hooks'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import Image from 'next/image'
import CreateBadgeModal, { BadgeFormData } from '@/components/modals/CreateBadgeModal'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'
import { useToast } from '@/components/ui/ToastProvider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// Select components not used in badges, only date filters
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  
  // Filters and sorting state
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: ''
  })
  
  const [sorting, setSorting] = useState({
    field: 'createdAt',
    order: 'desc' as 'asc' | 'desc'
  })

  const handleSubmitBadge = async (data: BadgeFormData) => {
    console.log(`${modalMode === 'edit' ? 'Updating' : 'Creating'} badge with form data:`, data)
    setIsLoading(true)
    
    try {
      // Convert BadgeFormData to CreateBadgeData
      const badgeData = {
        title: data.title,
        description: data.description,
        goal: data.goal,
        image: data.image,
        roleName: data.roleName
      }

      console.log('Sending to API:', badgeData)
      
      let result
      if (modalMode === 'edit' && editingBadge) {
        if (editingBadge.badgeId) {
          result = await updateBadge(editingBadge.badgeId, badgeData)
        } else {
          throw new Error('Badge ID missing for editing')
        }
      } else {
        result = await createBadge(badgeData)
      }
      
      if (result.success) {
        console.log(`Badge ${modalMode === 'edit' ? 'updated' : 'created'} successfully`)
        showSuccess(
          `Badge ${modalMode === 'edit' ? 'updated' : 'created'}!`,
          `Badge "${data.title}" was ${modalMode === 'edit' ? 'updated' : 'created'} successfully`
        )
        handleCloseModal()
      } else {
        console.error(`Error ${modalMode === 'edit' ? 'updating' : 'creating'} badge:`, result.error)
        showError(
          `Error ${modalMode === 'edit' ? 'updating' : 'creating'} badge`,
          result.error
        )
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      showError(
        `Unexpected error`,
        `An error occurred while ${modalMode === 'edit' ? 'updating' : 'creating'} the badge`
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
      image: (badge.image as string) || '',
      roleName: (badge.roleName as string) || '',
      badgeId: badge.badgeId as string
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

  const handleCopyBadgeId = async (badgeId: string) => {
    try {
      await navigator.clipboard.writeText(badgeId)
      showSuccess('Badge ID copied!', 'The badge ID was copied to clipboard.')
    } catch (error) {
      console.error('Error copying badge ID:', error)
      showError('Error copying ID', 'Failed to copy badge ID. Please try again.')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.badgeId) return
    
    setIsLoading(true)
    
    try {
      const result = await deleteBadge(deleteModal.badgeId)
      if (result.success) {
        console.log('Badge deleted successfully')
        showSuccess(
          'Badge deleted!',
          `Badge "${deleteModal.badgeName}" was deleted successfully`
        )
        setDeleteModal({ isOpen: false })
      } else {
        console.error('Error deleting badge:', result.error)
        showError(
          'Error deleting badge',
          result.error
        )
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      showError(
        'Unexpected error',
        'An error occurred while deleting the badge'
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

  // Filter and sort badges
  const filteredAndSortedBadges = useMemo(() => {
    const filtered = badges.filter(badge => {
      const createdDate = new Date(badge.createdAt)
      
      // Date filters
      const dateFromMatch = !filters.dateFrom || createdDate >= new Date(filters.dateFrom)
      const dateToMatch = !filters.dateTo || createdDate <= new Date(filters.dateTo + 'T23:59:59')
      
      return dateFromMatch && dateToMatch
    })
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number
      
      switch (sorting.field) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'unlocks':
          // Mock unlock count - in real implementation this would come from backend
          aValue = Math.floor(Math.random() * 100) // Random number for demo
          bValue = Math.floor(Math.random() * 100)
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          aValue = a.createdAt
          bValue = b.createdAt
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      return sorting.order === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })
  }, [badges, filters, sorting])

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: ''
    })
  }
  
  const handleSortChange = (field: string) => {
    setSorting(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  const getSortIcon = (field: string) => {
    if (sorting.field !== field) return <ArrowUpDown className="w-4 h-4 opacity-50" />
    return <ArrowUpDown className={`w-4 h-4 ${sorting.order === 'asc' ? 'rotate-180' : ''}`} />
  }
  
  // Mock function to get unlock count - in real app this would come from backend
  const getUnlockCount = (badgeId: string) => {
    // Generate consistent mock number based on badge ID
    const seed = badgeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return Math.floor((seed % 100) + 1) // Consistent number between 1-100
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All badges models ({filteredAndSortedBadges.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            <Input
              type="date"
              placeholder="From date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-[150px] shadow-md rounded-xl font-light hover:shadow-lg transition-shadow"
              style={{borderColor: 'rgba(148, 145, 145, 1)'}}
            />
            
            <Input
              type="date"
              placeholder="To date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-[150px] shadow-md rounded-xl font-light hover:shadow-lg transition-shadow"
              style={{borderColor: 'rgba(148, 145, 145, 1)'}}
            />
            
            {(filters.dateFrom || filters.dateTo) && (
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 shadow-md rounded-xl font-light hover:shadow-lg transition-all"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        <Button 
          onClick={handleOpenCreateModal} 
          className="shadow-md rounded-xl font-semibold hover:shadow-lg transition-all"
          style={{
            backgroundColor: '#1e40af',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1e3a8a'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1e40af'
            e.currentTarget.style.color = 'white'
          }}
        >
          + Create Badge
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('title')}>
                  Title {getSortIcon('title')}
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('unlocks')}>
                  Unlocks {getSortIcon('unlocks')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('createdAt')}>
                  Created {getSortIcon('createdAt')}
                </Button>
              </TableHead>
                  <TableHead className="w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedBadges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  {badges.length === 0 ? 'No badges found' : 'No badges match the current filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedBadges.map((badge, index) => {
                const unlockCount = getUnlockCount(badge.badgeId)
                
                return (
                  <TableRow key={badge.badgeId}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {badge.image ? (
                          (() => {
                            const src = badge.image || ''
                            // Use Next Image for all cases (GIFs included) to satisfy linting
                            return (
                              <Image
                                src={src}
                                alt={badge.title}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                unoptimized
                                onError={(e) => {
                                  const target = e.currentTarget
                                  target.style.display = 'none'
                                  const fallback = target.nextElementSibling
                                  if (fallback) fallback.classList.remove('hidden')
                                }}
                              />
                            )
                          })()
                        ) : null}
                        <span className={`text-xs ${badge.image ? 'hidden' : ''}`}>🏆</span>
                      </div>
                    </TableCell>
                    <TableCell>{badge.title}</TableCell>
                    <TableCell>{badge.description || 'N/A'}</TableCell>
                    <TableCell>{badge.goal || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {unlockCount} unlocks
                      </span>
                    </TableCell>
                    <TableCell>{new Date(badge.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCopyBadgeId(badge.badgeId)}
                          className="p-1 text-slate-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title="Copy badge ID"
                        >
                          <ClipboardCopy className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditBadge(badge as unknown as Record<string, unknown>)}
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title="Edit badge"
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
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
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
