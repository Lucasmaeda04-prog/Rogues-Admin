'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
interface HeaderProps {
  user?: {
    name?: string
    email: string
    role: 'admin' | 'super_admin'
  }
}

export default function Header({ user }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-700 via-blue-500 via-cyan-400 to-blue-800 text-white px-6 py-3 flex items-center justify-between relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-cyan-300/30 before:to-transparent before:animate-pulse">
    
      <img className ="h-10 relative z-10" src='/assets/Logo.png'>
      </img>

      {/* User Menu */}
      <div className="relative z-10">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 hover:bg-white/10 rounded px-3 py-2 transition-colors"
        >
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              👤
            </span>
          </div>
          <span className="text-white text-sm">
            {user?.name || 'John Doe'}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-[100]">
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">
                {user?.name || 'John Doe'}
              </div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}