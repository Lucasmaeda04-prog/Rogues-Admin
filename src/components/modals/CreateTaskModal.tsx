'use client';

import { useState, useEffect, useCallback } from 'react';
import { Campton } from '@/lib/fonts';
import { cn } from '@/lib/cn';
import GenericForm from '@/components/forms/GenericForm';
import { createTaskFormConfig } from '@/components/forms/form-configs';
import { useTaskTypes } from '@/hooks';
import TaskPreview from '@/components/Previews/task/TaskPreview';
import TaskList from '@/components/Previews/task/ListTask';
import { convertToTimestamp, isValidBrazilianDate } from '@/lib/dateUtils';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  isLoading?: boolean;
  editData?: TaskFormData | null;
  mode?: 'create' | 'edit';
}

export interface TaskFormData {
  title: string;
  description: string;
  verificationSteps: string;
  rewards: number;
  deadline?: string;
  link?: string;
  socialMedia: string;
  taskType: 'daily' | 'one-time';
  taskCategoryId: number; // ID da categoria da task selecionada
}

export default function CreateTaskModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  editData = null,
  mode = 'create'
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    verificationSteps: '',
    rewards: 0,
    deadline: '',
    link: '',
    socialMedia: 'discord',
    taskType: 'one-time',
    taskCategoryId: 0
  });

  const { taskTypes } = useTaskTypes(formData.socialMedia);

  // Auto-select first task type when taskTypes load or change
  useEffect(() => {
    if (taskTypes && taskTypes.length > 0) {
      setFormData(prev => {
        // Only update taskCategoryId if current one is not valid for the current taskTypes
        const validIds = taskTypes.map(t => t.taskCategoryId);
        if (!prev.taskCategoryId || !validIds.includes(prev.taskCategoryId)) {
          return {
            ...prev, // Preserve all other form data
            taskCategoryId: taskTypes[0]?.taskCategoryId || 0
          };
        }
        return prev; // Return unchanged if current taskCategoryId is valid
      });
    }
  }, [taskTypes]);

  // Update form data when editData or mode changes (not when taskTypes changes)
  useEffect(() => {
    if (editData && mode === 'edit') {
      setFormData(editData);
    }
  }, [editData, mode]);

  // Reset form data when modal opens in create mode
  useEffect(() => {
    if (isOpen && mode === 'create' && !editData) {
      setFormData({
        title: '',
        description: '',
        verificationSteps: '',
        rewards: 0,
        deadline: '',
        link: '',
        socialMedia: 'discord',
        taskType: 'one-time',
        taskCategoryId: 0
      });
    }
  }, [isOpen, mode, editData]);

  // Transform verification steps for preview
  const getVerificationStepsArray = useCallback(() => {
    if (!formData.verificationSteps) return [];

    return formData.verificationSteps
      .split('\n')
      .filter(step => step.trim())
      .map(step => {
        // Remove bullet points if they exist
        return step.replace(/^[•\-*]\s*/, '').trim();
      })
      .filter(step => step); // Remove empty strings after processing
  }, [formData.verificationSteps]);

  // Helper function to convert Brazilian date format to Date for preview
  const getPreviewDeadline = useCallback(() => {
    if (!formData.deadline || formData.deadline.trim() === '') {
      return undefined;
    }

    // Check if it's a valid Brazilian date format
    if (isValidBrazilianDate(formData.deadline)) {
      // Convert to MySQL timestamp then to Date
      const timestamp = convertToTimestamp(formData.deadline);
      return new Date(timestamp);
    }

    // If already a valid date string, try to parse it
    const parsed = new Date(formData.deadline);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, [formData.deadline]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);


  if (!isOpen) return null;

  // Create form config with available task types
  const formConfig = createTaskFormConfig(taskTypes || []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormChange = (data: Record<string, unknown>) => {
    const taskData: TaskFormData = {
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description : '',
      verificationSteps: typeof data.verificationSteps === 'string' ? data.verificationSteps : '',
      rewards: typeof data.rewards === 'number' ? data.rewards : Number(data.rewards) || 0,
      deadline: typeof data.deadline === 'string' ? data.deadline : '',
      link: typeof data.link === 'string' ? data.link : '',
      socialMedia: (typeof data.socialMedia === 'string' && (data.socialMedia === 'discord' || data.socialMedia === 'X')) ? data.socialMedia : 'discord',
      taskType: (typeof data.taskType === 'string' && (data.taskType === 'daily' || data.taskType === 'one-time')) ? data.taskType : 'one-time',
      taskCategoryId: typeof data.taskCategoryId === 'number' ? data.taskCategoryId : Number(data.taskCategoryId) || 0
    };
    
    // Update local state for preview in real-time
    setFormData(taskData);
  };

  const handleFormSubmit = (data: Record<string, unknown>) => {
    const taskData: TaskFormData = {
      title: typeof data.title === 'string' ? data.title : '',
      description: typeof data.description === 'string' ? data.description : '',
      verificationSteps: typeof data.verificationSteps === 'string' ? data.verificationSteps : '',
      rewards: typeof data.rewards === 'number' ? data.rewards : Number(data.rewards) || 0,
      deadline: typeof data.deadline === 'string' ? data.deadline : '',
      link: typeof data.link === 'string' ? data.link : '',
      socialMedia: (typeof data.socialMedia === 'string' && (data.socialMedia === 'discord' || data.socialMedia === 'X')) ? data.socialMedia : 'discord',
      taskType: (typeof data.taskType === 'string' && (data.taskType === 'daily' || data.taskType === 'one-time')) ? data.taskType : 'one-time',
      taskCategoryId: typeof data.taskCategoryId === 'number' ? data.taskCategoryId : Number(data.taskCategoryId) || taskTypes?.[0]?.taskCategoryId || 0
    };
    
    onSubmit(taskData);
  };

  // Create preview data for TaskPreview (Card)
  const previewTaskData = {
    title: formData.title || 'Connect Discord',
    description: formData.description || 'Log in with Discord. Click at your profile and connect your profile with discord',
    rewards: formData.rewards || 40,
    verificationSteps: getVerificationStepsArray(),
    socialMedia: (formData.socialMedia === 'discord' || formData.socialMedia === 'X') ? formData.socialMedia as 'discord' | 'X' : 'discord' as 'discord' | 'X',
    deadline: getPreviewDeadline()
  };

  // Create preview data for TaskList
  const previewListData = {
    title: formData.title || 'Connect with Discord',
    description: formData.description || 'Log in with Discord. Click at your profile and connect your profile with discord',
    rewards: formData.rewards || 40,
    initialState: 'claim' as const,
    socialMedia: (formData.socialMedia === 'discord' || formData.socialMedia === 'X') ? formData.socialMedia as 'discord' | 'X' : 'discord' as 'discord' | 'X',
    deadline: (formData.taskType === 'daily' || !formData.deadline) ? undefined : getPreviewDeadline(), // Só mostra deadline se não for daily E tiver deadline
    isDaily: formData.taskType === 'daily'
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={handleOverlayClick}
      />
      
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-[22px] w-full max-w-[1400px] max-h-[95vh] min-h-[700px] pointer-events-auto flex flex-col lg:flex-row overflow-hidden"
          style={{ filter: 'none !important' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left side - Form */}
          <div className="flex-1 flex flex-col min-w-0 lg:min-w-[500px] overflow-hidden">
            {/* Fixed Header */}
            <div className="px-7 pt-7 pb-6 lg:pr-[21px] flex-shrink-0">
              <h2 className={cn("text-[#020202] text-[28px] font-semibold mb-2", Campton.className)}>
                {mode === 'edit' ? 'Edit Task' : 'Create Task'}
              </h2>
              <p className={cn("text-[#949191] text-[14px] font-light", Campton.className)}>
                Fill the inputs bellow
              </p>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto px-7 lg:pr-[21px]">
              <GenericForm
                config={{
                  ...formConfig,
                  submitLabel: mode === 'edit' ? 'Update Task' : 'Create Task'
                }}
                onSubmit={handleFormSubmit}
                onCancel={onClose}
                onChange={handleFormChange}
                isLoading={isLoading}
                initialData={formData as unknown as Record<string, unknown>}
                className="flex-1"
                hideTitle={true}
                hideBorder={true}
              />
            </div>
          </div>

          {/* Right side - Preview */}
          <div className="w-full lg:w-[600px] lg:min-w-[500px] bg-white lg:rounded-r-[22px] rounded-b-[22px] lg:rounded-b-none pl-[20px] flex flex-col">
            <div className="w-full h-full bg-black lg:rounded-l-[16px] lg:rounded-r-[22px] rounded-b-[22px] lg:rounded-b-none p-[35px] flex flex-col">
              <div className="mb-6">
                <h3 className={cn("text-[#d7d7d7] text-[28px] w-full mb-2", Campton.className)}>
                  Task Preview
                </h3>
              </div>
              
              <div className="flex-1 flex flex-col gap-8">
                {/* Card Preview */}
                <div className="flex flex-col gap-5">
                  <h4 className={cn("text-[#d7d7d7] text-[20px] font-medium", Campton.className)}>
                    Card Preview
                  </h4>
                  
                  <div className="w-full">
                    <TaskPreview
                      task={previewTaskData}
                      onVerify={() => console.log('Preview verify clicked')}
                      onGoToMission={() => console.log('Preview mission clicked')}
                      isVerifying={false}
                    />
                  </div>
                </div>

                {/* List Preview */}
                <div className="flex flex-col gap-5">
                  <h4 className={cn("text-[#d7d7d7] text-[20px] font-medium", Campton.className)}>
                    List Preview
                  </h4>
                  
                  <TaskList
                    {...previewListData}
                    className="backdrop-blur-[25px] rounded-[15px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
