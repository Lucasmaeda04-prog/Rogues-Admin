'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useShopItems } from '@/hooks'
import { api } from '@/lib/api'
import { CreateShopItemData } from '@/types'
import CreateShopItemModal, { ShopItemFormData } from '@/components/modals/CreateShopItemModal'
import { EditIcon, DeleteIcon } from '@/components/Icons'

export default function ShopTab() {
  const { items } = useShopItems()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<ShopItemFormData | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  const handleCreateItem = async (data: ShopItemFormData) => {
    setIsLoading(true)
    try {
      // Transform ShopItemFormData to CreateShopItemData
      const createData: CreateShopItemData = {
        name: data.name,
        description: data.description,
        image: data.image,
        price: data.price,
        tag: data.tag,
        categoryId: 1, // Default category, you may want to make this configurable
        available: true,
        quantity: data.quantity
      }

      console.log('Creating shop item:', createData)
      
      // Make API call to create shop item
      const response = await api.createShopItem(createData)
      
      console.log('Shop item created successfully:', response)
      
      handleCloseModal()
      
      // Optionally, you could refresh the items list here
      // window.location.reload() or call a refresh function
      
    } catch (error) {
      console.error('Error creating shop item:', error)
      // Optionally show an error message to the user
      alert('Error creating shop item: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditItem = (item: any) => {
    const editData: ShopItemFormData = {
      name: item.name,
      description: item.description || '',
      price: item.price,
      quantity: item.quantity,
      tag: item.tag || '',
      category: item.categoryName || '',
      image: item.image || ''
    }
    
    setEditingItem(editData)
    setModalMode('edit')
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
                      onClick={() => handleEditItem(item)}
                      className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                    >
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

      <CreateShopItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateItem}
        isLoading={isLoading}
        editData={editingItem}
        mode={modalMode}
      />
    </div>
  )
}