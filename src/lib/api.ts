import type { 
  User, LoginResponse, RegisterResponse, GetAdminsResponse,
  Task, TasksResponse, TaskCategoriesResponse, CreateTaskResponse,
  Badge, CreateBadgeResponse, BadgeRequest, BadgeRequestResponseData,
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
      } catch {
        // If not JSON, use the text as error message
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    // Handle empty responses (204 No Content, etc.)
    const contentLength = response.headers.get('content-length')
    const contentType = response.headers.get('content-type')
    
    if (response.status === 204 || contentLength === '0' || !contentType?.includes('application/json')) {
      return {} as T
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

  async getTaskCategories(plataform?: string): Promise<TaskCategoriesResponse> {
    const queryParam = plataform ? `?plataform=${plataform}` : ''
    return this.request<TaskCategoriesResponse>(`/task/categories${queryParam}`)
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
    // If there's an image file, use FormData instead of JSON
    if (data.image && data.image.startsWith('data:')) {
      const formData = new FormData();
      
      // Convert base64 to blob
      const imageResponse = await fetch(data.image);
      const blob = await imageResponse.blob();
      
      formData.append('image', blob, 'image.jpg');
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('price', data.price.toString());
      formData.append('tag', data.tag || '');
      formData.append('categoryId', data.categoryId.toString());
      formData.append('available', (data.available ?? true).toString());
      formData.append('quantity', (data.quantity ?? 0).toString());

      const url = `${this.baseUrl}/shop/item`
      const config = {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
        },
        body: formData,
      }

      console.log('API Request (FormData):', {
        url,
        method: 'POST',
        headers: { 
          ...config.headers, 
          Authorization: 'Authorization' in (config.headers || {}) ? '[PRESENT]' : '[MISSING]' 
        }
      })

      const apiResponse = await fetch(url, config)

      console.log('API Response:', {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        headers: Object.fromEntries(apiResponse.headers.entries())
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error('API Error Response:', errorText)
        
        let errorMessage = `HTTP error! status: ${apiResponse.status}`
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      return apiResponse.json()
    }
    
    // Fallback to JSON for items without images
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

  // Shop category endpoints
  async getShopCategories(): Promise<ShopCategory[]> {
    return this.request<ShopCategory[]>('/shop/item-category')
  }

  async createShopCategory(data: CreateShopCategoryData): Promise<{ message: string; shopItemCategory: ShopCategory }> {
    return this.request<{ message: string; shopItemCategory: ShopCategory }>('/shop/item-category', {
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

  async getBadgeById(badgeId: string): Promise<Badge> {
    return this.request<Badge>(`/badge/${badgeId}`)
  }

  async createBadge(data: CreateBadgeData): Promise<CreateBadgeResponse> {
    // If there's an image file, use FormData instead of JSON
    if (data.image && data.image.startsWith('data:')) {
      const formData = new FormData();
      
      // Convert base64 to blob
      const imageResponse = await fetch(data.image);
      const blob = await imageResponse.blob();
      
      formData.append('image', blob, 'badge.jpg');
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('goal', data.goal);

      const url = `${this.baseUrl}/badge`
      const config = {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
        },
        body: formData,
      }

      console.log('API Request (FormData):', {
        url,
        method: 'POST',
        headers: { 
          ...config.headers, 
          Authorization: 'Authorization' in (config.headers || {}) ? '[PRESENT]' : '[MISSING]' 
        }
      })

      const apiResponse = await fetch(url, config)

      console.log('API Response:', {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        headers: Object.fromEntries(apiResponse.headers.entries())
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error('API Error Response:', errorText)
        
        let errorMessage = `HTTP error! status: ${apiResponse.status}`
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      return apiResponse.json()
    }
    
    // Fallback to JSON for badges without images
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

  // Badge request endpoints
  async getBadgeRequests(): Promise<BadgeRequest[]> {
    return this.request<BadgeRequest[]>('/badge-request')
  }

  async getBadgeRequestsByUser(userId: string): Promise<BadgeRequest[]> {
    return this.request<BadgeRequest[]>(`/badge-request/user/${userId}`)
  }

  async respondToBadgeRequest(data: BadgeRequestResponseData): Promise<{ message: string; badgeRequest: BadgeRequest }> {
    return this.request<{ message: string; badgeRequest: BadgeRequest }>('/badge-request/response', {
      method: 'POST',
      body: JSON.stringify(data),
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

  async updateAdmin(adminId: string, data: Partial<CreateAdminData>): Promise<{ message: string; admin: Record<string, unknown> }> {
    return this.request<{ message: string; admin: Record<string, unknown> }>(`/auth/${adminId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAdmin(adminId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/auth/${adminId}`, {
      method: 'DELETE',
    })
  }

  // System endpoints
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health')
  }
}

export const api = new ApiClient()