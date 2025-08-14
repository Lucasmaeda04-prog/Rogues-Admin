'use client'

import { useState, useEffect } from 'react'
import { useAuth, useAdmins, useTasks, useShopItems, useBadges } from '@/hooks'
import type { Admin, Task, ShopItem, Badge, CreateAdminData } from '@/types'

type ActiveTab = 'Admins' | 'Tasks' | 'Shop' | 'Badges'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('Admins')
  const { user } = useAuth()
  const { admins: realAdmins, createAdmin } = useAdmins()
  const { tasks: realTasks } = useTasks()
  const { items: realItems } = useShopItems()
  const { badges: realBadges } = useBadges()
  
  // Form data for admin
  const [adminForm, setAdminForm] = useState({
    adminName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (adminForm.password !== adminForm.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const result = await createAdmin({
      name: adminForm.adminName,
      email: adminForm.email,
      password: adminForm.password,
      isSuperAdmin: false
    })

    if (result.success) {
      alert('Admin created successfully!')
      setAdminForm({
        adminName: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
    } else {
      alert(`Error creating admin: ${result.error}`)
    }
  }

  // Usar diretamente os dados da API sem conversão desnecessária
  const admins: Admin[] = realAdmins
  const tasks: Task[] = realTasks  
  const shopItems: ShopItem[] = realItems
  const badges: Badge[] = realBadges

  return (
    <div className="min-h-screen bg-gray-50">
      <h1>{user?.name || user?.email || 'Admin'}</h1>
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {(['Admins', 'Tasks', 'Shop', 'Badges'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'Admins' && user?.isSuper && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Side - Admin Form */}
            <div className="col-span-4">
              <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Save Admin</h2>
                
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Name *
                    </label>
                    <input
                      type="text"
                      value={adminForm.adminName}
                      onChange={(e) => setAdminForm({ ...adminForm, adminName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter admin name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter admin email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      value={adminForm.confirmPassword}
                      onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>

                  <div className="pt-4 space-y-2">
                    <p className="text-sm text-gray-600">Password must contain:</p>
                    <ul className="text-sm text-gray-500 space-y-1 ml-4">
                      <li>• At least 8 characters</li>
                      <li>• At least one number</li>
                      <li>• At least one special character</li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setAdminForm({
                        adminName: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                      })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
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
                            <button className="text-blue-600 hover:text-blue-900">✏️</button>
                            <button className="text-red-600 hover:text-red-900">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Admins' && !user?.isSuper && (
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">🚫</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">Only super admins can access this section.</p>
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">All tasks models</h2>
                <div className="flex space-x-2">
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option>Action</option>
                  </select>
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option>Actions</option>
                  </select>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                + Create Task
              </button>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Social</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conclusion</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Creation</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task, index) => (
                    <tr key={task.taskId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.name}</td>
                      <td className="px-4 py-3 text-sm text-blue-600">{task.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.description || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {task.isDaily ? 'Daily' : 'One-time'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.points} Points</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(task.deadline).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task._count.taskCompletions}</td>
                      <td className="px-4 py-3 text-sm text-blue-600">{task.link || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.admin.name || task.admin.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">✏️</button>
                          <button className="text-red-600 hover:text-red-900">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Shop' && (
          <div>
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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
                  {shopItems.map((item, index) => (
                    <tr key={item.shopItemId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          {item.image || '📦'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${item.price}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity} units</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">✏️</button>
                          <button className="text-red-600 hover:text-red-900">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Badges' && (
          <div>
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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
                  {badges.map((badge, index) => (
                    <tr key={badge.badgeId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          {badge.image || '🏆'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{badge.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{badge.description || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{badge.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">N/A</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(badge.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">✏️</button>
                          <button className="text-red-600 hover:text-red-900">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}