import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import type { User, Admin, CreateAdminData } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      // Handle mock token for development
      if (token === 'mock-token') {
        const userData = localStorage.getItem('user')
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData)
            // Convert mock user format to expected format
            setUser({
              id: parsedUser.id,
              email: parsedUser.email,
              name: parsedUser.name,
              isSuper: parsedUser.role === 'super_admin'
            })
          } catch (parseError) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
            setError('Invalid user data')
          }
        }
      } else {
        // Real API call for production tokens
        try {
          const userData = await api.getMe()
          setUser(userData)
        } catch (apiError) {
          // If the token is invalid, clear it and treat as unauthenticated
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
          throw apiError
        }
      }
    } catch (err) {
      // Token inválido, limpar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setError('Session expired')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.login(email, password)
      console.log(response)
      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setUser(response.user)
      router.push('/dashboard')
      
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch (err) {
      // Ignorar erros de logout da API
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }
}

export function useAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getAdmins()
      setAdmins(response.admins)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admins')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAdmin = useCallback(async (adminData: CreateAdminData) => {
    try {
      await api.createAdmin(adminData)
      await fetchAdmins()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create admin' 
      }
    }
  }, [fetchAdmins])

  const deleteAdmin = useCallback(async (adminId: string) => {
    try {
      await api.deleteAdmin(adminId)
      await fetchAdmins() // Refresh the list after deletion
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete admin' 
      }
    }
  }, [fetchAdmins])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  return {
    admins,
    loading,
    error,
    createAdmin,
    deleteAdmin,
    refreshAdmins: fetchAdmins
  }
}