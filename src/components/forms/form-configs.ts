import { FormConfig } from './GenericForm'

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
        custom: (value: string) => {
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
        custom: (value: string, formData?: Record<string, any>) => {
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
        custom: (value: string) => {
          if (!value) return null // Allow empty password for edit mode
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
        custom: (value: string, formData?: Record<string, any>) => {
          const password = formData?.password
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

export const taskFormConfig: FormConfig = {
  title: 'Create Task',
  submitLabel: 'Create Task',
  fields: [
    {
      name: 'name',
      label: 'Task Name',
      type: 'text',
      placeholder: 'Enter task name',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100
      }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter task description',
      validation: {
        maxLength: 500
      }
    },
    {
      name: 'type',
      label: 'Task Type',
      type: 'select',
      placeholder: 'Select task type',
      required: true,
      options: [
        { value: 'TWITTER_LIKE', label: 'X (Twitter) - Like' },
        { value: 'TWITTER_COMMENT', label: 'X (Twitter) - Comment' },
        { value: 'TWITTER_RETWEET', label: 'X (Twitter) - Retweet' },
        { value: 'TWITTER_PFP', label: 'X (Twitter) - Profile Picture' },
        { value: 'DISCORD_TOWNHALL_PRESENCE', label: 'Discord - Townhall Presence' }
      ]
    },
    {
      name: 'points',
      label: 'Reward Points',
      type: 'number',
      placeholder: 'Enter reward points',
      required: true,
      validation: {
        custom: (value: number) => {
          if (value < 0) return 'Points cannot be negative'
          if (value > 1000) return 'Points cannot exceed 1000'
          return null
        }
      }
    },
    {
      name: 'link',
      label: 'Task Link',
      type: 'text',
      placeholder: 'Enter task URL (optional)',
      validation: {
        pattern: /^https?:\/\/.+/
      }
    },
    {
      name: 'deadline',
      label: 'Deadline',
      type: 'datetime-local',
      placeholder: '',
      required: true
    },
    {
      name: 'isDaily',
      label: 'Daily Task',
      type: 'checkbox',
      description: 'Task can be completed daily'
    }
  ]
}

export const shopItemFormConfig: FormConfig = {
  title: 'Create Shop Item',
  submitLabel: 'Create Item',
  fields: [
    {
      name: 'name',
      label: 'Item Name',
      type: 'text',
      placeholder: 'Enter item name',
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
      validation: {
        maxLength: 500
      }
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      placeholder: 'Enter price',
      required: true,
      validation: {
        custom: (value: number) => {
          if (value < 0) return 'Price cannot be negative'
          return null
        }
      }
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      placeholder: 'Enter available quantity',
      required: true,
      validation: {
        custom: (value: number) => {
          if (value < 0) return 'Quantity cannot be negative'
          return null
        }
      }
    },
    {
      name: 'image',
      label: 'Image/Emoji',
      type: 'text',
      placeholder: 'Enter emoji or image URL',
      description: 'Use an emoji or image URL to represent this item'
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
      label: 'Badge Icon',
      type: 'text',
      placeholder: 'Enter emoji or icon',
      required: true,
      description: 'Use an emoji to represent this badge (e.g., 🏆, 🥇, ⭐)'
    }
  ]
}