# API Documentation - Backend Admin

## Base URL
```
http://localhost:8080
```

## Authentication
Most endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Auth Routes (`/auth`)

### POST `/auth/register`
**Description:** Register a new admin
**Authentication:** Not required
**Request Body:**
```typescript
{
  email: string;
  password: string;
  name?: string;
  isSuperAdmin?: boolean;
}
```
**Response:**
```typescript
// Success (201)
{
  message: string;
  admin: {
    adminId: string;
    email: string;
    name: string | null;
    isSuperAdmin: boolean;
    createdAt: string;
  };
}

// Error (400/409/500)
{
  error: string;
}
```

### POST `/auth/login`
**Description:** Login admin
**Authentication:** Not required
**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```
**Response:**
```typescript
// Success (200)
{
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    isSuper: boolean;
  };
}

// Error (400/401/500)
{
  error: string;
}
```

### POST `/auth/refresh`
**Description:** Refresh access token
**Authentication:** Refresh token in cookies
**Response:**
```typescript
// Success (200)
{
  message: string;
  accessToken: string;
}

// Error (401)
{
  error: string;
}
```

### POST `/auth/logout`
**Description:** Logout admin
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  message: string;
}
```

### GET `/auth/me`
**Description:** Get current admin info
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  user: {
    id: string;
    email: string;
    name: string | null;
    isSuper: boolean;
  };
}

// Error (401/404/500)
{
  error: string;
}
```

### GET `/auth/admins`
**Description:** Get all admins (super admin only)
**Authentication:** Required (Super Admin)
**Response:**
```typescript
// Success (200)
{
  admins: Array<{
    adminId: string;
    email: string;
    name: string | null;
    isSuperAdmin: boolean;
    createdAt: string;
  }>;
}

// Error (401/403/500)
{
  error: string;
}
```

---

## Badge Routes (`/badge`)

### GET `/badge`
**Description:** Get all badges
**Authentication:** Required
**Response:**
```typescript
// Success (200)
Array<{
  badgeId: string;
  title: string;
  goal: string;
  description: string | null;
  image: string;
  createdAt: string;
  updatedAt: string;
}>

// Error (500)
{
  error: string;
}
```

### GET `/badge/:id`
**Description:** Get badge by ID
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  badgeId: string;
  title: string;
  goal: string;
  description: string | null;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Error (404/500)
{
  error: string;
}
```

### POST `/badge`
**Description:** Create new badge
**Authentication:** Required
**Request Body:** Form data with fields:
```typescript
{
  title: string;
  goal: string;
  description?: string;
  image?: string; // URL if not uploading file
}
// + optional image file upload
```
**Response:**
```typescript
// Success (201)
{
  message: string;
  badge: {
    badgeId: string;
    title: string;
    goal: string;
    description: string | null;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Error (400/401/409/500)
{
  error?: string;
  errors?: string[];
}
```

### PUT `/badge/:id`
**Description:** Update badge
**Authentication:** Required
**Request Body:** Form data with optional fields:
```typescript
{
  title?: string;
  goal?: string;
  description?: string;
  image?: string;
}
// + optional image file upload
```
**Response:**
```typescript
// Success (200)
{
  message: string;
  badge: {
    badgeId: string;
    title: string;
    goal: string;
    description: string | null;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Error (400/401/404/409/500)
{
  error?: string;
  errors?: string[];
}
```

### DELETE `/badge/:id`
**Description:** Delete badge
**Authentication:** Required
**Response:**
```typescript
// Success (204) - No content

// Error (401/404/409/500)
{
  error: string;
}
```

### POST `/badge/assign/badgeId/:badgeId/userId/:userId`
**Description:** Assign badge to user
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  message: string;
}

// Error (400/401/404/409/500)
{
  error: string;
}
```

---

## Task Routes (`/task`)

### GET `/task/types`
**Description:** Get all task types
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  types: Array<'TWITTER_LIKE' | 'TWITTER_COMMENT' | 'TWITTER_RETWEET' | 'TWITTER_PFP' | 'DISCORD_TOWNHALL_PRESENCE'>;
}

// Error (500)
{
  error: string;
}
```

