'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ArrowUpDown } from 'lucide-react'
import { useShopItems, useShopCategories } from '@/hooks'
import { api } from '@/lib/api'
import { CreateShopItemData } from '@/types'
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
  const { items, updateItem, deleteItem } = useShopItems()
  const { categories } = useShopCategories()
  const { showSuccess, showError } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<ShopItemFormData | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
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

  const handleSubmitItem = async (data: ShopItemFormData) => {
    setIsLoading(true)
    try {
      if (modalMode === 'create') {
        // Transform ShopItemFormData to CreateShopItemData
        const createData: CreateShopItemData = {
          name: data.name,
          description: data.description,
          image: data.image,
          price: data.price,
          tag: data.tag,
          categoryId: Number(data.categoryId) || 1,
          available: true,
          quantity: data.quantity
        }

        console.log('Creating shop item:', createData)
        
        // Make API call to create shop item
        const response = await api.createShopItem(createData)
        
        console.log('Shop item created successfully:', response)
        showSuccess(
          'Item criado!',
          `Item da loja "${data.name}" foi criado com sucesso`
        )
        handleCloseModal()
      } else if (modalMode === 'edit') {
        // Find the item being edited
        const itemToEdit = items.find(item => item.name === editingItem?.name)
        if (!itemToEdit) {
          showError('Item não encontrado', 'Não foi possível localizar o item para edição')
          return
        }

        const updateData = {
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.image,
          categoryId: Number(data.categoryId) || 1
        }

        console.log('Updating shop item:', updateData)
        
        const result = await updateItem(itemToEdit.shopItemId, updateData)
        
        if (result.success) {
          showSuccess(
            'Item atualizado!',
            `Item da loja "${data.name}" foi atualizado com sucesso`
          )
          handleCloseModal()
        } else {
          showError('Erro ao atualizar item', result.error)
        }
      }
    } catch (error) {
      console.error('Error with shop item:', error)
      showError(
        'Erro inesperado',
        `Ocorreu um erro ao ${modalMode === 'edit' ? 'atualizar' : 'criar'} o item da loja`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditItem = (item: Record<string, unknown>) => {
    const editData: ShopItemFormData = {
      name: item.name as string,
      description: (item.description as string) || '',
      price: item.price as number,
      quantity: item.quantity as number,
      tag: (item.tag as string) || '',
      categoryId: (item.categoryId as number) || 1,
      image: (item.image as string) || ''
    }
    
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
          'Item excluído!',
          `Item da loja "${deleteModal.itemName}" foi excluído com sucesso`
        )
        setDeleteModal({ isOpen: false })
      } else {
        showError('Erro ao excluir item', result.error)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      showError('Erro inesperado', 'Ocorreu um erro ao excluir o item')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false })
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
  
  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const categoryOptions = categories.map(cat => ({
      value: cat.shopItemCategoryId.toString(),
      label: cat.name
    }))
    
    return {
      categories: categoryOptions
    }
  }, [categories])

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter(item => {
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
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number
      
      switch (sorting.field) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
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
  }, [items, filters, sorting])

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
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All shop models ({filteredAndSortedItems.length})
          </h2>
          <div className="flex flex-wrap gap-2">
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
            
            {(filters.category !== 'all' || filters.availability !== 'all' || filters.dateFrom || filters.dateTo) && (
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
          + Create Item
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
            {filteredAndSortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  {items.length === 0 ? 'No items found' : 'No items match the current filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedItems.map((item, index) => (
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
        title="Delete Shop Item ?"
        itemName={deleteModal.itemName}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isLoading}
        loadingText="Deleting item..."
      />
    </div>
  )
}