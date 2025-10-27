'use client';

import { useState, useEffect } from 'react';
import { Campton } from '@/lib/fonts';
import { cn } from '@/lib/cn';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import { 
  File as FileIcon,
  FileImage,
  FileText,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FileCode
} from 'lucide-react'
import type { BadgeRequest, Badge } from '@/types';

interface BadgeRequestActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BadgeRequest | null;
  onApprove: (requestId: string) => Promise<{ success: boolean; error?: string }>;
  onReject: (requestId: string) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
}

export default function BadgeRequestActionModal({ 
  isOpen, 
  onClose, 
  request,
  onApprove,
  onReject,
  isLoading = false
}: BadgeRequestActionModalProps) {
  const [processing, setProcessing] = useState<'approve' | 'reject' | null>(null);
  const [badgeDetails, setBadgeDetails] = useState<Badge | null>(null);
  const [loadingBadge, setLoadingBadge] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Fetch badge details when modal opens
  useEffect(() => {
    const fetchBadgeDetails = async () => {
      if (isOpen && request?.Badge?.badgeId) {
        setLoadingBadge(true);
        try {
          const badge = await api.getBadgeById(request.Badge.badgeId);
          setBadgeDetails(badge);
        } catch (error) {
          console.error('Failed to fetch badge details:', error);
          showError('Error loading badge', 'Unable to load badge details');
          setBadgeDetails(null);
        } finally {
          setLoadingBadge(false);
        }
      }
    };

    fetchBadgeDetails();
  }, [isOpen, request?.Badge?.badgeId, showError]);

  // Clear badge details when modal closes
  useEffect(() => {
    if (!isOpen) {
      setBadgeDetails(null);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleApprove = async () => {
    if (!request) return;

    setProcessing('approve');
    try {
      const result = await onApprove(request.id);
      if (result.success) {
        onClose();
      } else {
        showError('Error approving', result.error || 'Failed to approve request');
      }
    } catch {
      showError('Unexpected error', 'An error occurred while approving the request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!request) return;

    setProcessing('reject');
    try {
      const result = await onReject(request.id);
      if (result.success) {
        onClose();
      } else {
        showError('Error rejecting', result.error || 'Failed to reject request');
      }
    } catch {
      showError('Unexpected error', 'An error occurred while rejecting the request');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'APPROVED':
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'APPROVED':
        return 'Approved';
      case 'ACCEPTED':
        return 'Accepted';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (!isOpen || !request) return null;

  const resolveFileUrl = (url: string) => {
    if (!url) return '#'
    if (/^https?:\/\//i.test(url)) return url
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`
  }

  const attachments = Array.isArray(request.Document?.DocumentAttachment)
    ? request.Document?.DocumentAttachment
    : []

  const getAttachmentIcon = (mime: string, filename?: string) => {
    const type = (mime || '').toLowerCase()
    const ext = (filename || '').split('.').pop()?.toLowerCase()
    const className = 'w-5 h-5 mr-2 flex-shrink-0'

    if (type.startsWith('image/')) return <FileImage className={`${className} text-pink-500`} />
    if (type === 'application/pdf' || ext === 'pdf') return <FileText className={`${className} text-red-600`} />
    if (type.startsWith('video/')) return <FileVideo className={`${className} text-purple-600`} />
    if (type.startsWith('audio/')) return <FileAudio className={`${className} text-emerald-600`} />
    if (type.includes('sheet') || type.includes('excel') || ['xls','xlsx','csv'].includes(ext || '')) return <FileSpreadsheet className={`${className} text-green-600`} />
    if (type.includes('word') || ['doc','docx','rtf','odt','md','txt'].includes(ext || '') || type.startsWith('text/')) return <FileText className={`${className} text-blue-600`} />
    if (['zip','rar','7z','tar','gz'].includes(ext || '') || type.includes('zip') || type.includes('compressed') || type.includes('tar')) return <FileArchive className={`${className} text-amber-600`} />
    if (['json','js','ts','tsx','jsx'].includes(ext || '') || type.includes('json')) return <FileCode className={`${className} text-slate-600`} />
    return <FileIcon className={`${className} text-gray-500`} />
  }

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={handleOverlayClick}
      />
      
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-[22px] w-full max-w-[800px] max-h-[90vh] pointer-events-auto flex flex-col"
          style={{ filter: 'none !important' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-7 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className={cn("text-[#020202] text-[28px] font-semibold", Campton.className)}>
                Badge Request Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-7 overflow-y-auto">
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-2", Campton.className)}>
                  Status
                </label>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>

              {/* User Information */}
              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-2", Campton.className)}>
                  User
                </label>
                <p className={cn("text-gray-900", Campton.className)}>
                  {request.User?.name || 'Unidentified user'}
                </p>
              </div>

              {/* Badge Information */}
              <div>
                <label className={cn("block text-sm font-medium text-gray-700 mb-2", Campton.className)}>
                  Badge
                </label>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {loadingBadge ? (
                    <div className="flex items-center justify-center py-4">
                      <svg className="animate-spin h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className={cn("ml-2 text-gray-600", Campton.className)}>
                        Loading badge details...
                      </span>
                    </div>
                  ) : (
                    <>
                      <h3 className={cn("font-semibold text-gray-900", Campton.className)}>
                        {badgeDetails?.title || request.Badge?.title || 'Unidentified badge'}
                      </h3>

                      {(badgeDetails?.description || request.Badge?.description) && (
                        <div>
                          <h4 className={cn("text-sm font-medium text-gray-700 mb-1", Campton.className)}>
                            Description:
                          </h4>
                          <p className={cn("text-gray-600", Campton.className)}>
                            {badgeDetails?.description || request.Badge?.description}
                          </p>
                        </div>
                      )}

                      {/* Show goal from API data (priority) or fallback to request data */}
                      {(badgeDetails?.goal || request.Badge?.goal) && (
                        <div>
                          <h4 className={cn("text-sm font-medium text-gray-700 mb-1", Campton.className)}>
                            Goal:
                          </h4>
                          <p className={cn("text-gray-600", Campton.className)}>
                            {badgeDetails?.goal || request.Badge?.goal}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div>
                  <label className={cn("block text-sm font-medium text-gray-700 mb-2", Campton.className)}>
                    Attachments ({attachments.length})
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {attachments.map((att, idx) => (
                      <div key={`${att.filename}-${idx}`} className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          {getAttachmentIcon(att.mimeType, att.filename)}
                          <div className="min-w-0">
                            <p className={cn("text-gray-900 truncate", Campton.className)} title={att.filename}>
                              {att.filename}
                            </p>
                            <p className="text-xs text-gray-500">{att.mimeType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={resolveFileUrl(att.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                          >
                            View
                          </a>
                          <a
                            href={resolveFileUrl(att.fileUrl)}
                            download={att.filename}
                            className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Message */}
              {request.message && (
                <div>
                  <label className={cn("block text-sm font-medium text-gray-700 mb-2", Campton.className)}>
                    Request Message
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className={cn("text-gray-900", Campton.className)}>
                      {request.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={cn("block text-sm font-medium text-gray-700 mb-2", Campton.className)}>
                    Request Date
                  </label>
                  <p className={cn("text-gray-600", Campton.className)}>
                    {formatDate(request.createdAt)}
                  </p>
                </div>
                <div>
                  <label className={cn("block text-sm font-medium text-gray-700 mb-2", Campton.className)}>
                    Last Update
                  </label>
                  <p className={cn("text-gray-600", Campton.className)}>
                    {formatDate(request.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Admin Information */}
              {request.Admin && (
                <div>
                  <label className={cn("block text-sm font-medium text-gray-700 mb-2", Campton.className)}>
                    Responsible Admin
                  </label>
                  <p className={cn("text-gray-600", Campton.className)}>
                    {request.Admin.name} ({request.Admin.email})
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {request.status === 'PENDING' && (
            <div className="p-7 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={onClose}
                  disabled={processing !== null || isLoading}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing !== null || isLoading}
                  className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {processing === 'reject' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rejecting...
                    </>
                  ) : (
                    'Reject'
                  )}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={processing !== null || isLoading}
                  className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {processing === 'approve' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Approving...
                    </>
                  ) : (
                    'Approve'
                  )}
                </button>
              </div>
            </div>
          )}

          {request.status !== 'PENDING' && (
            <div className="p-7 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
