import { FormConfig } from './GenericForm'
import { isValidBrazilianDate } from '@/lib/dateUtils'

// Helper function to format task type labels
function formatTaskTypeLabel(type: string): string {
  // Handle specific mappings for better readability
  const mappings: Record<string, string> = {
    'TWITTER_LIKE': 'Twitter Like',
    'TWITTER_COMMENT': 'Twitter Comment',
    'TWITTER_RETWEET': 'Twitter Retweet',
    'TWITTER_PFP': 'Twitter Profile Picture',
    'DISCORD_TOWNHALL_PRESENCE': 'Discord Townhall Presence',
    'CONNECT_DISCORD': 'Connect Discord',
    'CONNECT_X': 'Connect X (Twitter)',
  }

  // Return custom mapping if exists, otherwise format automatically
  if (mappings[type]) {
    return mappings[type]
  }

  // Fallback: format automatically
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export const adminFormConfig: FormConfig = {
  title: 'Create Admin',
  submitLabel: 'Create Admin',
  fields: [
    {
      name: 'adminName',
      label: 'Admin Name',
      type: 'text',
      placeholder: 'Enter admin name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50
      }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter admin email',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter Password',
      required: true,
      validation: {
        minLength: 8,
        custom: (value: unknown) => {
          if (typeof value !== 'string') return null
          if (!/[A-Z]/.test(value)) return 'Password must contain at least 1 uppercase letter'
          if (!/[0-9]/.test(value)) return 'Password must contain at least 1 number'
          return null
        }
      }
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm Password',
      required: true,
      validation: {
        custom: () => {
          // Note: This would need to be enhanced to access other field values
          return null
        }
      }
    },
    {
      name: 'isSuper',
      label: 'Super Admin',
      type: 'checkbox',
      description: 'Super admins have full access to all admin functions'
    }
  ]
}

export const adminEditFormConfig: FormConfig = {
  title: 'Edit Admin',
  submitLabel: 'Update Admin',
  fields: [
    {
      name: 'adminName',
      label: 'Admin Name',
      type: 'text',
      placeholder: 'Enter admin name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50
      }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter admin email',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    {
      name: 'password',
      label: 'New Password',
      type: 'password',
      placeholder: 'Enter new password (leave blank to keep current)',
      required: false,
      validation: {
        minLength: 8,
        custom: (value: unknown) => {
          if (typeof value !== 'string' || !value) return null // Allow empty password for edit mode
          if (!/[A-Z]/.test(value)) return 'Password must contain at least 1 uppercase letter'
          if (!/[0-9]/.test(value)) return 'Password must contain at least 1 number'
          return null
        }
      }
    },
    {
      name: 'confirmPassword',
      label: 'Confirm New Password',
      type: 'password',
      placeholder: 'Confirm new password',
      required: false,
      validation: {
        custom: (value: unknown, formData?: Record<string, unknown>) => {
          if (typeof value !== 'string') return null
          const password = formData?.password
          if (typeof password !== 'string') return null
          if (!password && !value) return null // Both empty is OK
          if (password && !value) return 'Please confirm your password'
          if (!password && value) return 'Please enter a password first'
          if (password !== value) return 'Passwords do not match'
          return null
        }
      }
    },
    {
      name: 'isSuper',
      label: 'Super Admin',
      type: 'checkbox',
      description: 'Super admins have full access to all admin functions'
    }
  ]
}

