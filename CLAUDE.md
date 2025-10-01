# Admin Panel - Rogues Carrot Bar

## 📋 Descrição do Projeto
Painel administrativo para gerenciar tarefas, itens da loja, badges e administradores do sistema Rogues Carrot Bar.

## 🏗️ Arquitetura
- **Framework**: Next.js 15.4.6 com App Router
- **TypeScript**: ^5
- **Styling**: Tailwind CSS v4
- **Runtime**: Turbopack (desenvolvimento)

## 📁 Estrutura de Diretórios

```
admin/
├── public/                          # Assets estáticos
│   ├── assets/                      # Imagens e ícones (SVGs/PNGs)
│   └── fonts/                       # Fontes customizadas
│       ├── CamptonLight.ttf         # Peso 300
│       ├── CamptonMedium.otf        # Peso 500
│       ├── CamptonSemiBold.ttf      # Peso 600
│       └── CamptonExtraBold.otf     # Peso 800
│
├── src/
│   ├── app/                         # App Router (Next.js 13+)
│   │   ├── dashboard/               # Área administrativa
│   │   │   ├── admins/              # Gestão de administradores
│   │   │   │   └── page.tsx
│   │   │   ├── badges/              # Gestão de badges
│   │   │   │   └── page.tsx
│   │   │   ├── shop/                # Gestão de loja
│   │   │   │   └── page.tsx
│   │   │   ├── tasks/               # Gestão de tarefas
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx           # Layout do dashboard
│   │   │   └── page.tsx             # Dashboard principal
│   │   │
│   │   ├── login/                   # Autenticação
│   │   │   └── page.tsx
│   │   │
│   │   ├── layout.tsx               # Layout global
│   │   ├── page.tsx                 # Homepage
│   │   ├── globals.css              # Estilos globais
│   │   └── favicon.ico              # Ícone do site
│   │
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── ui/                      # Componentes base da UI
│   │   │   ├── header.tsx           # Cabeçalho
│   │   │   ├── sidebar.tsx          # Menu lateral
│   │   │   └── modal.tsx            # Modal
│   │   └── Header.tsx               # Componente Header principal
│   │
│   └── lib/                         # Utilitários e configurações
│       ├── fonts.ts                 # Configuração das fontes
│       ├── api.ts                   # Cliente API
│       └── auth.ts                  # Autenticação
│
├── .next/                           # Build do Next.js (auto-gerado)
├── node_modules/                    # Dependências
├── package.json                     # Configurações do projeto
├── tsconfig.json                    # Configuração TypeScript
├── next.config.ts                   # Configuração Next.js
├── next-env.d.ts                    # Types do Next.js
└── CLAUDE.md                        # Este arquivo
```

## 🎨 Sistema de Design

### Fontes
- **Família**: Campton (fonte customizada)
- **Pesos disponíveis**:
  - Light (300) - CamptonLight.ttf
  - Medium (500) - CamptonMedium.otf
  - SemiBold (600) - CamptonSemiBold.ttf
  - ExtraBold (800) - CamptonExtraBold.otf

### Configuração de Fonte
```typescript
// src/lib/fonts.ts
export const Campton = localFont({
  src: [...], // Múltiplos pesos
  display: 'swap',
  adjustFontFallback: false,
});
```

### Sistema de Cores
- **Definição centralizada**: `src/lib/color.ts`
- **Integração com Tailwind**: `tailwind.config.ts` importa as cores automaticamente
- **Padrão de uso**: Classes Tailwind (`bg-rogues-default-150`, `text-rogues-default-150`)

