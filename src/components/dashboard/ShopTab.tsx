'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useShopItems } from '@/hooks'
import { api } from '@/lib/api'
import { CreateShopItemData } from '@/types'
import CreateShopItemModal, { ShopItemFormData } from '@/components/modals/CreateShopItemModal'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import { useToast } from '@/components/ui/ToastProvider'

export default function ShopTab() {
  const { items, updateItem, deleteItem } = useShopItems()
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

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">All shop models</h2>
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
          + Create Item
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Creation</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={item.shopItemId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                <td className="px-4 py-3 text-sm">
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
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.description || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">${item.price}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.quantity} units</td>
                <td className="px-4 py-3 text-sm text-gray-900">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditItem(item as unknown as Record<string, unknown>)}
                      className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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