export function createTaskFormConfig(taskTypes: string[] = []): FormConfig {
  return {
    title: 'Create Task',
    submitLabel: 'Save',
    cancelLabel: 'Cancel',
  fields: [
    {
      name: 'title',
      label: 'Task Name',
      type: 'text',
      placeholder: 'Enter your name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Log in with Discord. Click at your profile and connect your profile with discord   name',
      required: true,
      validation: {
        minLength: 10,
        maxLength: 500
      }
    },
    {
      name: 'verificationSteps',
      label: 'Steps',
      type: 'textarea',
      placeholder: 'Complete the following steps to redeem 40+ Credits:\n\n• Connect to your Matrica profile\n• Click at your profile and connect your profile with discord\n• Come back to this page and click at the check button',
      validation: {
        maxLength: 1000
      }
    },
    {
      name: 'rewards',
      label: 'Price',
      type: 'number',
      placeholder: 'Put a number > 0',
      required: true,
      validation: {
        custom: (value: unknown) => {
          if (typeof value !== 'number') return null
          if (value <= 0) return 'Price must be greater than 0'
          return null
        }
      }
    },
    {
      name: 'taskType',
      label: 'Task Type',
      type: 'radio',
      required: true,
      options: [
        { value: 'daily', label: 'Daily Task - Can be completed every day' },
        { value: 'one-time', label: 'One-time Task - Has a specific deadline' }
      ],
      description: 'Choose whether this task repeats daily or has a deadline'
    },
    {
      name: 'deadline',
      label: 'Deadline',
      type: 'text',
      placeholder: '23/02/2024 - 18:00',
      description: 'Format: DD/MM/YYYY - HH:MM (required for one-time tasks)',
      conditionalDisabled: (formData: Record<string, unknown>) => formData?.taskType === 'daily',
      validation: {
        custom: (value: unknown, formData?: Record<string, unknown>) => {
          if (typeof value !== 'string') return null
          
          // Se for one-time task, deadline é obrigatório
          if (formData?.taskType === 'one-time' && (!value || value.trim() === '')) {
            return 'Deadline is required for one-time tasks';
          }
          
          // Se tem valor, validar formato
          if (value && value.trim() !== '') {
            if (!isValidBrazilianDate(value)) {
              return 'Invalid date format. Use DD/MM/YYYY - HH:MM';
            }
          }
          
          return null;
        }
      }
    },
    {
      name: 'link',
      label: 'Task Link',
      type: 'text',
      placeholder: 'https://discord.gg/example',
      description: 'Optional: Link where users can complete the task'
    },
    {
      name: 'type',
      label: 'Task Type',
      type: 'select',
      required: true,
      placeholder: 'Select task type...',
      description: 'Choose the specific type of task from available options',
      options: taskTypes.map(type => ({
        value: type,
        label: formatTaskTypeLabel(type)
      }))
    },
    {
      name: 'socialMedia',
      label: 'Social media',
      type: 'radio',
      required: true,
      options: [
        { value: 'discord', label: 'Discord' },
        { value: 'X', label: 'X (late twitter)' }
      ]
    }
  ]
  }
}

// Static version for compatibility
export const taskFormConfig: FormConfig = createTaskFormConfig()

export const shopItemFormConfig: FormConfig = {
  title: 'Create Shop Item',
  submitLabel: 'Save',
  cancelLabel: 'Cancel',
  fields: [
    {
      name: 'name',
      label: 'Item Name',
      type: 'text',
      placeholder: 'Enter your name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter item description',
      required: true,
      validation: {
        minLength: 10,
        maxLength: 500
      }
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      placeholder: 'Put a number > 0',
      required: true,
      group: 'price-quantity',
      groupWidth: 'flex-1 sm:w-[230px]',
      validation: {
        custom: (value: unknown) => {
          if (typeof value !== 'number') return null
          if (value <= 0) return 'Price must be greater than 0'
          return null
        }
      }
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      placeholder: 'Put a number > 0',
      required: true,
      group: 'price-quantity',
      groupWidth: 'flex-1 sm:w-[251px]',
      validation: {
        custom: (value: unknown) => {
          if (typeof value !== 'number') return null
          if (value < 0) return 'Quantity cannot be negative'
          return null
        }
      }
    },
    {
      name: 'tag',
      label: 'Tag',
      type: 'text',
      placeholder: 'Enter tag',
      required: true,
      group: 'tag-category',
      groupWidth: 'flex-1',
      validation: {
        minLength: 1,
        maxLength: 50
      }
    },
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      placeholder: 'Enter category',
      required: true,
      group: 'tag-category',
      groupWidth: 'flex-1',
      validation: {
        minLength: 1,
        maxLength: 50
      }
    },
    {
      name: 'image',
      label: 'Image',
      type: 'image-upload',
      description: 'Upload an image for this item'
    }
  ]
}

export const badgeFormConfig: FormConfig = {
  title: 'Create Badge',
  submitLabel: 'Create Badge',
  fields: [
    {
      name: 'name',
      label: 'Badge Name',
      type: 'text',
      placeholder: 'Enter badge name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      name: 'title',
      label: 'Badge Title',
      type: 'text',
      placeholder: 'Enter badge title/subtitle',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50
      }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter badge description',
      validation: {
        maxLength: 300
      }
    },
    {
      name: 'image',
      label: 'Badge Image',
      type: 'image-upload',
      description: 'Upload an image for this badge'
    }
  ]
}