#### Paleta de Cores Disponíveis
```typescript
// src/lib/color.ts
export const colors = {
  'rogues-default': {
    '50': '#1A1C1F',     // Cinza muito escuro
    '100': '#0E1036',    // Azul muito escuro  
    '110': '#242424B2',  // Cinza escuro com transparência
    '125': '#074E8A',    // Azul escuro
    '140': '#D6BD9F',    // Bege/dourado
    '145': '#555555',    // Cinza médio (para ícone X/Twitter)
    '150': '#EC1751',    // Rosa/vermelho (cor principal da marca)
    '200': '#961D44',    // Vermelho escuro
  },
  'rogues-secondary': {
    '50': '#00B471',     // Verde
    '100': '#EE5F67',    // Rosa claro
    '200': '#D9D9D9',    // Cinza claro
  },
};
```

#### Como Usar
```typescript
// Tailwind classes automáticas (recomendado)
className="bg-rogues-default-150 text-white hover:bg-rogues-default-150/50"

// Exemplo de uso em componentes
const getSocialMediaColor = (platform: string) => {
  switch (platform) {
    case 'X': return 'bg-rogues-default-145';        // Cinza
    case 'discord': return 'bg-blue-600';            // Azul padrão Tailwind
    default: return 'bg-rogues-default-150';         // Rosa marca
  }
};
```

#### Configuração Automática
O `tailwind.config.ts` importa automaticamente todas as cores:
```typescript
import { colors } from './src/lib/color';

export default {
  theme: {
    extend: {
      colors: {
        ...colors, // Disponibiliza bg-rogues-*, text-rogues-*, border-rogues-*
      },
    },
  },
} satisfies Config;
```

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento com Turbopack
npm run build      # Build de produção
npm run start      # Servidor de produção
npm run lint       # ESLint
```

## 🎯 Funcionalidades

### Dashboard Principal
- `/dashboard` - Visão geral do sistema

### Módulos Administrativos
- `/dashboard/admins` - Gestão de administradores
- `/dashboard/badges` - Gestão de badges/conquistas
- `/dashboard/shop` - Gestão de itens da loja
- `/dashboard/tasks` - Gestão de tarefas

### Autenticação
- `/login` - Página de login

## 📦 Dependências Principais

### Produção
- `react@19.1.0` - Biblioteca React
- `react-dom@19.1.0` - React DOM
- `next@15.4.6` - Framework Next.js

### Desenvolvimento
- `typescript@^5` - TypeScript
- `tailwindcss@^4` - Tailwind CSS
- `eslint@^9` - Linter
- `@types/*` - Definições de tipos

## 🚀 Como Executar

1. **Instalação**:
   ```bash
   npm install
   ```

2. **Desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Build**:
   ```bash
   npm run build
   npm start
   ```

## 📝 Convenções do Projeto

### Estrutura de Arquivos
- Componentes React: PascalCase (`.tsx`)
- Utilitários: camelCase (`.ts`)
- Estilos: kebab-case (`.css`)

### Roteamento
- App Router (Next.js 13+)
- Layouts aninhados (`layout.tsx`)
- Páginas como `page.tsx`

### Organização
- `components/ui/` - Componentes base
- `lib/` - Utilitários e configurações
- `app/` - Roteamento e páginas

## 🎯 Padrão de Modais Responsivos

### Estrutura Padrão (Mobile-First)
Todos os modais devem seguir esta estrutura responsiva estabelecida:

```typescript
// Estrutura padrão para modais responsivos
return (
  <div className="fixed inset-0 z-50">
    {/* Overlay separado com blur */}
    <div 
      className="absolute inset-0 backdrop-blur-sm bg-black/30"
      onClick={handleOverlayClick}
    />
    
    {/* Container centralizador */}
    <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
      {/* Modal principal */}
      <div 
        className="bg-white rounded-[22px] w-full max-w-[1400px] max-h-[95vh] min-h-[700px] overflow-y-auto pointer-events-auto flex flex-col lg:flex-row"
        style={{ filter: 'none !important' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lado Esquerdo - Formulário */}
        <div className="flex-1 p-7 lg:pr-[21px] flex flex-col min-w-0 lg:min-w-[500px]">
          {/* Conteúdo do formulário */}
        </div>

        {/* Lado Direito - Preview */}
        <div className="w-full lg:w-[600px] lg:min-w-[500px] bg-white lg:rounded-r-[22px] rounded-b-[22px] lg:rounded-b-none pl-[20px] flex flex-col">
          <div className="w-full h-full bg-black lg:rounded-l-[16px] rounded-b-[22px] lg:rounded-b-none p-[35px] flex flex-col">
            {/* Conteúdo do preview */}
          </div>
        </div>
      </div>
    </div>
  </div>
);
```

### Características Essenciais

#### 1. **Sistema de Overlay**
- ✅ **Overlay separado**: `backdrop-blur-sm bg-black/30`
- ✅ **Pointer events**: `pointer-events-none/auto` para UX otimizada
- ✅ **Click outside**: Overlay fechável separado do modal

#### 2. **Layout Responsivo**
- ✅ **Mobile-first**: `flex-col lg:flex-row` (empilha verticalmente em mobile)
- ✅ **Breakpoints**: `lg:` para desktop, responsivo por padrão
- ✅ **Larguras flexíveis**: `flex-1` + `min-w-0` para evitar overflow
- ✅ **Larguras mínimas**: `lg:min-w-[500px]` para manter usabilidade

#### 3. **Sistema de Scroll**
- ✅ **Altura dinâmica**: `max-h-[95vh]` com `min-h-[700px]`
- ✅ **Scroll inteligente**: `overflow-y-auto` no container principal
- ✅ **Viewport consideration**: `max-h-[95vh]` deixa espaço para navigation

#### 4. **Estilização Consistente**
- ✅ **Bordas**: `rounded-[22px]` no container, `rounded-l-[16px]` no preview
- ✅ **Padding**: `p-7` no form, `p-[35px]` no preview
- ✅ **Cores**: Fundo branco no form, preto no preview
- ✅ **Filter fix**: `style={{ filter: 'none !important' }}` para evitar blur

### Implementações Atuais
- ✅ **CreateShopItemModal**: Padrão responsivo completo
- ✅ **CreateTaskModal**: Atualizado para seguir padrão responsivo
- 🔄 **Futuros modais**: Devem seguir este padrão

### Mobile Behavior
```css
/* Mobile (padrão) */
flex-col                    /* Empilha verticalmente */
rounded-b-[22px]           /* Bordas apropriadas */

