'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTasks, useTaskTypes } from '@/hooks'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import { getTaskSocialInfo } from '@/lib/taskUtils'
import CreateTaskModal, { TaskFormData } from '@/components/modals/CreateTaskModal'
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal'
import { convertToTimestamp } from '@/lib/dateUtils'
import { useToast } from '@/components/ui/ToastProvider'

export default function TasksTab() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const { taskTypes } = useTaskTypes()
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

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">All tasks models</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>Action</option>
            </select>
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>Actions</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Create Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Social</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completions</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task, index) => {
              const socialInfo = getTaskSocialInfo(task.type)
              
              return (
                <tr key={task.taskId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-center">
                      <Image
                        src={socialInfo.icon}
                        alt={socialInfo.displayName}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600">{socialInfo.action}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.description || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {task.isDaily ? 'Daily' : 'One-time'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.points} Points</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{new Date(task.deadline).toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task._count?.taskCompletions || 0}</td>
                  <td className="px-4 py-3 text-sm text-blue-600">{task.link || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.admin?.name || task.admin?.email || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
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
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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