'use client'

import { useState, useEffect } from 'react'

interface Admin {
  id: string
  email: string
  name?: string
  role: 'admin' | 'super_admin'
  isActive: boolean
  lastLogin?: string
  createdAt: string
  createdBy?: string
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [currentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    }
    return null
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Check if current user is super admin
    if (currentUser?.role !== 'super_admin') {
      window.location.href = '/dashboard/tasks'
      return
    }
    
    fetchAdmins()
  }, [currentUser])

  const fetchAdmins = () => {
    // Mock admins data
    setTimeout(() => {
      setAdmins([
        {
          id: '1',
          email: 'admin@rogues.com',  
          name: 'John Admin',
          role: 'super_admin',
          isActive: true,
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          email: 'manager@rogues.com',
          name: 'Jane Manager',
          role: 'admin',
          isActive: true,
          lastLogin: '2024-01-14T15:45:00Z',
          createdAt: '2024-01-03T14:20:00Z'
        },
        {
          id: '3',
          email: 'support@rogues.com',
          name: 'Mike Support',
          role: 'admin',
          isActive: false,
          createdAt: '2024-01-10T09:15:00Z'
        }
      ])
      setLoading(false)
    }, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    // Mock save - just add to list or update existing
    if (editingAdmin) {
      setAdmins(admins.map(admin => 
        admin.id === editingAdmin.id 
          ? { ...admin, name: formData.name, email: formData.email }
          : admin
      ))
    } else {
      const newAdmin: Admin = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString()
      }
      setAdmins([...admins, newAdmin])
    }
    
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete yourself!')
      return
    }

    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return

    // Mock delete - just remove from list
    setAdmins(admins.filter(admin => admin.id !== id))
  }

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name || '',
      email: admin.email,
      password: '',
      confirmPassword: ''
    })
  }

  const resetForm = () => {
    setEditingAdmin(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-6xl mb-4">🚫</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only super admins can access this page.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-16 bg-gray-100"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 border-b border-gray-200"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Header */}
      <div className="relative pt-0 pb-0">
        <div className="flex items-end gap-10">
          <div className="relative">
            <h1 className="text-[36px] font-semibold text-[#020202] leading-none mb-[45px]">Admins</h1>
            <div className="absolute bottom-0 left-0 h-[5px] w-[144px] bg-gradient-to-r from-[#015697] to-[#009db3]"></div>
          </div>
          <div className="text-[24px] text-[#949191] leading-none mb-[45px]">Tasks</div>
          <div className="text-[24px] text-[#949191] leading-none mb-[45px]">Shop</div>
        </div>
        <div className="absolute bottom-0 left-[1.412px] right-0 h-px bg-[#d9d9d9] w-[1300.59px]"></div>
      </div>

      {/* Main Content */}
      <div className="flex gap-32 pt-5">
        {/* Admin Form Card */}
        <div className="bg-white rounded-[22px] border-[3px] border-[#efefef] p-6 w-[502px]">
          <div className="mb-4">
            <h2 className="text-[28px] font-semibold text-[#020202] mb-1">Save Admin</h2>
            <p className="text-[14px] text-[#949191]">Fill the inputs bellow</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <label className="block text-[18px] font-medium text-[#4b4b4b]">
                Admin Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-[47px] px-3.5 bg-[#f9f9f9] border-[1.3px] border-[#dbdbdb] rounded-[10px] text-[14px] text-[#020202] placeholder-[#949191] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[18px] font-medium text-[#4b4b4b]">
                Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-[47px] px-3.5 bg-[#f9f9f9] border-[1.3px] border-[#dbdbdb] rounded-[10px] text-[14px] text-[#020202] placeholder-[#949191] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@domain.com"
                  required
                  disabled={!!editingAdmin}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[18px] font-medium text-[#4b4b4b]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-[47px] px-3.5 bg-[#f9f9f9] border-[1.3px] border-[#dbdbdb] rounded-[10px] text-[14px] text-[#020202] placeholder-[#949191] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Strong Password"
                  required={!editingAdmin}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[18px] font-medium text-[#4b4b4b]">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full h-[47px] px-3.5 bg-[#f9f9f9] border-[1.3px] border-[#dbdbdb] rounded-[10px] text-[14px] text-[#020202] placeholder-[#949191] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Strong Password"
                  required={!editingAdmin || formData.password !== ''}
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <p className="text-[14px] text-[#4b4b4b]">Password must contain:</p>
              <div className="flex items-center gap-2">
                <div className="w-[18px] h-[18px] relative">
                  {formData.password.match(/[A-Z]/) ? (
                    <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#7e869e] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">×</span>
                    </div>
                  )}
                </div>
                <span className="text-[14px] text-[#4b4b4b]">At least 1 uppercase</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[18px] h-[18px] relative">
                  {formData.password.match(/[0-9]/) ? (
                    <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#7e869e] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">×</span>
                    </div>
                  )}
                </div>
                <span className="text-[14px] text-[#4b4b4b]">At least 1 number</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[18px] h-[18px] relative">
                  {formData.password.length >= 8 ? (
                    <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#7e869e] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">×</span>
                    </div>
                  )}
                </div>
                <span className="text-[14px] text-[#4b4b4b]">At least 8 characteres</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 h-[47px] bg-[#a0a0a0] border border-[#efefef] rounded-[9px] text-white text-[20px] font-semibold hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-[317px] h-[47px] bg-[#09171a] border border-[#efefef] rounded-[9px] text-white text-[20px] font-semibold hover:bg-gray-800 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Admins Table */}
        <div className="w-[555px] border-[1.5px] border-[#d9d9d9] rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-[#f9f9f9] border-b-[1.5px] border-[#d9d9d9] px-3.5 py-2 flex items-center gap-9">
            <input type="checkbox" className="w-[19px] h-[19px] rounded border border-[#b2b2b2]" />
            <span className="text-[16px] font-medium text-[#020202]">Id</span>
            <span className="text-[14px] font-medium text-[#020202] w-[98px]">Name</span>
            <span className="text-[14px] font-medium text-[#020202] w-[50px]">Email</span>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-[#d9d9d9]">
            {admins.map((admin, index) => (
              <div key={admin.id} className="h-[47px] flex items-center px-3.5 gap-8">
                <input type="checkbox" className="w-[19px] h-[19px] rounded border border-[#b2b2b2]" />
                <span className="text-[14px] text-[#020202]">#{index + 1}</span>
                <span className="text-[14px] text-[#020202] w-[130px] truncate">{admin.name || 'No Name'}</span>
                <span className="text-[14px] text-[#020202] w-[175px] truncate overflow-ellipsis">
                  {admin.email}
                </span>
                <div className="flex items-center gap-3 ml-auto border-l border-[#efefef] pl-3">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="w-[18px] h-[19px] text-blue-600 hover:text-blue-900"
                  >
                    <svg viewBox="0 0 18 19" className="w-full h-full">
                      <path d="M2.5 14.5V16.5H4.5L11.87 9.13L9.87 7.13L2.5 14.5Z" fill="currentColor"/>
                      <path d="M14.06 6.19C14.26 5.99 14.26 5.67 14.06 5.47L12.53 3.94C12.33 3.74 12.01 3.74 11.81 3.94L10.57 5.18L12.57 7.18L14.06 6.19Z" fill="currentColor"/>
                    </svg>
                  </button>
                  {admin.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="w-[18px] h-[19px] text-red-600 hover:text-red-900"
                    >
                      <svg viewBox="0 0 18 19" className="w-full h-full">
                        <path d="M6 19C5.45 19 4.97917 18.8042 4.5875 18.4125C4.19583 18.0208 4 17.55 4 17V6H3V4H7V3H11V4H15V6H14V17C14 17.55 13.8042 18.0208 13.4125 18.4125C13.0208 18.8042 12.55 19 12 19H6ZM12 6H6V17H12V6ZM7.5 15.5H9V7.5H7.5V15.5ZM9.5 15.5H11V7.5H9.5V15.5Z" fill="currentColor"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}