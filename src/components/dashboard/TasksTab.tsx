'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useTasks, useTaskPlatforms, useTaskTypes } from '@/hooks'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import { getTaskSocialInfo, getTaskCategoryInfo } from '@/lib/taskUtils'
import CreateTaskModal, { TaskFormData } from '@/components/modals/CreateTaskModal'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'
import { convertToTimestamp } from '@/lib/dateUtils'
import { useToast } from '@/components/ui/ToastProvider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TasksTab() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const { platforms } = useTaskPlatforms() // Buscar plataformas disponíveis
  const { taskTypes: taskCategories } = useTaskTypes() // Buscar categorias para mapeamento
  const { showSuccess, showError } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskFormData | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    taskId?: string
    taskName?: string
  }>({ isOpen: false })
  
  // Filters state
  const [filters, setFilters] = useState({
    socialMedia: 'all',
    taskType: 'all',
    author: 'all'
  })

  const handleSubmitTask = async (data: TaskFormData) => {
    console.log(`${modalMode === 'edit' ? 'Updating' : 'Creating'} task with form data:`, data)
    setIsLoading(true)
    
    try {
      // Preparar dados da task para API
      const taskData = {
        name: data.title,
        description: data.description,
        points: data.rewards,
        deadline: data.taskType === 'daily' 
          ? new Date().toISOString().slice(0, 19).replace('T', ' ') 
          : convertToTimestamp(data.deadline || ''),
        taskCategoryId: data.taskCategoryId,
        isDaily: data.taskType === 'daily',
        link: data.link || '',
      }

      console.log('Sending to API:', taskData)
      
      let result
      if (modalMode === 'edit' && editingTask) {
        // Encontrar o ID da task sendo editada
        const taskToEdit = tasks.find(t => t.name === editingTask.title)
        if (taskToEdit) {
          result = await updateTask(taskToEdit.taskId, taskData)
        } else {
          throw new Error('Task not found for editing')
        }
      } else {
        result = await createTask(taskData)
      }
      
      if (result.success) {
        console.log(`Task ${modalMode === 'edit' ? 'updated' : 'created'} successfully`)
        showSuccess(
          `Task ${modalMode === 'edit' ? 'atualizada' : 'criada'}!`,
          `Task "${data.title}" foi ${modalMode === 'edit' ? 'atualizada' : 'criada'} com sucesso`
        )
        handleCloseModal()
      } else {
        console.error(`Error ${modalMode === 'edit' ? 'updating' : 'creating'} task:`, result.error)
        showError(
          `Erro ao ${modalMode === 'edit' ? 'atualizar' : 'criar'} task`,
          result.error
        )
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      showError(
        'Erro inesperado',
        `Ocorreu um erro ao ${modalMode === 'edit' ? 'atualizar' : 'criar'} a task`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTask = (task: Record<string, unknown>) => {
    // Converter dados da task para TaskFormData
    const editData: TaskFormData = {
      title: task.name as string,
      description: (task.description as string) || '',
      verificationSteps: '', // Campo obrigatório, deixar vazio para edição
      rewards: task.points as number,
      taskType: task.isDaily ? 'daily' : 'one-time',
      deadline: task.isDaily ? '' : new Date(task.deadline as string).toLocaleDateString('pt-BR'),
      taskCategoryId: task.taskCategoryId as number,
      socialMedia: task.type as string, // Manter a rede social original
      link: (task.link as string) || ''
    }
    
    setEditingTask(editData)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleDeleteClick = (task: Record<string, unknown>) => {
    setDeleteModal({
      isOpen: true,
      taskId: task.taskId as string,
      taskName: task.name as string
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.taskId) return
    
    setIsLoading(true)
    
    try {
      const result = await deleteTask(deleteModal.taskId)
      if (result.success) {
        console.log('Task deleted successfully')
        showSuccess(
          'Task excluída!',
          `Task "${deleteModal.taskName}" foi excluída com sucesso`
        )
        setDeleteModal({ isOpen: false })
      } else {
        console.error('Error deleting task:', result.error)
        showError(
          'Erro ao excluir task',
          result.error
        )
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      showError(
        'Erro inesperado',
        'Ocorreu um erro ao excluir a task'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false })
  }

  const handleOpenCreateModal = () => {
    setEditingTask(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
    setModalMode('create')
  }

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    // Use platforms from backend, fallback to existing tasks
    let socialMediaOptions: string[] = []
    
    if (platforms && platforms.length > 0) {
      // Use backend platforms: ["DISCORD", "TWITTER"] -> ["discord", "twitter"]
      socialMediaOptions = platforms.map(platform => platform.toLowerCase())
    } else if (taskCategories && taskCategories.length > 0) {
      // Use task categories platforms as fallback
      socialMediaOptions = [...new Set(taskCategories.map(category => 
        category.plataform?.toLowerCase() || 'unknown'
      ).filter(platform => platform !== 'unknown'))]
    } else {
      // Final fallback to existing tasks platforms
      socialMediaOptions = [...new Set(tasks.map(task => {
        const categoryInfo = getTaskCategoryInfo(task.taskCategoryId, taskCategories)
        return categoryInfo.network
      }))]
    }
    
    const authorOptions = [...new Set(tasks.map(task => 
      task.admin?.name || task.admin?.email || 'Unknown'
    ))]
    
    return {
      socialMedia: socialMediaOptions,
      authors: authorOptions
    }
  }, [platforms, taskCategories, tasks])

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const categoryInfo = getTaskCategoryInfo(task.taskCategoryId, taskCategories)
      const author = task.admin?.name || task.admin?.email || 'Unknown'
      
      const socialMatch = filters.socialMedia === 'all' || categoryInfo.network === filters.socialMedia
      const typeMatch = filters.taskType === 'all' || 
        (filters.taskType === 'daily' && task.isDaily) ||
        (filters.taskType === 'one-time' && !task.isDaily)
      const authorMatch = filters.author === 'all' || author === filters.author
      
      return socialMatch && typeMatch && authorMatch
    })
  }, [tasks, filters, taskCategories])

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      socialMedia: 'all',
      taskType: 'all',
      author: 'all'
    })
  }

  // Truncate link function
  const truncateLink = (link: string, maxLength: number = 30) => {
    if (!link || link.length <= maxLength) return link || 'N/A'
    return link.substring(0, maxLength) + '...'
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All tasks models ({filteredTasks.length})
          </h2>
          <div className="flex space-x-2">
            <select 
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.socialMedia}
              onChange={(e) => handleFilterChange('socialMedia', e.target.value)}
            >
              <option value="all">All Social Media</option>
              {filterOptions.socialMedia.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'twitter' ? 'X (Twitter)' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>
            
            <select 
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.taskType}
              onChange={(e) => handleFilterChange('taskType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="daily">Daily</option>
              <option value="one-time">One-time</option>
            </select>
            
            <select 
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.author}
              onChange={(e) => handleFilterChange('author', e.target.value)}
            >
              <option value="all">All Authors</option>
              {filterOptions.authors.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
            
            {(filters.socialMedia !== 'all' || filters.taskType !== 'all' || filters.author !== 'all') && (
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                title="Clear all filters"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Create Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-20">Social</TableHead>
              <TableHead>Action Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24">Task Type</TableHead>
              <TableHead className="w-24">Reward</TableHead>
              <TableHead className="w-32">Deadline</TableHead>
              <TableHead className="w-20">Completions</TableHead>
              <TableHead className="w-48">Link</TableHead>
              <TableHead className="w-24">Created</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="h-24 text-center text-gray-500">
                  {tasks.length === 0 ? 'No tasks found' : 'No tasks match the current filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task, index) => {
                const categoryInfo = getTaskCategoryInfo(task.taskCategoryId, taskCategories)
                
                return (
                  <TableRow key={task.taskId}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Image
                          src={categoryInfo.icon}
                          alt={categoryInfo.displayName}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-600">{categoryInfo.actionDisplay}</TableCell>
                    <TableCell>{task.description || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {task.isDaily ? 'Daily' : 'One-time'}
                      </span>
                    </TableCell>
                    <TableCell>{task.points} Points</TableCell>
                    <TableCell>{new Date(task.deadline).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{task._count?.taskCompletions || 0}</TableCell>
                    <TableCell title={task.link || 'N/A'}>
                      {task.link ? (
                        <a 
                          href={task.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {truncateLink(task.link)}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{new Date(task.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{task.admin?.name || task.admin?.email || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditTask(task as unknown as Record<string, unknown>)}
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title="Edit task"
                        >
                          <EditIcon width={16} height={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(task as unknown as Record<string, unknown>)}
                          className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                          title="Delete task"
                        >
                          <DeleteIcon width={16} height={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        isLoading={isLoading}
        editData={editingTask}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task ?"
        itemName={deleteModal.taskName}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isLoading}
        loadingText="Deleting task..."
      />
    </div>
  )
}