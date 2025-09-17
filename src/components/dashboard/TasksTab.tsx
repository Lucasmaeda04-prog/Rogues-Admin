'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ArrowUpDown } from 'lucide-react'
import { useTasks, useTaskPlatforms, useTaskTypes } from '@/hooks'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import { getTaskCategoryInfo } from '@/lib/taskUtils'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
  
  // Filters and sorting state
  const [filters, setFilters] = useState({
    socialMedia: 'all',
    taskType: 'all',
    author: 'all',
    dateFrom: '',
    dateTo: ''
  })
  
  const [sorting, setSorting] = useState({
    field: 'createdAt',
    order: 'desc' as 'asc' | 'desc'
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
        verificationSteps: data.verificationSteps || ''
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
    // Derive social media from task category
    const categoryInfo = getTaskCategoryInfo(task.taskCategoryId as number, taskCategories)
    const socialMediaDerived = categoryInfo.network === 'twitter' ? 'X' : 'discord'
    // Converter dados da task para TaskFormData
    const editData: TaskFormData = {
      title: task.name as string,
      description: (task.description as string) || '',
      verificationSteps: (task.verificationSteps as string) || '',
      rewards: task.points as number,
      taskType: task.isDaily ? 'daily' : 'one-time',
      deadline: task.isDaily ? '' : new Date(task.deadline as string).toLocaleDateString('pt-BR'),
      taskCategoryId: task.taskCategoryId as number,
      socialMedia: socialMediaDerived,
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
      socialMediaOptions = [...new Set(
        taskCategories
          .map(category => category.plataform.toLowerCase())
          .filter(platform => platform && platform !== 'unknown')
      )]
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

  // Filter and sort tasks based on current filters and sorting
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      const categoryInfo = getTaskCategoryInfo(task.taskCategoryId, taskCategories)
      const author = task.admin?.name || task.admin?.email || 'Unknown'
      const createdDate = new Date(task.createdAt)
      
      const socialMatch = filters.socialMedia === 'all' || categoryInfo.network === filters.socialMedia
      const typeMatch = filters.taskType === 'all' || 
        (filters.taskType === 'daily' && task.isDaily) ||
        (filters.taskType === 'one-time' && !task.isDaily)
      const authorMatch = filters.author === 'all' || author === filters.author
      
      // Date filters
      const dateFromMatch = !filters.dateFrom || createdDate >= new Date(filters.dateFrom)
      const dateToMatch = !filters.dateTo || createdDate <= new Date(filters.dateTo + 'T23:59:59')
      
      return socialMatch && typeMatch && authorMatch && dateFromMatch && dateToMatch
    })
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number
      
      switch (sorting.field) {
        case 'completions':
          aValue = a._count?.taskCompletions || 0
          bValue = b._count?.taskCompletions || 0
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'points':
          aValue = a.points
          bValue = b.points
          break
        default:
          aValue = a.createdAt
          bValue = b.createdAt
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      return sorting.order === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })
  }, [tasks, filters, taskCategories, sorting])

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
      author: 'all',
      dateFrom: '',
      dateTo: ''
    })
  }
  
  const handleSortChange = (field: string) => {
    setSorting(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  const getSortIcon = (field: string) => {
    if (sorting.field !== field) return <ArrowUpDown className="w-4 h-4 opacity-50" />
    return <ArrowUpDown className={`w-4 h-4 ${sorting.order === 'asc' ? 'rotate-180' : ''}`} />
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
            All tasks models ({filteredAndSortedTasks.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            <Select value={filters.socialMedia} onValueChange={(value) => handleFilterChange('socialMedia', value)}>
              <SelectTrigger className="w-[180px] shadow-md rounded-xl font-light hover:shadow-lg transition-shadow" style={{borderColor: 'rgba(148, 145, 145, 1)'}}>
                <SelectValue placeholder="All Social Media" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Social Media</SelectItem>
                {filterOptions.socialMedia.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform === 'twitter' ? 'X (Twitter)' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.taskType} onValueChange={(value) => handleFilterChange('taskType', value)}>
              <SelectTrigger className="w-[140px] shadow-md rounded-xl font-light hover:shadow-lg transition-shadow" style={{borderColor: 'rgba(148, 145, 145, 1)'}}>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.author} onValueChange={(value) => handleFilterChange('author', value)}>
              <SelectTrigger className="w-[150px] shadow-md rounded-xl font-light hover:shadow-lg transition-shadow" style={{borderColor: 'rgba(148, 145, 145, 1)'}}>
                <SelectValue placeholder="All Authors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {filterOptions.authors.map(author => (
                  <SelectItem key={author} value={author}>{author}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              placeholder="From date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-[150px] shadow-md rounded-xl font-light hover:shadow-lg transition-shadow"
              style={{borderColor: 'rgba(148, 145, 145, 1)'}}
            />
            
            <Input
              type="date"
              placeholder="To date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-[150px] shadow-md rounded-xl font-light hover:shadow-lg transition-shadow"
              style={{borderColor: 'rgba(148, 145, 145, 1)'}}
            />
            
            {(filters.socialMedia !== 'all' || filters.taskType !== 'all' || filters.author !== 'all' || filters.dateFrom || filters.dateTo) && (
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 shadow-md rounded-xl font-light hover:shadow-lg transition-all"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        <Button 
          onClick={handleOpenCreateModal} 
          className="shadow-md rounded-xl font-semibold hover:shadow-lg transition-all"
          style={{
            backgroundColor: '#1e40af',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1e3a8a'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1e40af'
            e.currentTarget.style.color = 'white'
          }}
        >
          + Create Task
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('name')}>
                  Name {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead className="w-20">Social</TableHead>
              <TableHead>Action Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24">Task Type</TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('points')}>
                  Reward {getSortIcon('points')}
                </Button>
              </TableHead>
              <TableHead className="w-32">Deadline</TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('completions')}>
                  Completions {getSortIcon('completions')}
                </Button>
              </TableHead>
              <TableHead className="w-48">Link</TableHead>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-light shadow-sm rounded-lg hover:shadow-md transition-all" onClick={() => handleSortChange('createdAt')}>
                  Created {getSortIcon('createdAt')}
                </Button>
              </TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="h-24 text-center text-gray-500">
                  {tasks.length === 0 ? 'No tasks found' : 'No tasks match the current filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTasks.map((task, index) => {
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
