'use client'

import { useState } from 'react'
import CreateTaskModal, { TaskFormData } from '@/components/modals/CreateTaskModal'

export default function DebugPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const handleTaskSubmit = (data: TaskFormData) => {
    console.log('Task submitted:', data)
    setResult(`Task created: ${JSON.stringify(data, null, 2)}`)
    setIsTaskModalOpen(false)
  }

  const testEndpoint = async (endpoint: string, method = 'GET', body?: unknown) => {
    setLoading(true)
    setResult('')
    
    try {
      const url = `http://localhost:8080${endpoint}`
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      }
      
      if (body) {
        config.body = JSON.stringify(body)
      }
      
      console.log('Testing endpoint:', url, config)
      
      const response = await fetch(url, config)
      const text = await response.text()
      
      setResult(`
Status: ${response.status} ${response.statusText}
Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}
Body: ${text}
      `)
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Backend Debug Page</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={() => testEndpoint('/health')}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
          disabled={loading}
        >
          Test Health Endpoint
        </button>
        
        <button
          onClick={() => testEndpoint('/auth/login', 'POST', { email: 'admin@admin.com', password: 'admin123' })}
          className="px-4 py-2 bg-green-500 text-white rounded mr-4"
          disabled={loading}
        >
          Test Login (admin@admin.com)
        </button>
        
        <button
          onClick={() => testEndpoint('/auth/login', 'POST', { email: 'test@test.com', password: 'test123' })}
          className="px-4 py-2 bg-green-600 text-white rounded mr-4"
          disabled={loading}
        >
          Test Login (test@test.com)
        </button>
        
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded mr-4"
        >
          Test Create Task Modal
        </button>
        
        <button
          onClick={() => testEndpoint('/auth/admins')}
          className="px-4 py-2 bg-red-500 text-white rounded mr-4"
          disabled={loading}
        >
          Test Auth/Admins (without token)
        </button>
        
        <button
          onClick={() => testEndpoint('/task')}
          className="px-4 py-2 bg-purple-500 text-white rounded mr-4"
          disabled={loading}
        >
          Test Tasks (without token)
        </button>
        
        <button
          onClick={() => testEndpoint('/auth/register', 'POST', { 
            email: 'admin@admin.com', 
            password: 'admin123', 
            name: 'Admin User',
            isSuperAdmin: true 
          })}
          className="px-4 py-2 bg-orange-500 text-white rounded mr-4"
          disabled={loading}
        >
          Try Register Admin
        </button>
        
        <button
          onClick={() => testEndpoint('/auth/signin', 'POST', { email: 'admin@admin.com', password: 'admin123' })}
          className="px-4 py-2 bg-pink-500 text-white rounded mr-4"
          disabled={loading}
        >
          Test /auth/signin (alternative)
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        {result}
      </pre>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        isLoading={false}
        mode="create"
      />
    </div>
  )
}