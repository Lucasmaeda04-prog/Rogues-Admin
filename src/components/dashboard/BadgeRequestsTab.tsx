'use client'

import { useState } from 'react'
import { Paperclip } from 'lucide-react'
import { useBadgeRequests } from '@/hooks'
import BadgeRequestActionModal from '@/components/modals/BadgeRequestActionModal'
import { useToast } from '@/components/ui/ToastProvider'
import type { BadgeRequest } from '@/types'

export default function BadgeRequestsTab() {
  const { badgeRequests, loading, error, approveRequest, rejectRequest } = useBadgeRequests()
  const { showSuccess, showError } = useToast()
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<BadgeRequest | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const handleOpenModal = (request: BadgeRequest) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRequest(null)
  }

  const handleApprove = async (badgeRequestId: string): Promise<{ success: boolean; error?: string }> => {
    setProcessingRequest(badgeRequestId)
    try {
      const result = await approveRequest(badgeRequestId)
      if (result.success) {
        console.log('Badge request approved successfully')
        showSuccess('Solicitação aprovada!', 'A solicitação de badge foi aprovada com sucesso')
      } else {
        console.error('Error approving badge request:', result.error)
        showError('Erro ao aprovar', result.error || 'Falha ao aprovar solicitação')
      }
      return result
    } catch (error) {
      console.error('Unexpected error:', error)
      showError('Erro inesperado', 'Ocorreu um erro ao aprovar a solicitação')
      return { success: false, error: 'Erro inesperado' }
    } finally {
      setProcessingRequest(null)
    }
  }

  const handleReject = async (badgeRequestId: string): Promise<{ success: boolean; error?: string }> => {
    setProcessingRequest(badgeRequestId)
    try {
      const result = await rejectRequest(badgeRequestId)
      if (result.success) {
        console.log('Badge request rejected successfully')
        showSuccess('Solicitação rejeitada!', 'A solicitação de badge foi rejeitada com sucesso')
      } else {
        console.error('Error rejecting badge request:', result.error)
        showError('Erro ao rejeitar', result.error || 'Falha ao rejeitar solicitação')
      }
      return result
    } catch (error) {
      console.error('Unexpected error:', error)
      showError('Erro inesperado', 'Ocorreu um erro ao rejeitar a solicitação')
      return { success: false, error: 'Erro inesperado' }
    } finally {
      setProcessingRequest(null)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100'
      case 'APPROVED':
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100'
      case 'REJECTED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente'
      case 'APPROVED':
        return 'Aprovado'
      case 'ACCEPTED':
        return 'Aceito'
      case 'REJECTED':
        return 'Rejeitado'
      default:
        return status || 'Desconhecido'
    }
  }

  // Filter badge requests based on status
  const filteredBadgeRequests = badgeRequests.filter(request => {
    if (statusFilter === 'all') return true
    return request.status?.toUpperCase() === statusFilter.toUpperCase()
  })

  if (loading) {
    return <div className="flex justify-center py-8">Carregando solicitações de badges...</div>
  }

  if (error) {
    return <div className="text-red-600 py-8">Erro ao carregar solicitações: {error}</div>
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Badge Requests ({filteredBadgeRequests.length})
          </h2>
          <div className="flex space-x-2">
            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBadgeRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  {statusFilter === 'all'
                    ? 'Nenhuma solicitação de badge encontrada'
                    : `Nenhuma solicitação com status "${getStatusLabel(statusFilter)}"`
                  }
                </td>
              </tr>
            ) : (
              filteredBadgeRequests.map((request, index) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{request.User?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{request.Badge?.title || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {getStatusLabel(request.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(request.createdAt)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(request.updatedAt)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {request.Admin?.name || request.Admin?.email || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                    {request.message || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(request)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        Ver detalhes
                      </button>
                      {(request.Document?.DocumentAttachment?.length ?? 0) > 0 && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md" title="Possui anexos">
                          <Paperclip className="w-3.5 h-3.5 mr-1" />
                          {request.Document?.DocumentAttachment?.length}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredBadgeRequests.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            Mostrando {filteredBadgeRequests.length} de {badgeRequests.length} solicitação(ões)
          </span>
        </div>
      )}

      {/* Badge Request Action Modal */}
      <BadgeRequestActionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={processingRequest !== null}
      />
    </div>
  )
}
