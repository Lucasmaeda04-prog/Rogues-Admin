import { useCallback } from 'react'
import { api } from '@/lib/api'
import { useApi } from './useApi'
import type { BadgeRequestResponseData } from '@/types'

export function useBadgeRequests() {
  const { data: badgeRequests, loading, error, refetch } = useApi(() => api.getBadgeRequests())

  const respondToRequest = useCallback(async (requestData: BadgeRequestResponseData) => {
    try {
      await api.respondToBadgeRequest(requestData)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to respond to badge request' 
      }
    }
  }, [refetch])

  const approveRequest = useCallback(async (badgeRequestId: string, adminNote?: string) => {
    return respondToRequest({
      badgeRequestId,
      status: 'APPROVED',
      adminNote
    })
  }, [respondToRequest])

  const rejectRequest = useCallback(async (badgeRequestId: string, adminNote?: string) => {
    return respondToRequest({
      badgeRequestId,
      status: 'REJECTED',
      adminNote
    })
  }, [respondToRequest])

  const getBadgeRequestsByUser = useCallback(async (userId: string) => {
    try {
      const requests = await api.getBadgeRequestsByUser(userId)
      return { success: true, data: requests }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to get user badge requests' 
      }
    }
  }, [])

  return {
    badgeRequests: badgeRequests || [],
    loading,
    error,
    approveRequest,
    rejectRequest,
    respondToRequest,
    getBadgeRequestsByUser,
    refreshRequests: refetch
  }
}