/* Desktop (lg:) */
lg:flex-row                /* Layout horizontal */
lg:rounded-r-[22px]        /* Bordas específicas desktop */
lg:rounded-b-none          /* Remove bordas desnecessárias */
```

### Benefícios
- 📱 **Mobile-friendly**: Layout adaptável automático
- 🎨 **UX consistente**: Overlay blur e pointer events otimizados
- 📐 **Flexibilidade**: Suporta diferentes tamanhos de conteúdo
- 🔧 **Manutenibilidade**: Padrão reutilizável e documentado

## 📋 GenericForm - Componente de Formulários

### Props Disponíveis
```typescript
interface GenericFormProps {
  config: FormConfig                           // Configuração dos campos
  onSubmit: (data: Record<string, any>) => void // Callback de submit
  onCancel?: () => void                        // Callback de cancelar
  onChange?: (data: Record<string, any>) => void // Callback de mudança em tempo real
  isLoading?: boolean                          // Estado de loading
  initialData?: Record<string, any>            // Dados iniciais do formulário
  className?: string                           // Classes CSS adicionais
  hideTitle?: boolean                          // Oculta o título do formulário
  hideBorder?: boolean                         // Remove bordas, sombra e rounded
}
```

### Uso Básico
```typescript
// Formulário padrão com título e bordas
<GenericForm
  config={taskFormConfig}
  onSubmit={handleSubmit}
  onCancel={onCancel}
  onChange={handleChange}
/>

