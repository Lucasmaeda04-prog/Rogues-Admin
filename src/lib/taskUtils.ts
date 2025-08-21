import type { TaskType } from '@/types'

/**
 * Extracts the social network from a TaskType
 * @param taskType - The task type (e.g., 'TWITTER_LIKE', 'DISCORD_TOWNHALL_PRESENCE')
 * @returns The social network name
 */
export function getSocialNetworkFromTaskType(taskType: TaskType): string {
  const networkPart = taskType.split('_')[0].toLowerCase()
  
  // Map networks to display names
  const networkMap: Record<string, string> = {
    'twitter': 'twitter',
    'discord': 'discord'
  }
  
  return networkMap[networkPart] || networkPart
}

/**
 * Gets the appropriate icon path for a social network
 * @param network - The social network name
 * @returns The path to the SVG icon
 */
export function getSocialNetworkIcon(network: string): string {
  const iconMap: Record<string, string> = {
    'twitter': '/assets/X.svg',
    'discord': '/assets/Discord.svg'
  }
  
  return iconMap[network] || '/assets/X.svg' // fallback to X.svg
}

/**
 * Gets the action type from a TaskType
 * @param taskType - The task type (e.g., 'TWITTER_LIKE', 'DISCORD_TOWNHALL_PRESENCE')
 * @returns The action part formatted for display
 */
export function getActionFromTaskType(taskType: TaskType): string {
  const parts = taskType.split('_')
  // Remove the first part (network) and join the rest
  const actionParts = parts.slice(1)
  
  return actionParts
    .join(' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Gets social network info from a TaskType
 * @param taskType - The task type
 * @returns Object with network name, icon path, and action
 */
export function getTaskSocialInfo(taskType: TaskType) {
  const network = getSocialNetworkFromTaskType(taskType)
  const icon = getSocialNetworkIcon(network)
  const action = getActionFromTaskType(taskType)
  
  return {
    network,
    icon,
    action,
    displayName: network === 'twitter' ? 'X' : network.charAt(0).toUpperCase() + network.slice(1)
  }
}

export function formatDeadline(deadline: string | Date): string {
  const date = typeof deadline === 'string' ? new Date(deadline) : deadline;
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

/**
 * Checks if a deadline has passed
 * @param deadline - Date string or Date object
 * @returns true if deadline has passed
 */
export function isDeadlinePassed(deadline: string | Date): boolean {
  const date = typeof deadline === 'string' ? new Date(deadline) : deadline;
  return date.getTime() < Date.now();
}