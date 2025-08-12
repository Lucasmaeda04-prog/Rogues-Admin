export class ApiClient {
  private baseUrl: string
  private getAuthHeaders: () => Record<string, string>

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl
    this.getAuthHeaders = () => {
      const token = localStorage.getItem('token')
      return token ? { 'Authorization': `Bearer ${token}` } : {}
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async validateToken() {
    return this.request('/auth/validate')
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' })
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats')
  }

  // Tasks endpoints
  async getTasks() {
    return this.request('/tasks')
  }

  async createTask(data: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTask(id: string, data: any) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTask(id: string) {
    return this.request(`/tasks/${id}`, { method: 'DELETE' })
  }

  // Shop endpoints
  async getShopItems() {
    return this.request('/shop/items')
  }

  async createShopItem(data: any) {
    return this.request('/shop/items', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateShopItem(id: string, data: any) {
    return this.request(`/shop/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteShopItem(id: string) {
    return this.request(`/shop/items/${id}`, { method: 'DELETE' })
  }

  // Badges endpoints
  async getBadges() {
    return this.request('/badges')
  }

  async createBadge(data: any) {
    return this.request('/badges', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBadge(id: string, data: any) {
    return this.request(`/badges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteBadge(id: string) {
    return this.request(`/badges/${id}`, { method: 'DELETE' })
  }

  // Admin endpoints
  async getAdmins() {
    return this.request('/admin/users')
  }

  async createAdmin(data: any) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAdmin(id: string, data: any) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAdmin(id: string) {
    return this.request(`/admin/users/${id}`, { method: 'DELETE' })
  }
}

export const api = new ApiClient()