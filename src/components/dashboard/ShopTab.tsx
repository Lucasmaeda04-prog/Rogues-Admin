'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ArrowUpDown, Eye } from 'lucide-react'
import { useShopItems, useShopCategories } from '@/hooks'
import { api } from '@/lib/api'
import { CreateShopItemData, ShopItem } from '@/types'
import CreateShopItemModal, { ShopItemFormData } from '@/components/modals/CreateShopItemModal'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import { useToast } from '@/components/ui/ToastProvider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ShopTab() {
  const { items, updateItem, deleteItem, refreshItems } = useShopItems()
  const { categories } = useShopCategories()
  const { showSuccess, showError } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [editingItem, setEditingItem] = useState<ShopItemFormData | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    itemId?: string
    itemName?: string
  }>({ isOpen: false })
  
  // Filters and sorting state
  const [filters, setFilters] = useState({
    category: 'all',
    availability: 'all',
    dateFrom: '',
    dateTo: ''
  })
  
  const [sorting, setSorting] = useState({
    field: 'createdAt',
    order: 'desc' as 'asc' | 'desc'
  })

  const shopifyItems = useMemo<ShopItem[]>(() => items.filter(item => item.tag === 'shopify'), [items])
  const discordItems = useMemo<ShopItem[]>(() => items.filter(item => item.tag !== 'shopify'), [items])

  const sortItems = useCallback((list: ShopItem[]) => {
    return [...list].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sorting.field) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'roleName':
          aValue = (a.roleName || '').toLowerCase()
          bValue = (b.roleName || '').toLowerCase()
          break
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'quantity':
          aValue = a.quantity
          bValue = b.quantity
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sorting.order === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })
  }, [sorting])

  const handleSubmitItem = async (data: ShopItemFormData) => {
    if (modalMode === 'view') {
      handleCloseModal()
      return
    }
    setIsLoading(true)
    try {
      if (modalMode === 'create') {
        // Transform ShopItemFormData to CreateShopItemData
        const trimmedRoleName = data.roleName?.trim() || ''
        const createData: CreateShopItemData = {
          name: data.name,
          description: data.description,
          image: data.image,
          price: data.price,
          tag: data.tag,
          categoryId: Number(data.categoryId) || 1,
          available: true,
          quantity: data.quantity,
          requiredBadgeId: data.requiredBadgeId && data.requiredBadgeId.length > 0 ? data.requiredBadgeId : undefined,
          roleName: trimmedRoleName.length > 0 ? trimmedRoleName : undefined
        }

        console.log('Creating shop item:', createData)
        
        // Make API call to create shop item
        const response = await api.createShopItem(createData)
        
        console.log('Shop item created successfully:', response)
        showSuccess(
          'Item created!',
          `Shop item "${data.name}" was created successfully.`
        )
        handleCloseModal()
      } else if (modalMode === 'edit') {
        // Find the item being edited
        const itemToEdit = items.find(item => item.name === editingItem?.name)
        if (!itemToEdit) {
          showError('Item not found', 'We could not locate this item for editing.')
          return
        }

        const trimmedRoleName = data.roleName?.trim() || ''
        const updateData = {
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.image,
          categoryId: Number(data.categoryId) || 1,
          requiredBadgeId: data.requiredBadgeId && data.requiredBadgeId.length > 0 ? data.requiredBadgeId : null,
          roleName: trimmedRoleName.length > 0 ? trimmedRoleName : null
        }

        console.log('Updating shop item:', updateData)
        
        const result = await updateItem(itemToEdit.shopItemId, updateData)
        
        if (result.success) {
          showSuccess(
            'Item updated!',
            `Shop item "${data.name}" was updated successfully.`
          )
          handleCloseModal()
        } else {
          showError('Failed to update item', result.error)
        }
      }
    } catch (error) {
      console.error('Error with shop item:', error)
      showError(
        'Unexpected error',
        `An error occurred while ${modalMode === 'edit' ? 'updating' : 'creating'} the shop item.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const mapShopItemToFormData = useCallback((item: ShopItem): ShopItemFormData => ({
    name: item.name,
    description: item.description || '',
    price: item.price,
    quantity: item.quantity,
    tag: item.tag || '',
    categoryId: item.categoryId || 1,
    image: item.image || '',
    requiredBadgeId: item.requiredBadgeId || '',
    roleName: item.roleName || ''
  }), [])

  const handleEditItem = (item: Record<string, unknown>) => {
    const editData = mapShopItemToFormData(item as unknown as ShopItem)

    setEditingItem(editData)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleDeleteClick = (item: Record<string, unknown>) => {
    setDeleteModal({
      isOpen: true,
      itemId: item.shopItemId as string,
      itemName: item.name as string
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.itemId) return
    
    setIsLoading(true)
    
    try {
      const result = await deleteItem(deleteModal.itemId)
      if (result.success) {
        showSuccess(
          'Item deleted!',
          `Shop item "${deleteModal.itemName}" was deleted successfully.`
        )
        setDeleteModal({ isOpen: false })
      } else {
        showError('Failed to delete item', result.error)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      showError('Unexpected error', 'An error occurred while deleting the item.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false })
  }

  const handleViewShopifyItem = (item: ShopItem) => {
    const viewData = mapShopItemToFormData(item)
    setEditingItem(viewData)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleOpenCreateModal = () => {
    setEditingItem(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setModalMode('create')
  }

  // Shopify sync: on mount and on demand
  const runShopifySync = async () => {
    try {
      setIsSyncing(true)
      const result = await api.syncShopify()
      showSuccess('Shopify sync completed', `Created: ${result.created}, Updated: ${result.updated}, Skipped: ${result.skipped}`)
      await refreshItems()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sync with Shopify.'
      showError('Sync error', msg)
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    // Run sync on first render
    runShopifySync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const discordCategoryIds = new Set(discordItems.map(item => item.categoryId))
    const categoryOptions = categories
      .filter(cat => discordCategoryIds.size === 0 || discordCategoryIds.has(cat.shopItemCategoryId))
      .map(cat => ({
        value: cat.shopItemCategoryId.toString(),
        label: cat.name
      }))

    return {
      categories: categoryOptions
    }
  }, [categories, discordItems])

  const sortedShopifyItems = useMemo(() => sortItems(shopifyItems), [shopifyItems, sortItems])

  // Filter and sort discord-only items
  const filteredAndSortedDiscordItems = useMemo(() => {
    const filtered = discordItems.filter(item => {
      const createdDate = new Date(item.createdAt)
      
      const categoryMatch = filters.category === 'all' || item.categoryId.toString() === filters.category
      const availabilityMatch = filters.availability === 'all' || 
        (filters.availability === 'available' && item.available) ||
        (filters.availability === 'unavailable' && !item.available)
      
      // Date filters
      const dateFromMatch = !filters.dateFrom || createdDate >= new Date(filters.dateFrom)
      const dateToMatch = !filters.dateTo || createdDate <= new Date(filters.dateTo + 'T23:59:59')
      
      return categoryMatch && availabilityMatch && dateFromMatch && dateToMatch
    })
    return sortItems(filtered)
  }, [discordItems, filters, sortItems])

  const filtersApplied = filters.category !== 'all' || filters.availability !== 'all' || filters.dateFrom !== '' || filters.dateTo !== ''

  const discordCountLabel = useMemo(() => {
    if (discordItems.length === 0) {
      return '0'
    }
    if (discordItems.length === filteredAndSortedDiscordItems.length) {
      return `${filteredAndSortedDiscordItems.length}`
    }
    return `${filteredAndSortedDiscordItems.length} / ${discordItems.length}`
  }, [discordItems.length, filteredAndSortedDiscordItems.length])

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      category: 'all',
      availability: 'all',
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

  return (
    <div className="space-y-10 animate-fadeIn">
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Shopify Catalog ({sortedShopifyItems.length})
            </h2>
            <p className="text-sm text-gray-500">
              Items imported automatically from the Shopify sync.
            </p>
          </div>
          <Button
            onClick={runShopifySync}
            disabled={isSyncing}
            variant="outline"
            className="shadow-md rounded-xl font-light hover:shadow-lg transition-all border-blue-200 text-blue-700 hover:text-blue-900 hover:bg-blue-50"
          >
            {isSyncing ? 'Syncing Shopify...' : 'Sync Shopify'}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('name')}>
                    Name {getSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('roleName')}>
                    Role {getSortIcon('roleName')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('price')}>
                    Price {getSortIcon('price')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('quantity')}>
                    Stock {getSortIcon('quantity')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('createdAt')}>
                    Created {getSortIcon('createdAt')}
                  </Button>
                </TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedShopifyItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                    No Shopify items yet. Use Sync Shopify to import the catalog.
                  </TableCell>
                </TableRow>
              ) : (
                sortedShopifyItems.map((item, index) => (
                  <TableRow key={item.shopItemId}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">📦</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description || 'N/A'}</TableCell>
                    <TableCell>{item.roleName || '—'}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.quantity} units
                      </span>
                    </TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewShopifyItem(item)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="View item"
                      >
                        <Eye width={16} height={16} />
                      </button>
                    </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Discord Roles ({discordCountLabel})
            </h2>
            <p className="text-sm text-gray-500">
              Items without the <span className="font-medium">shopify</span> tag represent Discord-only roles and benefits.
            </p>
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
            + Create Item
          </Button>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Use this table to manage benefits and roles for Discord. Shopify items appear in the catalog above and are automatically refreshed by the sync.
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="w-[180px] shadow-md rounded-xl font-light hover:shadow-lg transition-shadow" style={{borderColor: 'rgba(148, 145, 145, 1)'}}>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {filterOptions.categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
            <SelectTrigger className="w-[140px] shadow-md rounded-xl font-light hover:shadow-lg transition-shadow" style={{borderColor: 'rgba(148, 145, 145, 1)'}}>
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>

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

          {filtersApplied && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 shadow-md rounded-xl font-light hover:shadow-lg transition-all"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('name')}>
                    Name {getSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('price')}>
                    Price {getSortIcon('price')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('quantity')}>
                    Stock {getSortIcon('quantity')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('createdAt')}>
                    Created {getSortIcon('createdAt')}
                  </Button>
                </TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDiscordItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                    {discordItems.length === 0 ? 'No Discord-only items have been created yet.' : 'No items match the current filters.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedDiscordItems.map((item, index) => (
                  <TableRow key={item.shopItemId}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">📦</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description || 'N/A'}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.quantity} units
                      </span>
                    </TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditItem(item as unknown as Record<string, unknown>)}
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title="Edit item"
                        >
                          <EditIcon width={16} height={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item as unknown as Record<string, unknown>)}
                          className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                          title="Delete item"
                        >
                          <DeleteIcon width={16} height={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <CreateShopItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitItem}
        isLoading={isLoading}
        editData={editingItem}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Shop Item?"
        itemName={deleteModal.itemName}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isLoading}
        loadingText="Deleting item..."
      />
    </div>
  )
}
