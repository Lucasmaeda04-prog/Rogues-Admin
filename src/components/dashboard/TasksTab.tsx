'use client'

import { useTasks } from '@/hooks'
import { EditIcon, DeleteIcon } from '@/components/Icons'

export default function TasksTab() {
  const { tasks } = useTasks()

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
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conclusion</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Creation</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task, index) => (
              <tr key={task.taskId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.name}</td>
                <td className="px-4 py-3 text-sm text-blue-600">{task.type}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.description || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {task.isDaily ? 'Daily' : 'One-time'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.points} Points</td>
                <td className="px-4 py-3 text-sm text-gray-900">{new Date(task.deadline).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{task._count.taskCompletions}</td>
                <td className="px-4 py-3 text-sm text-blue-600">{task.link || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.admin.name || task.admin.email}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}