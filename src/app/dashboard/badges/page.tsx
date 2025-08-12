'use client'

import { useState, useEffect } from 'react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requirement: string
  isActive: boolean
  unlockedCount?: number
  createdAt: string
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🏆',
    rarity: 'common' as Badge['rarity'],
    requirement: '',
    isActive: true
  })

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = () => {
    // Mock badges data
    setTimeout(() => {
      setBadges([
        {
          id: '1',
          name: 'First Steps',
          description: 'Complete your first task',
          icon: '🏆',
          rarity: 'common',
          requirement: 'Complete 1 task',
          isActive: true,
          unlockedCount: 89,
          createdAt: '2024-01-05T10:00:00Z'
        },
        {
          id: '2',
          name: 'Shopping Spree',
          description: 'Make 10 purchases in the shop',
          icon: '🛍️',
          rarity: 'rare',
          requirement: 'Make 10 purchases',
          isActive: true,
          unlockedCount: 23,
          createdAt: '2024-01-08T14:30:00Z'
        },
        {
          id: '3',
          name: 'Master Achiever',
          description: 'Unlock all other badges',
          icon: '👑',
          rarity: 'legendary',
          requirement: 'Unlock all badges',
          isActive: true,
          unlockedCount: 2,
          createdAt: '2024-01-15T09:15:00Z'
        }
      ])
      setLoading(false)
    }, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mock save - just add to list or update existing
    if (editingBadge) {
      setBadges(badges.map(badge => 
        badge.id === editingBadge.id 
          ? { ...badge, ...formData, id: editingBadge.id }
          : badge
      ))
    } else {
      const newBadge: Badge = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        unlockedCount: 0
      }
      setBadges([...badges, newBadge])
    }
    
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this badge?')) return

    // Mock delete - just remove from list
    setBadges(badges.filter(badge => badge.id !== id))
  }

  const handleEdit = (badge: Badge) => {
    setEditingBadge(badge)
    setFormData({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      rarity: badge.rarity,
      requirement: badge.requirement,
      isActive: badge.isActive
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingBadge(null)
    setFormData({
      name: '',
      description: '',
      icon: '🏆',
      rarity: 'common',
      requirement: '',
      isActive: true
    })
  }

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800'
      case 'rare': return 'bg-blue-100 text-blue-800'
      case 'epic': return 'bg-purple-100 text-purple-800'
      case 'legendary': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const emojiOptions = ['🏆', '🥇', '🎖️', '⭐', '💎', '🏅', '👑', '🎯', '🔥', '⚡', '🌟', '🎊']

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Badges Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#09171a] text-white px-4 py-2 rounded-lg hover:bg-[#0f1f23] transition-colors"
        >
          Add New Badge
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingBadge ? 'Edit Badge' : 'Create New Badge'}
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
                  Icon
                </label>
                <div className="flex gap-2 mb-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`p-2 rounded border text-xl ${
                        formData.icon === emoji ? 'border-[#88e1ff] bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                  placeholder="Or enter custom emoji/text"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirement (How to unlock this badge)
              </label>
              <input
                type="text"
                value={formData.requirement}
                onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                placeholder="e.g. Complete 10 daily tasks, Spend 1000 coins, etc."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rarity
                </label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value as Badge['rarity'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                >
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88e1ff] focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#09171a] text-white px-6 py-2 rounded-lg hover:bg-[#0f1f23] transition-colors"
              >
                {editingBadge ? 'Update' : 'Create'} Badge
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
        {badges.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No badges yet</h3>
            <p className="text-gray-600">Create your first badge to get started.</p>
          </div>
        ) : (
          badges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-6xl mb-4">{badge.icon}</div>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{badge.name}</h3>
                <div className="flex justify-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    badge.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {badge.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{badge.description}</p>
                <p className="text-gray-500 text-xs mb-3">
                  <strong>Requirement:</strong> {badge.requirement}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
                {badge.unlockedCount !== undefined && (
                  <span>Unlocked: {badge.unlockedCount} times</span>
                )}
                <span>Created: {new Date(badge.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(badge)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(badge.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}