### POST `/task`
**Description:** Create new task
**Authentication:** Required
**Request Body:**
```typescript
{
  name: string;
  description?: string;
  link?: string;
  points?: number;
  deadline?: string; // ISO date string
  // Choose ONE of the following ways to set category:
  taskCategoryId?: number; // preferred
  // OR
  taskCategoryAction?: 'LIKE' | 'COMMENT' | 'RETWEET' | 'PFP' | 'TOWNHALL_PRESENCE' | 'FOLLOW';
  taskPlataform?: 'TWITTER' | 'DISCORD';
  isDaily?: boolean;
  verificationSteps?: string;
}
```
**Response:**
```typescript
// Success (201)
{
  message: string;
  task: {
    taskId: string;
    name: string;
    description: string | null;
    link: string | null;
    points: number;
    deadline: string;
    taskCategoryId: number;
    verificationSteps: string;
    adminId: string;
    createdAt: string;
    updatedAt: string;
    isDaily: boolean;
  };
}

// Error (400/401/500)
{
  error: string;
  code?: string;
  details?: string;
}
```

### GET `/task`
**Description:** Get all tasks
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  tasks: Array<{
    taskId: string;
    name: string;
    description: string | null;
    link: string | null;
    points: number;
    deadline: string;
    taskCategoryId: number;
    verificationSteps: string;
    adminId: string;
    createdAt: string;
    updatedAt: string;
    isDaily: boolean;
    admin: {
      name: string | null;
      email: string;
    };
    _count: {
      taskCompletions: number;
    };
  }>;
}

// Error (401/500)
{
  error: string;
}
```

### GET `/task/:id`
**Description:** Get task by ID
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  task: {
    taskId: string;
    name: string;
    description: string | null;
    link: string | null;
    points: number;
    deadline: string;
    taskCategoryId: number;
    verificationSteps: string;
    adminId: string;
    createdAt: string;
    updatedAt: string;
    isDaily: boolean;
    admin: {
      name: string | null;
      email: string;
    };
    _count: {
      taskCompletions: number;
    };
  };
}

// Error (400/401/404/500)
{
  error: string;
}
```

### PUT `/task/:id`
**Description:** Update task
**Authentication:** Required
**Request Body:**
```typescript
{
  name?: string;
  description?: string;
  link?: string;
  points?: number;
  deadline?: string;
  taskCategoryId?: number;
  isDaily?: boolean;
  verificationSteps?: string;
}
```
**Response:**
```typescript
// Success (200)
{
  message: string;
  task: {
    taskId: string;
    name: string;
    description: string | null;
    link: string | null;
    points: number;
    deadline: string;
    taskCategoryId: number;
    verificationSteps: string;
    adminId: string;
    createdAt: string;
    updatedAt: string;
    isDaily: boolean;
  };
}

// Error (400/401/404/500)
{
  error: string;
  code?: string;
  details?: string;
}
```

### DELETE `/task/:id`
**Description:** Delete task
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  message: string;
}

