'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTasks, useTaskTypes } from '@/hooks'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import { getTaskSocialInfo } from '@/lib/taskUtils'
import CreateTaskModal, { TaskFormData } from '@/components/modals/CreateTaskModal'
import { convertToTimestamp } from '@/lib/dateUtils'
import type { TaskType } from '@/types'

export default function TasksTab() {
  const { tasks, createTask } = useTasks()
  const { taskTypes } = useTaskTypes()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateTask = async (data: TaskFormData) => {
    console.log('Creating task with form data:', data)
    setIsLoading(true)
    
    try {
      console.log('Creating task with form data:', data)
      console.log('Available task types:', taskTypes)
      console.log('Selected task type from form:', data.type)
      
      // Usar o tipo selecionado diretamente do formulário
      const taskType = data.type || 'DISCORD_TOWNHALL_PRESENCE' // fallback
      
      // Criar a task via hook (que já faz refetch automático)
      const createTaskData = {
        name: data.title,
        description: data.description,
        points: data.rewards,
        deadline: data.taskType === 'daily' 
          ? new Date().toISOString().slice(0, 19).replace('T', ' ') 
          : convertToTimestamp(data.deadline || ''), // Converter deadline brasileiro para formato MySQL
        type: taskType as TaskType,
        isDaily: data.taskType === 'daily', // Converter taskType para boolean
        link: data.link || '', // Link opcional da task
      }

      console.log('Sending to API:', createTaskData)
      const result = await createTask(createTaskData)
      
      if (result.success) {
        console.log('Task created successfully')
        setIsCreateModalOpen(false)
      } else {
        console.error('Error creating task:', result.error)
        alert(`Erro ao criar task: ${result.error}`)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Erro inesperado ao criar task')
    } finally {
      setIsLoading(false)
    }
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
          onClick={() => setIsCreateModalOpen(true)}
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
                      <button className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors">
                        <EditIcon width={16} height={16} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors">
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

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={isLoading}
        mode="create"
      />
    </div>
  )
}