export interface User {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  name?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export class AuthService {
  private static instance: AuthService
  private token: string | null = null
  private user: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return this.token
  }

  setToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  getUser(): User | null {
    return this.user
  }

  setUser(user: User): void {
    this.user = user
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data: AuthResponse = await response.json()
    this.setToken(data.token)
    this.setUser(data.user)
    
    return data
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      })
    } finally {
      this.token = null
      this.user = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }

  async validateToken(): Promise<User | null> {
    const token = this.getToken()
    if (!token) return null

    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const user: User = await response.json()
        this.setUser(user)
        return user
      }
    } catch (error) {
      console.error('Token validation failed:', error)
    }

    return null
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  isSuperAdmin(): boolean {
    return this.user?.role === 'super_admin'
  }
}

export const auth = AuthService.getInstance()