// Error (400/401/404/500)
{
  error: string;
}
```

---

## Shop Item Routes (`/shop/item`)

### POST `/shop/item`
**Description:** Create new shop item
**Authentication:** Required
**Request Body:** Form data with fields:
```typescript
{
  name: string;
  description?: string;
  image?: string; // URL if not uploading file
  price: number;
  tag?: string;
  categoryId: number;
  available?: boolean;
  quantity?: number;
}
// + optional image file upload
```
**Response:**
```typescript
// Success (201)
{
  message: string;
  shopItem: {
    shopItemId: string;
    name: string;
    description: string | null;
    image: string | null;
    price: number;
    tag: string | null;
    categoryId: number;
    available: boolean;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Error (400/401/409/500)
{
  error?: string;
  errors?: string[];
}
```

### GET `/shop/item`
**Description:** Get all shop items
**Authentication:** Required
**Response:**
```typescript
// Success (200)
Array<{
  shopItemId: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  tag: string | null;
  categoryId: number;
  available: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  category: {
    shopItemCategoryId: number;
    name: string;
  };
}>

// Error (500)
{
  error: string;
}
```

### GET `/shop/item/:id`
**Description:** Get shop item by ID
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  shopItemId: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  tag: string | null;
  categoryId: number;
  available: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  category: {
    shopItemCategoryId: number;
    name: string;
  };
}

// Error (404/500)
{
  error: string;
}
```

### PUT `/shop/item/:id`
**Description:** Update shop item
**Authentication:** Required
**Request Body:** Form data with optional fields:
```typescript
{
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  tag?: string;
  categoryId?: number;
  available?: boolean;
  quantity?: number;
}
// + optional image file upload
```
**Response:**
```typescript
// Success (200)
{
  message: string;
  shopItem: {
    shopItemId: string;
    name: string;
    description: string | null;
    image: string | null;
    price: number;
    tag: string | null;
    categoryId: number;
    available: boolean;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Error (400/401/404/500)
{
  error?: string;
  errors?: string[];
}
```

### DELETE `/shop/item/:id`
**Description:** Delete shop item
**Authentication:** Required
**Response:**
```typescript
// Success (204) - No content

// Error (401/404/500)
{
  error: string;
}
```

---

## Shop Item Category Routes (`/shop/item-category`)

### POST `/shop/item-category`
**Description:** Create new shop item category
**Authentication:** Required
**Request Body:**
```typescript
{
  name: string;
}
```
**Response:**
```typescript
// Success (201)
{
  message: string;
  shopItemCategory: {
    shopItemCategoryId: number;
    name: string;
  };
}

// Error (400/401/409/500)
{
  error?: string;
  errors?: string[];
}
```

### GET `/shop/item-category`
**Description:** Get all shop item categories
**Authentication:** Required
**Query Parameters:**
- `includeItems=true` (optional) - Include shop items in response
**Response:**
```typescript
// Success (200)
Array<{
  shopItemCategoryId: number;
  name: string;
  shopItems?: Array<ShopItem>; // If includeItems=true
}>

// Error (500)
{
  error: string;
}
```

### GET `/shop/item-category/:id`
**Description:** Get shop item category by ID
**Authentication:** Required
**Query Parameters:**
- `includeItems=true` (optional) - Include shop items in response
**Response:**
```typescript
// Success (200)
{
  shopItemCategoryId: number;
  name: string;
  shopItems?: Array<ShopItem>; // If includeItems=true
}

// Error (400/404/500)
{
  error: string;
}
```

### PUT `/shop/item-category/:id`
**Description:** Update shop item category
**Authentication:** Required
**Request Body:**
```typescript
{
  name: string;
}
```
**Response:**
```typescript
// Success (200)
{
  message: string;
  shopItemCategory: {
    shopItemCategoryId: number;
    name: string;
  };
}

// Error (400/401/404/409/500)
{
  error?: string;
  errors?: string[];
}
```

### DELETE `/shop/item-category/:id`
**Description:** Delete shop item category
**Authentication:** Required
**Response:**
```typescript
// Success (204) - No content

// Error (401/404/409/500)
{
  error: string;
}
```

---

## Stock Movement Routes (`/shop/stock-movement`)

### POST `/shop/stock-movement`
**Description:** Create new stock movement
**Authentication:** Required
**Request Body:**
```typescript
{
  shopItemId: string;
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
  quantityChange: number; // Positive for ENTRY, negative for EXIT
  reason?: string;
}
```
**Response:**
```typescript
// Success (201)
{
  message: string;
  data: {
    stockMovementId: number;
    shopItemId: string;
    type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
    quantityChange: number;
    reason: string | null;
    createdAt: string;
    reversedById: number | null;
    status: 'ACTIVE' | 'REVERSED' | 'CANCELLED';
    adminId: string | null;
    sourceType: 'USER' | 'ADMIN';
    userId: string | null;
  };
}

// Error (400/401/404/500)
{
  error?: string;
  errors?: string[];
}
```

### GET `/shop/stock-movement`
**Description:** Get all stock movements
**Authentication:** Required
**Query Parameters:**
- `includeShopItem=true` (optional) - Include shop item details in response
**Response:**
```typescript
// Success (200)
Array<{
  stockMovementId: number;
  shopItemId: string;
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
  quantityChange: number;
  reason: string | null;
  createdAt: string;
  reversedById: number | null;
  status: 'ACTIVE' | 'REVERSED' | 'CANCELLED';
  adminId: string | null;
  sourceType: 'USER' | 'ADMIN';
  userId: string | null;
  shopItem?: {
    shopItemId: string;
    name: string;
    description: string | null;
    image: string | null;
    price: number;
    tag: string | null;
    categoryId: number;
    available: boolean;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  }; // If includeShopItem=true
}>

// Error (500)
{
  error: string;
}
```

### GET `/shop/stock-movement/:id`
**Description:** Get stock movement by ID
**Authentication:** Required
**Query Parameters:**
- `includeShopItem=true` (optional) - Include shop item details in response
**Response:**
```typescript
// Success (200)
{
  stockMovementId: number;
  shopItemId: string;
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT';
  quantityChange: number;
  reason: string | null;
  createdAt: string;
  reversedById: number | null;
  status: 'ACTIVE' | 'REVERSED' | 'CANCELLED';
  adminId: string | null;
  sourceType: 'USER' | 'ADMIN';
  userId: string | null;
  shopItem?: {
    shopItemId: string;
    name: string;
    description: string | null;
    image: string | null;
    price: number;
    tag: string | null;
    categoryId: number;
    available: boolean;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  }; // If includeShopItem=true
}

// Error (400/404/500)
{
  error: string;
}
```

### POST `/shop/stock-movement/:id/reverse`
**Description:** Reverse a stock movement
**Authentication:** Required
**Response:**
```typescript
// Success (200)
{
  message: string;
}

// Error (400/401/404/500)
{
  error: string;
}
```

---

## Badge Request Routes (`/badge-request`)

### GET `/badge-request/`
**Description:** Get all badge requests
**Authentication:** Required
**Response:**
```typescript
// Success (200)
Array<{
  id: string;
  userId: string;
  badgeId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  // Nested details may be included depending on selection
}>

// Error (401/500)
{
  error: string;
}
```

### GET `/badge-request/user/:userId`
**Description:** Get badge requests by user ID
**Authentication:** Required
**Parameters:**
- `userId` (string) - User ID to filter badge requests
**Response:**
```typescript
// Success (200)
Array<{ id: string; userId: string; badgeId: string; status: 'PENDING' | 'ACCEPTED' | 'REJECTED'; createdAt: string; updatedAt: string; }>

// Error (401/500)
{
  error: string;
}
```

### POST `/badge-request/response`
**Description:** Respond to a badge request (approve/reject)
**Authentication:** Required
**Request Body:**
```typescript
{
  id: string;
  status: 'ACCEPTED' | 'REJECTED';
  adminNote?: string;
}
```
**Response:**
```typescript
// Success (200)
{
  message: string;
  badgeRequest: {
    id: string;
    userId: string;
    badgeId: string;
    status: 'ACCEPTED' | 'REJECTED';
    adminId: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Error (400/401/404/500)
{
  error: string;
}
```

---

## Task Categories Routes (`/task/categories`)

### GET `/task/categories`
**Description:** Get task categories with optional filters
**Authentication:** Required
**Query Parameters:**
- `plataform` (optional) - Filter by platform: `TWITTER` | `DISCORD`
- `action` (optional) - Filter by action type: `LIKE` | `COMMENT` | `RETWEET` | `PFP` | `TOWNHALL_PRESENCE`
- `taskCategoryId` (optional) - Filter by specific category ID
**Response:**
```typescript
// Success (200)
{
  categories: Array<{
    taskCategoryId: number;
    plataform: 'TWITTER' | 'DISCORD';
    action: 'LIKE' | 'COMMENT' | 'RETWEET' | 'PFP' | 'TOWNHALL_PRESENCE';
  }>;
}

// Error (401/500)
{
  error: string;
}
```

**Example Usage:**
```javascript
// Get all categories
fetch('/task/categories', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Filter by platform
fetch('/task/categories?plataform=TWITTER', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Filter by platform and action
fetch('/task/categories?plataform=DISCORD&action=TOWNHALL_PRESENCE', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

---

## Error Response Types

### Standard Error Response
```typescript
{
  error: string;
}
```

### Validation Error Response
```typescript
{
  errors: string[];
}
```

### Prisma Validation Error Response
```typescript
{
  error: string;
  code: 'PRISMA_VALIDATION_ERROR';
  details: string;
}
```

---

## Common HTTP Status Codes

- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **204**: No Content - Request successful, no content to return
- **400**: Bad Request - Invalid request data
- **401**: Unauthorized - Authentication required or invalid
- **403**: Forbidden - Access denied (insufficient permissions)
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists or constraint violation
- **500**: Internal Server Error - Server error
