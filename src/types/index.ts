// =============================================================================
// CENTRALIZED TYPE DEFINITIONS
// =============================================================================
// All TypeScript interfaces and types for the admin panel application

// =============================================================================
// AUTH & USER TYPES
// =============================================================================

export interface User {
  id: string
  email: string
  name: string | null
  isSuper: boolean
}

export interface Admin {
  adminId: string
  email: string
  name: string | null
  isSuperAdmin: boolean
  createdAt: string
}

export interface LoginResponse {
  message: string
  accessToken: string
  user: User
}

export interface RegisterResponse {
  message: string
  admin: Admin
}

// =============================================================================
// TASK TYPES  
// =============================================================================

export type TaskType = 'TWITTER_LIKE' | 'TWITTER_COMMENT' | 'TWITTER_RETWEET' | 'TWITTER_PFP' | 'DISCORD_TOWNHALL_PRESENCE'

export interface TaskCategory {
  taskCategoryId: number
  action: string
  plataform: string
}

export interface Task {
  taskId: string
  name: string
  description: string | null
  link: string | null
  points: number
  deadline: string
  type?: TaskType // Agora opcional, já que usamos taskCategoryId
  taskCategoryId: number // ID da categoria da task
  adminId: string
  createdAt: string
  updatedAt: string
  isDaily: boolean
  verificationSteps: string
  // Additional fields from API joins/calculations
  admin?: {
    name: string | null
    email: string
  }
  _count?: {
    taskCompletions: number
  }
}

export interface TaskCategoriesResponse {
  categories: TaskCategory[]
}

export interface TaskPlatformsResponse {
  values: string[]
}

export interface TasksResponse {
  tasks: Task[]
}

export interface TaskResponse {
  task: Task
}

export interface CreateTaskResponse {
  message: string
  task: Omit<Task, 'admin' | '_count'>
}

// =============================================================================
// BADGE TYPES
// =============================================================================

export interface Badge {
  badgeId: string
  title: string
  description: string | null
  goal?: string
  image: string
  createdAt: string
  updatedAt: string
}

export interface BadgeData {
  id: number;
  title: string;
  description: string;
  requirement: string;
  image: string;
  innerIcon?: string;
  isUnlocked: boolean;
  isRequested?: boolean; // New field for requested state
}

export interface CreateBadgeResponse {
  message: string
  badge: Badge
}

export interface BadgeRequest {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACCEPTED'
  message?: string
  createdAt: string
  updatedAt: string
  Badge?: {
    badgeId: string
    title: string
    description?: string
    goal?: string
  }
  User?: {
    name: string
    UserRole?: unknown
  }
  Admin?: {
    email: string
    name: string
  }
  Document?: {
    documentId: string
    title: string
    DocumentAttachment?: {
      filename: string
      mimeType: string
      fileUrl: string
    }[]
  }
}

export interface BadgeRequestsResponse {
  badgeRequests?: BadgeRequest[]
}

export interface BadgeRequestResponseData {
  id: string
  status: 'ACCEPTED' | 'REJECTED'
  adminNote?: string
}

// =============================================================================
// SHOP TYPES
// =============================================================================

export interface ShopItem {
  shopItemId: string
  name: string
  description: string | null
  image: string | null
  price: number
  tag: string | null
  categoryId: number
  available: boolean
  quantity: number
  createdAt: string
  updatedAt: string
  roleName?: string | null
  requiredBadgeId?: string | null
  category?: {
    shopItemCategoryId: number
    name: string
  }
}

export interface ShopCategory {
  shopItemCategoryId: number
  name: string
  shopItems?: ShopItem[]
}

export interface StockMovement {
  stockMovementId: number
  shopItemId: string
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT'
  quantityChange: number
  reason: string | null
  createdAt: string
  reversedById: number | null
  status: 'ACTIVE' | 'REVERSED' | 'CANCELLED'
  adminId: string | null
  sourceType: 'USER' | 'ADMIN'
  userId: string | null
  shopItem?: ShopItem
}

export interface CreateShopItemResponse {
  message: string
  shopItem: ShopItem
}

export interface CreateShopCategoryResponse {
  message: string
  shopItemCategory: ShopCategory
}

export interface CreateStockMovementResponse {
  message: string
  data: StockMovement
}

export interface ShopifySyncResponse {
  message: string
  created: number
  updated: number
  skipped: number
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiError {
  message: string
  code?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// =============================================================================
// FORM & INPUT TYPES
// =============================================================================

export interface CreateTaskData {
  name: string
  description?: string
  link?: string
  points?: number
  deadline?: string
  taskCategoryId: number
  isDaily?: boolean
  verificationSteps?: string
}

export interface CreateBadgeData {
  title: string
  description?: string
  goal: string
  image?: string
}

export interface CreateShopItemData {
  name: string
  description?: string
  image?: string
  price: number
  tag?: string
  categoryId: number
  available?: boolean
  quantity?: number
  requiredBadgeId?: string | null
  roleName?: string | null
}

export interface CreateShopCategoryData {
  name: string
}

export interface CreateStockMovementData {
  shopItemId: string
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT'
  quantityChange: number
  reason?: string
}

export interface CreateAdminData {
  email: string
  password: string
  name?: string
  isSuperAdmin?: boolean
}

export interface GetAdminsResponse {
  admins: Admin[]
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Status = 'pending' | 'loading' | 'success' | 'error'

export interface LoadingState<T> {
  data: T | null
  loading: boolean
  error: string | null
}
