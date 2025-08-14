import type { 
  User, LoginResponse, RegisterResponse, GetAdminsResponse,
  Task, TasksResponse, TaskTypesResponse, CreateTaskResponse,
  Badge, CreateBadgeResponse,
  ShopItem, ShopCategory, StockMovement,
  CreateTaskData, CreateBadgeData, CreateShopItemData, CreateShopCategoryData, CreateStockMovementData, CreateAdminData
} from '@/types'

export class ApiClient {
  private baseUrl: string
  private getAuthHeaders: () => Record<string, string>

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') {
    this.baseUrl = baseUrl
    this.getAuthHeaders = (): Record<string, string> => {
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

    console.log('API Request:', {
      url,
      method: config.method || 'GET',
      headers: { 
        ...config.headers, 
        Authorization: 'Authorization' in (config.headers || {}) ? '[PRESENT]' : '[MISSING]' 
      }
    })

    const response = await fetch(url, config)

    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If not JSON, use the text as error message
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('Login attempt:', { email, password: password.replace(/./g, '*') })
    console.log('Request URL:', `${this.baseUrl}/auth/login`)
    
    try {
      const response = await this.request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      console.log('Login successful:', response)
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async getMe(): Promise<User> {
    const response = await this.request<{ user: User }>('/auth/me')
    return response.user
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', { method: 'POST' })
  }

  // Tasks endpoints
  async getTasks(): Promise<TasksResponse> {
    return this.request<TasksResponse>('/task')
  }

  async getTaskTypes(): Promise<TaskTypesResponse> {
    return this.request<TaskTypesResponse>('/task/types')
  }

  async createTask(data: CreateTaskData): Promise<CreateTaskResponse> {
    return this.request<CreateTaskResponse>('/task', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTask(id: string, data: Partial<CreateTaskData>): Promise<{ message: string; task: Task }> {
    return this.request<{ message: string; task: Task }>(`/task/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/task/${id}`, { method: 'DELETE' })
  }

  // Shop endpoints
  async getShopItems(): Promise<ShopItem[]> {
    return this.request<ShopItem[]>('/shop/item')
  }

  async createShopItem(data: CreateShopItemData): Promise<{ message: string; shopItem: ShopItem }> {
    return this.request<{ message: string; shopItem: ShopItem }>('/shop/item', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateShopItem(id: string, data: Partial<CreateShopItemData>): Promise<{ message: string; shopItem: ShopItem }> {
    return this.request<{ message: string; shopItem: ShopItem }>(`/shop/item/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteShopItem(id: string): Promise<void> {
    return this.request<void>(`/shop/item/${id}`, { method: 'DELETE' })
  }

  // Shop categories endpoints
  async getShopCategories(): Promise<ShopCategory[]> {
    return this.request<ShopCategory[]>('/shop-item-categories')
  }

  async createShopCategory(data: CreateShopCategoryData): Promise<{ message: string; shopItemCategory: ShopCategory }> {
    return this.request<{ message: string; shopItemCategory: ShopCategory }>('/shop-item-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Stock movements endpoints
  async getStockMovements(): Promise<StockMovement[]> {
    return this.request<StockMovement[]>('/stock-movements')
  }

  async createStockMovement(data: CreateStockMovementData): Promise<{ message: string; data: StockMovement }> {
    return this.request<{ message: string; data: StockMovement }>('/stock-movements', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Badges endpoints
  async getBadges(): Promise<Badge[]> {
    return this.request<Badge[]>('/badge')
  }

  async createBadge(data: CreateBadgeData): Promise<CreateBadgeResponse> {
    return this.request<CreateBadgeResponse>('/badge', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBadge(id: string, data: Partial<CreateBadgeData>): Promise<{ message: string; badge: Badge }> {
    return this.request<{ message: string; badge: Badge }>(`/badge/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteBadge(id: string): Promise<void> {
    return this.request<void>(`/badge/${id}`, { method: 'DELETE' })
  }

  async assignBadge(badgeId: string, userId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/badge/assign/badgeId/${badgeId}/userId/${userId}`, {
      method: 'POST',
    })
  }

  // Admin endpoints
  async getAdmins(): Promise<GetAdminsResponse> {
    return this.request<GetAdminsResponse>('/auth/admins')
  }

  async createAdmin(data: CreateAdminData): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // System endpoints
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health')
  }
}

export const api = new ApiClient()