'use client'

import { useState, useEffect } from 'react'
import { useShopCategories } from '@/hooks/useShop'
import { useToast } from '@/components/ui/ToastProvider'
import { Plus, ChevronDown } from 'lucide-react'
import { Campton } from '@/lib/fonts'
import { cn } from '@/lib/cn'

interface CategorySelectorProps {
  value?: string | number
  onChange: (value: string | number) => void
  error?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

export function CategorySelector({ value, onChange, error, label, required, disabled = false }: CategorySelectorProps) {
  const { categories, loading, createCategory } = useShopCategories()
  const { showSuccess, showError } = useToast()
  
  const [isCreating, setIsCreating] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Sync with external value
  useEffect(() => {
    if (value) {
      setSelectedCategoryId(value)
    }
  }, [value])

  const handleCategorySelect = (categoryId: string | number) => {
    if (disabled) return
    setSelectedCategoryId(categoryId)
    onChange(categoryId)
    setIsDropdownOpen(false)
  }

  const handleCreateCategory = async () => {
    if (disabled) return
    if (!newCategoryName.trim()) {
      showError('Nome inválido', 'Digite um nome para a nova categoria')
      return
    }

    setIsCreating(true)
    try {
      const result = await createCategory({ name: newCategoryName.trim() })
      
      if (result.success) {
        showSuccess('Categoria criada!', `Categoria "${newCategoryName}" foi criada com sucesso`)
        setNewCategoryName('')
        setIsCreating(false)
        // The categories will be refreshed automatically by the hook
      } else {
        showError('Erro ao criar categoria', result.error || 'Falha ao criar categoria')
        setIsCreating(false)
      }
    } catch {
      showError('Erro inesperado', 'Ocorreu um erro ao criar a categoria')
      setIsCreating(false)
    }
  }

  const selectedCategory = categories.find(cat => 
    cat.shopItemCategoryId === Number(selectedCategoryId)
  )

  if (loading) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className={cn(
          "block text-[#4b4b4b] text-[18px] font-medium",
          Campton.className
        )}>
          {label} {required && '*'}
        </label>
      )}

      {/* Category Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (disabled) return
            setIsDropdownOpen(!isDropdownOpen)
          }}
          className={`
            relative w-full bg-white border rounded-md px-3 py-2.5 text-left shadow-sm h-[47px]
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${!selectedCategory ? 'text-gray-500' : 'text-gray-900'}
            ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
          `}
        >
          <span className="block truncate">
            {selectedCategory ? selectedCategory.name : 'Selecione uma categoria'}
          </span>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        </button>

        {isDropdownOpen && !disabled && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
            {/* Existing Categories */}
            <div className="py-1">
              {categories.map((category) => (
                <button
                  key={category.shopItemCategoryId}
                  type="button"
                  onClick={() => handleCategorySelect(category.shopItemCategoryId)}
                  className={`
                    w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                    ${selectedCategoryId === category.shopItemCategoryId ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                  `}
                >
                  {category.name}
                </button>
              ))}
              
              {categories.length === 0 && (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Nenhuma categoria encontrada
                </div>
              )}
            </div>

            {/* Create New Category Section */}
            <div className="border-t border-gray-200 p-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nova categoria..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateCategory()
                    }
                  }}
                  disabled={disabled}
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={disabled || isCreating || !newCategoryName.trim()}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-3 w-3" />
                  {isCreating ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
