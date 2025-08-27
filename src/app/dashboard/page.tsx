'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks'
import AdminsTab from '@/components/dashboard/AdminsTab'
import TasksTab from '@/components/dashboard/TasksTab'
import ShopTab from '@/components/dashboard/ShopTab'
import BadgesTab from '@/components/dashboard/BadgesTab'
import BadgeRequestsTab from '@/components/dashboard/BadgeRequestsTab'

type ActiveTab = 'Admins' | 'Tasks' | 'Shop' | 'Badges' | 'Badge Requests'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('Admins')
  const { user } = useAuth()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Admins':
        return <AdminsTab />
      case 'Tasks':
        return <TasksTab />
      case 'Shop':
        return <ShopTab />
      case 'Badges':
        return <BadgesTab />
      case 'Badge Requests':
        return <BadgeRequestsTab />
      default:
        return <AdminsTab />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" data-main-content>
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome, {user?.name || user?.email || 'Admin'}!
            </h1>
            {user?.isSuper && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Super Admin
              </span>
            )}
          </div>
          
          <nav className="flex space-x-8">
            {(['Admins', 'Tasks', 'Shop', 'Badges', 'Badge Requests'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-semibold transition-all duration-150 ease-out ${
                  activeTab === tab
                    ? 'border-blue-600 text-black text-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm'
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
        {renderTabContent()}
      </div>
    </div>
  )
}