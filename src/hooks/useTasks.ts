import { useCallback } from 'react'
import { api } from '@/lib/api'
import { useApi } from './useApi'
import type { CreateTaskData } from '@/types'

export function useTasks() {
  const { data: tasksResponse, loading, error, refetch } = useApi(() => api.getTasks())

  const createTask = useCallback(async (taskData: CreateTaskData) => {
    try {
      await api.createTask(taskData)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create task' 
      }
    }
  }, [refetch])

  const updateTask = useCallback(async (id: string, taskData: Partial<CreateTaskData>) => {
    try {
      await api.updateTask(id, taskData)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update task' 
      }
    }
  }, [refetch])

  const deleteTask = useCallback(async (id: string) => {
    try {
      await api.deleteTask(id)
      await refetch()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete task' 
      }
    }
  }, [refetch])

  return {
    tasks: tasksResponse?.tasks || [],
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: refetch
  }
}

export function useTaskTypes(socialMedia?: string) {
  // Map social media to platform
  const platformMap: Record<string, string> = {
    'discord': 'DISCORD',
    'X': 'TWITTER'
  };
  
  const targetPlatform = socialMedia ? platformMap[socialMedia] : undefined;
  
  const { data: categoriesResponse, loading, error, refetch } = useApi(
    () => api.getTaskCategories(targetPlatform),
    [targetPlatform]
  )

  return {
    taskTypes: categoriesResponse?.categories || [],
    loading,
    error,
    refreshTaskTypes: refetch
  }
}

export function useTaskPlatforms() {
  const { data: platformsResponse, loading, error, refetch } = useApi(
    () => api.getTaskPlatforms()
  )

  return {
    platforms: platformsResponse?.values || [],
    loading,
    error,
    refreshPlatforms: refetch
  }
}