// Formulário sem título (para uso em modais)
<GenericForm
  config={taskFormConfig}
  onSubmit={handleSubmit}
  hideTitle={true}
/>

// Formulário sem bordas (para integração customizada)
<GenericForm
  config={taskFormConfig}
  onSubmit={handleSubmit}
  hideTitle={true}
  hideBorder={true}
  className="custom-styling"
/>
```

### Configuração de Campos
```typescript
// src/components/forms/form-configs.ts
export const taskFormConfig: FormConfig = {
  title: 'Create Task',
  submitLabel: 'Save',
  cancelLabel: 'Cancel',
  fields: [
    {
      name: 'title',
      label: 'Task Name',
      type: 'text',
      placeholder: 'Enter task name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    // ... mais campos
  ]
}
```

### Tipos de Campo Suportados
- ✅ **text**: Input de texto simples
- ✅ **email**: Input de email com validação
- ✅ **password**: Input de senha
- ✅ **number**: Input numérico
- ✅ **textarea**: Área de texto multi-linha
- ✅ **checkbox**: Checkbox booleano
- ✅ **select**: Dropdown com opções
- ✅ **radio**: Radio buttons com opções
- ✅ **image-upload**: Upload de imagem com preview
- ✅ **category-selector**: Seletor de categorias com criação inline

### Funcionalidades
- ✅ **Validação automática**: Required, minLength, maxLength, pattern, custom
- ✅ **Preview em tempo real**: Via prop `onChange`
- ✅ **Estado de loading**: Desabilita campos durante submit
- ✅ **Dados iniciais**: Para modo edição
- ✅ **Estilização flexível**: Props para ocultar elementos

## 🔄 Sistema de Hooks e APIs

### Arquitetura de Hooks
O projeto utiliza uma arquitetura baseada em hooks customizados que encapsulam a lógica de estado e comunicação com APIs.

#### Hook Base: `useApi<T>`
```typescript
// src/hooks/useApi.ts
export function useApi<T>(
  apiCall: () => Promise<T>,
  deps: any[] = []
): UseApiReturn<T>
```
**Funcionalidades:**
- ✅ **Estado gerenciado**: `data`, `loading`, `error`
- ✅ **Auto-refetch**: Dependências reativas
- ✅ **Método refetch**: Para atualizações manuais
- ✅ **Tratamento de erros**: Captura e formatação automática

### Hooks de Domínio

#### 🔐 `useAuth()` e `useAdmins()`
```typescript
// Autenticação
const { user, loading, login, logout, isAuthenticated } = useAuth()

// Gestão de admins (Super Admin only)
const { admins, createAdmin, updateAdmin, deleteAdmin } = useAdmins()
```
**Características:**
- ✅ **Persistência**: localStorage para token/user
- ✅ **Mock support**: Desenvolvimento com mock-token
- ✅ **Auto-redirect**: Login/logout automático
- ✅ **CRUD completo**: Create, Read, Update, Delete

#### 📋 `useTasks()` e `useTaskTypes()`
```typescript
// Gestão de tarefas
const { tasks, createTask, updateTask, deleteTask } = useTasks()

// Categorias de tarefas (filtradas por plataforma)
const { taskTypes } = useTaskTypes(socialMedia)
```
**Características:**
- ✅ **Auto-refetch**: Após mutações
- ✅ **Filtro por plataforma**: Discord, Twitter, etc
- ✅ **Mapeamento de plataforma**: X → TWITTER

#### 🏆 `useBadges()` e `useBadgeRequests()`
```typescript
// Gestão de badges
const { badges, createBadge, updateBadge, deleteBadge, assignBadge } = useBadges()

// Solicitações de badges
const { badgeRequests, approveRequest, rejectRequest } = useBadgeRequests()
```
**Características:**
- ✅ **CRUD completo**: Para badges
- ✅ **Atribuição**: Assign badge to user
- ✅ **Workflow de aprovação**: Approve/Reject requests
- ✅ **Filtro por usuário**: Badge requests por user ID

#### 🛍️ `useShopItems()`, `useShopCategories()`, `useStockMovements()`
```typescript
// Itens da loja
const { items, createItem, updateItem, deleteItem } = useShopItems()

// Categorias da loja
const { categories, createCategory } = useShopCategories()

// Movimentações de estoque
const { movements, createMovement } = useStockMovements()
```
**Características:**
- ✅ **Gestão completa de loja**: Items, categorias, estoque
- ✅ **Auto-refresh**: Após operações
- ✅ **Integração**: CategorySelector usa useShopCategories

### Padrão de Retorno dos Hooks
Todos os hooks seguem um padrão consistente:
```typescript
return {
  // Dados
  [entity]: data || [],
  loading,
  error,
  
  // Operações CRUD
  create[Entity]: async (data) => ({ success: boolean, error?: string }),
  update[Entity]: async (id, data) => ({ success: boolean, error?: string }),
  delete[Entity]: async (id) => ({ success: boolean, error?: string }),
  
  // Refresh manual
  refresh[Entity]: refetch
}
```

### Cliente API: `ApiClient`
```typescript
// src/lib/api.ts
export class ApiClient {
  private baseUrl: string
  private getAuthHeaders: () => Record<string, string>
}

export const api = new ApiClient()
```

#### Endpoints Disponíveis
**Autenticação:**
- `login(email, password)` → LoginResponse
- `getMe()` → User
- `logout()` → void

**Tarefas:**
- `getTasks()` → TasksResponse
- `getTaskCategories(platform?)` → TaskCategoriesResponse
- `createTask(data)`, `updateTask(id, data)`, `deleteTask(id)`

**Badges:**
- `getBadges()`, `getBadgeById(id)` → Badge[]
- `createBadge(data)`, `updateBadge(id, data)`, `deleteBadge(id)`
- `assignBadge(badgeId, userId)`

**Badge Requests:**
- `getBadgeRequests()`, `getBadgeRequestsByUser(userId)`
- `respondToBadgeRequest(data)`

**Loja:**
- `getShopItems()`, `createShopItem(data)`, `updateShopItem(id, data)`, `deleteShopItem(id)`
- `getShopCategories()`, `createShopCategory(data)`
- `getStockMovements()`, `createStockMovement(data)`

**Admins:**
- `getAdmins()` → GetAdminsResponse
- `createAdmin(data)`, `updateAdmin(id, data)`, `deleteAdmin(id)`

#### Características do Cliente API
- ✅ **Headers automáticos**: Content-Type e Authorization
- ✅ **Tratamento de erros**: Parse de JSON errors
- ✅ **Logging**: Console logs para debug
- ✅ **TypeScript**: Tipagem completa das respostas
- ✅ **Configurável**: Base URL via env var

### Padrão de Uso
```typescript
// 1. Importar hooks necessários
import { useBadges, useToast } from '@/hooks'

// 2. Usar no componente
const { badges, createBadge, loading } = useBadges()
const { showSuccess, showError } = useToast()

// 3. Implementar operações
const handleCreate = async (data) => {
  const result = await createBadge(data)
  if (result.success) {
    showSuccess('Badge criada!', `Badge "${data.title}" criada com sucesso`)
  } else {
    showError('Erro ao criar badge', result.error)
  }
}
```

### Sistema de Notificações
- ✅ **Toast Provider**: Context global para notificações
- ✅ **4 tipos**: success, error, warning, info
- ✅ **Auto-close**: 5 segundos configurável
- ✅ **Posicionamento**: Top-right com animações
- ✅ **Empilhamento**: Múltiplos toasts simultâneos

## 🔐 Autenticação
Sistema de autenticação implementado em `src/lib/auth.ts` com integração nas rotas protegidas do dashboard.

## 🎨 Assets
- **Imagens**: `public/assets/` (30+ SVGs e PNGs)
- **Fontes**: `public/fonts/` (Família Campton)
- **Organização**: Por tipo e funcionalidade

# API Documentation - Backend Admin

## Base URL
```
http://localhost:3000/api
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
**Authentication:** Optional
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

## Badge Routes (`/badges`)

### GET `/badges`
**Description:** Get all badges
**Authentication:** Not required
**Response:**
```typescript
// Success (200)
Array<{
  badgeId: string;
  name: string;
  title: string;
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

### GET `/badges/:id`
**Description:** Get badge by ID
**Authentication:** Not required
**Response:**
```typescript
// Success (200)
{
  badgeId: string;
  name: string;
  title: string;
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

### POST `/badges`
**Description:** Create new badge
**Authentication:** Required
**Request Body:** Form data with fields:
```typescript
{
  name: string;
  title: string;
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
    name: string;
    title: string;
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

### PUT `/badges/:id`
**Description:** Update badge
**Authentication:** Required
**Request Body:** Form data with optional fields:
```typescript
{
  name?: string;
  title?: string;
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
    name: string;
    title: string;
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

### DELETE `/badges/:id`
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

### POST `/badges/assign/badgeId/:badgeId/userId/:userId`
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

## Task Routes (`/tasks`)

### GET `/tasks/types`
**Description:** Get all task types
**Authentication:** Not required
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

### POST `/tasks`
**Description:** Create new task
**Authentication:** Required
**Request Body:**
```typescript
{
  name: string;
  description?: string;
  link?: string;
  points?: number;
  deadline: string; // ISO date string
  type: 'TWITTER_LIKE' | 'TWITTER_COMMENT' | 'TWITTER_RETWEET' | 'TWITTER_PFP' | 'DISCORD_TOWNHALL_PRESENCE';
  isDaily?: boolean;
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
    type: string;
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

### GET `/tasks`
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
    type: string;
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

### GET `/tasks/:id`
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
    type: string;
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

### PUT `/tasks/:id`
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
  type?: 'TWITTER_LIKE' | 'TWITTER_COMMENT' | 'TWITTER_RETWEET' | 'TWITTER_PFP' | 'DISCORD_TOWNHALL_PRESENCE';
  isDaily?: boolean;
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
    type: string;
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

### DELETE `/tasks/:id`
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

## Shop Item Routes (`/shop-items`)

### POST `/shop-items`
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

### GET `/shop-items`
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

### GET `/shop-items/:id`
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

### PUT `/shop-items/:id`
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

### DELETE `/shop-items/:id`
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

## Shop Item Category Routes (`/shop-item-categories`)

### POST `/shop-item-categories`
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

### GET `/shop-item-categories`
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

### GET `/shop/item-categories/:id`
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

### PUT `/shop-item-categories/:id`
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

### DELETE `/shop-item-categories/:id`
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

## Stock Movement Routes (`/stock-movements`)

### POST `/stock-movements`
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

### GET `/stock-movements`
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

### GET `/stock-movements/:id`
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

### POST `/stock-movements/:id/reverse`
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
  badgeRequestId: string;
  userId: string;
  badgeId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  responseDate?: string;
  adminId?: string;
  createdAt: string;
  updatedAt: string;
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
Array<{
  badgeRequestId: string;
  userId: string;
  badgeId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  responseDate?: string;
  adminId?: string;
  createdAt: string;
  updatedAt: string;
}>

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
  badgeRequestId: string;
  status: 'APPROVED' | 'REJECTED';
  adminNote?: string;
}
```
**Response:**
```typescript
// Success (200)
{
  message: string;
  badgeRequest: {
    badgeRequestId: string;
    userId: string;
    badgeId: string;
    status: 'APPROVED' | 'REJECTED';
    requestDate: string;
    responseDate: string;
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
- devemos usar para o item categories a rota shop/item-category