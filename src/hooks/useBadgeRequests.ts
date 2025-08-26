import { useCallback } from 'react'
import { api } from '@/lib/api'
import { useApi } from './useApi'
import type { BadgeRequestResponseData } from '@/types'

export function useBadgeRequests() {
  const { data: badgeRequests, loading, error, refetch } = useApi(() => api.getBadgeRequests())

  const respondToRequest = useCallback(async (requestData: BadgeRequestResponseData) => {
    try {
      const response = await api.respondToBadgeRequest(requestData)
      console.log('Badge request response:', response) // Debug log
      await refetch()
      
      // Check if response is empty (common with 204 No Content responses)
      if (!response || Object.keys(response).length === 0) {
        console.log('Empty response received - operation likely successful')
        return { 
          success: true, 
          data: null,
          id: requestData.id
        }
      }
      
      // Check if badgeRequest exists in response
      if (!response.badgeRequest) {
        console.warn('Badge request response missing badgeRequest field:', response)
        return { 
          success: true, 
          data: null,
          id: requestData.id // Fallback to original request ID
        }
      }
      
      return { 
        success: true, 
        data: response.badgeRequest,
        id: response.badgeRequest.id || requestData.id // Fallback to request ID if response ID is missing
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to respond to badge request' 
      }
    }
  }, [refetch])

  const approveRequest = useCallback(async (badgeRequestId: string, adminNote?: string) => {
    return respondToRequest({
      id: badgeRequestId,
      status: 'ACCEPTED',
      adminNote
    })
  }, [respondToRequest])

  const rejectRequest = useCallback(async (badgeRequestId: string, adminNote?: string) => {
    return respondToRequest({
      id: badgeRequestId,
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