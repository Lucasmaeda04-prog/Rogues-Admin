import { useCallback } from 'react'
import { api } from '@/lib/api'
import { useApi } from './useApi'
import type { ShopCategory, StockMovement, CreateShopCategoryData, CreateStockMovementData } from '@/types'

export function useShopItems() {
  const { data, loading, error, refetch } = useApi(() => api.getShopItems())

  const createItem = useCallback(async (itemData: {
    name: string
    description?: string
    price: number
    categoryId: number
    imageUrl?: string
  }) => {
    try {
      await api.createShopItem(itemData)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create item' 
      }
    }
  }, [refetch])

  const updateItem = useCallback(async (id: string, itemData: {
    name?: string
    description?: string
    price?: number
    categoryId?: number 
    imageUrl?: string
  }) => {
    try {
      await api.updateShopItem(id, itemData)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update item' 
      }
    }
  }, [refetch])

  const deleteItem = useCallback(async (id: string) => {
    try {
      await api.deleteShopItem(id)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete item' 
      }
    }
  }, [refetch])

  return {
    items: data || [],
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refreshItems: refetch
  }
}

export function useShopCategories() {
  const { data, loading, error, refetch } = useApi(() => api.getShopCategories())

  const createCategory = useCallback(async (categoryData: CreateShopCategoryData) => {
    try {
      await api.createShopCategory(categoryData)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create category' 
      }
    }
  }, [refetch])

  return {
    categories: data || [],
    loading,
    error,
    createCategory,
    refreshCategories: refetch
  }
}

export function useStockMovements() {
  const { data, loading, error, refetch } = useApi(() => api.getStockMovements())

  const createMovement = useCallback(async (movementData: CreateStockMovementData) => {
    try {
      await api.createStockMovement(movementData)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create movement' 
      }
    }
  }, [refetch])

  return {
    movements: data || [],
    loading,
    error,
    createMovement,
    refreshMovements: refetch
  }
}