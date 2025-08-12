'use client'

import { useState, useEffect } from 'react'

interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  stock?: number
  status: 'available' | 'sold_out' | 'discontinued'
  createdAt: string
}

export default function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    status: 'available' as ShopItem['status']
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = () => {
    // Mock shop items data
    setTimeout(() => {
      setItems([
        {
          id: '1',
          name: 'Energy Boost',
          description: 'Increases your energy for 1 hour',
          price: 150,
          category: 'Power-ups',
          stock: 50,
          status: 'available',
          createdAt: '2024-01-10T10:00:00Z'
        },
        {
          id: '2',
          name: 'Premium Theme',
          description: 'Unlock exclusive visual themes',
          price: 500,
          category: 'Cosmetics',
          stock: 25,
          status: 'available',
          createdAt: '2024-01-12T15:30:00Z'
        },
        {
          id: '3',
          name: 'Coin Multiplier',
          description: 'Double your coin rewards for 24 hours',
          price: 300,
          category: 'Power-ups',
          stock: 0,
          status: 'sold_out',
          createdAt: '2024-01-08T09:15:00Z'
        }
      ])
      setLoading(false)
    }, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mock save - just add to list or update existing
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, id: editingItem.id }
          : item
      ))
    } else {
      const newItem: ShopItem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      setItems([...items, newItem])
    }
    
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this shop item?')) return

    // Mock delete - just remove from list
    setItems(items.filter(item => item.id !== id))
  }

  const handleEdit = (item: ShopItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      stock: item.stock || 0,
      status: item.status
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      status: 'available'
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shop Items Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#09171a] text-white px-4 py-2 rounded-lg hover:bg-[#0f1f23] transition-colors"
        >
          Add New Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Shop Item' : 'Create New Shop Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                  placeholder="e.g. Food, Accessories, Power-ups"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (coins)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ShopItem['status'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#09171a] text-white px-6 py-2 rounded-lg hover:bg-[#0f1f23] transition-colors"
              >
                {editingItem ? 'Update' : 'Create'} Item
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shop items yet</h3>
            <p className="text-gray-600">Create your first shop item to get started.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-4xl">📦</div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    item.status === 'available' ? 'bg-green-100 text-green-800' :
                    item.status === 'sold_out' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-[#09171a]">{item.price} coins</span>
                  <span className="text-sm text-gray-500">Category: {item.category}</span>
                </div>
                
                {item.stock !== undefined && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">Stock: {item.stock}</span>
                    <span className="text-sm text-gray-500">
                      Added: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}