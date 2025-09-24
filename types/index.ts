// Type definitions for the notification API

export interface NotificationData {
  lastname: string
  firstname: string
  email: string
  subject: string
  details: string
}

export interface NotificationRecord {
  id: string
  lastname: string
  firstname: string
  email: string
  subject: string
  details: string
  status: string
  created_at: string
  updated_at?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  details?: string | string[]
}

export interface NotificationResponse extends ApiResponse {
  data?: {
    id: string
    lastname: string
    firstname: string
    email: string
    subject: string
    created_at: string
  }
}

export interface NotificationListResponse extends ApiResponse {
  data?: NotificationRecord[]
  count?: number
  pagination?: {
    limit: number
    offset: number
    hasMore: boolean
  }
}
