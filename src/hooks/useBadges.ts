import { useCallback } from 'react'
import { api } from '@/lib/api'
import { useApi } from './useApi'
import type { CreateBadgeData } from '@/types'

export function useBadges() {
  const { data, loading, error, refetch } = useApi(() => api.getBadges())

  const createBadge = useCallback(async (badgeData: CreateBadgeData) => {
    try {
      await api.createBadge(badgeData)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create badge' 
      }
    }
  }, [refetch])

  const updateBadge = useCallback(async (id: string, badgeData: {
    name?: string
    title?: string
    description?: string
    criteria?: string
    image?: string
  }) => {
    try {
      await api.updateBadge(id, badgeData)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update badge' 
      }
    }
  }, [refetch])

  const deleteBadge = useCallback(async (id: string) => {
    try {
      await api.deleteBadge(id)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete badge' 
      }
    }
  }, [refetch])

  const assignBadge = useCallback(async (badgeId: string, userId: string) => {
    try {
      await api.assignBadge(badgeId, userId)
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to assign badge' 
      }
    }
  }, [])

  return {
    badges: data || [],
    loading,
    error,
    createBadge,
    updateBadge,
    deleteBadge,
    assignBadge,
    refreshBadges: refetch
  }
}