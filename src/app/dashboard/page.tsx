'use client'

import { useState, useEffect } from 'react'

interface Admin {
  id: string
  name: string
  email: string
  role: string
  status: string
  dateCreated: string
}

interface Task {
  id: string
  name: string
  social: string
  description: string
  type: string
  reward: string
  deadline: string
  conclusion: number
  link: string
  dateCreation: string
  author: string
}

interface ShopItem {
  id: string
  image: string
  name: string
  description: string
  price: string
  sales: string
  dateCreation: string
}

interface Badge {
  id: string
  image: string
  name: string
  description: string
  price: string
  sales: string
  dateCreation: string
}

type ActiveTab = 'Admins' | 'Tasks' | 'Shop' | 'Badges'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('Admins')
  const [loading, setLoading] = useState(true)
  
  // Form data for admin
  const [adminForm, setAdminForm] = useState({
    adminName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  // Mock data
  const [admins, setAdmins] = useState<Admin[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setAdmins([
        { id: '#1', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
        { id: '#2', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
        { id: '#3', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
        { id: '#4', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
        { id: '#5', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
        { id: '#6', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
        { id: '#7', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
        { id: '#8', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
        { id: '#9', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
        { id: '#10', name: 'Connect Discord', email: 'Adminlogindgmail.com', role: 'Connect Discord', status: 'Active', dateCreated: '17/02/2024' },
      ])

      setTasks([
        { id: '#1', name: 'Connect Discord', social: 'Log in with Discord Online', description: 'Comment', type: '10 Carrots', reward: 'ONGOING', deadline: 'Openlink', conclusion: 15, link: '17/01/2025', dateCreation: 'ONGOING', author: 'Author Name' },
        { id: '#2', name: 'Connect Discord', social: 'Log in with Discord Online', description: 'Comment', type: '10 Carrots', reward: 'ONGOING', deadline: 'Openlink', conclusion: 15, link: '17/01/2025', dateCreation: 'ONGOING', author: 'Author Name' },
        { id: '#3', name: 'Connect Discord', social: 'Log in with Discord Online', description: 'Comment', type: '10 Carrots', reward: 'ONGOING', deadline: 'Openlink', conclusion: 15, link: '17/01/2025', dateCreation: 'ONGOING', author: 'Author Name' },
        { id: '#4', name: 'Connect Discord', social: 'Log in with Discord Online', description: 'Comment', type: '10 Carrots', reward: 'ONGOING', deadline: 'Openlink', conclusion: 15, link: '17/01/2025', dateCreation: 'ONGOING', author: 'Author Name' },
        { id: '#5', name: 'Connect Discord', social: 'Log in with Discord Online', description: 'Comment', type: '10 Carrots', reward: 'ONGOING', deadline: 'Openlink', conclusion: 15, link: '17/01/2025', dateCreation: 'ONGOING', author: 'Author Name' },
      ])

      setShopItems([
        { id: '#1', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
        { id: '#2', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
        { id: '#3', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
        { id: '#4', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
        { id: '#5', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
      ])

      setBadges([
        { id: '#1', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
        { id: '#2', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
        { id: '#3', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
        { id: '#4', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
        { id: '#5', image: '📦', name: 'Product', description: 'A very great and well described prod...', price: '15 Carrots', sales: '250,100 sales', dateCreation: '17/01/2025' },
      ])

      setLoading(false)
    }, 300)
  }, [])

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Admin form submitted:', adminForm)
    // Reset form
    setAdminForm({
      adminName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        {activeTab === 'Admins' && (
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
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{admin.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{admin.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{admin.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{admin.role}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{admin.dateCreated}</td>
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
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{task.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.name}</td>
                      <td className="px-4 py-3 text-sm text-blue-600">{task.social}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.description}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Comment
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.reward}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.conclusion}</td>
                      <td className="px-4 py-3 text-sm text-blue-600">{task.deadline}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.link}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{task.author}</td>
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
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          📦
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.price}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.sales}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.dateCreation}</td>
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
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{badge.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          📦
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{badge.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{badge.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{badge.price}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{badge.sales}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{badge.dateCreation}</td>
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