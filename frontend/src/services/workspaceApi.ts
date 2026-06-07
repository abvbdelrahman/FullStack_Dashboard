import type { ClassSession, DiscussionThread, LearningFile } from '../data/workspace'
import { apiClient } from './api'

export interface NoteItem {
  id: string
  title: string
  course: string
  body: string
  updatedAt: string
}

export interface SettingsPayload {
  name?: string
  email?: string
  weeklyDigest?: boolean
  classReminders?: boolean
  compactMode?: boolean
}

export interface UserSettingsResponse {
  name: string
  email: string
  role: 'instructor' | 'admin'
  weeklyDigest: boolean
  classReminders: boolean
  compactMode: boolean
}

export interface DashboardTask {
  id: string
  title: string
  date: string
  done: boolean
}

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

export interface DashboardSummary {
  courses: number
  lessons: number
  assignments: number
  pendingAssignments: number
  classes: number
  upcomingClasses: number
  tasks: number
  openTasks: number
  savedResources: number
  hours: Array<{ month: string; Teaching: number; Admin: number }>
}

export const noteAPI = {
  getAll() {
    return apiClient.get('/workspace/notes') as Promise<NoteItem[]>
  },
  create(data: Omit<NoteItem, 'id' | 'updatedAt'>) {
    return apiClient.post('/workspace/notes', data) as Promise<NoteItem>
  },
  update(id: string, data: Partial<Omit<NoteItem, 'id' | 'updatedAt'>>) {
    return apiClient.patch(`/workspace/notes/${id}`, data) as Promise<NoteItem>
  },
  delete(id: string) {
    return apiClient.delete(`/workspace/notes/${id}`)
  },
}

export const resourceAPI = {
  getAll(saved?: boolean) {
    return apiClient.get(`/workspace/resources${saved ? '?saved=true' : ''}`) as Promise<LearningFile[]>
  },
  create(data: Omit<LearningFile, 'id' | 'updatedAt'> & { saved?: boolean }) {
    return apiClient.post('/workspace/resources', data) as Promise<LearningFile>
  },
  update(id: string, data: Partial<Omit<LearningFile, 'id' | 'updatedAt'>>) {
    return apiClient.patch(`/workspace/resources/${id}`, data) as Promise<LearningFile>
  },
  delete(id: string) {
    return apiClient.delete(`/workspace/resources/${id}`)
  },
}

export const classAPI = {
  getAll() {
    return apiClient.get('/workspace/classes') as Promise<ClassSession[]>
  },
  create(data: Omit<ClassSession, 'id'>) {
    return apiClient.post('/workspace/classes', data) as Promise<ClassSession>
  },
  update(id: string, data: Partial<Omit<ClassSession, 'id'>>) {
    return apiClient.patch(`/workspace/classes/${id}`, data) as Promise<ClassSession>
  },
  delete(id: string) {
    return apiClient.delete(`/workspace/classes/${id}`)
  },
}

export const discussionAPI = {
  getAll() {
    return apiClient.get('/workspace/discussions') as Promise<DiscussionThread[]>
  },
  create(data: Pick<DiscussionThread, 'title' | 'course' | 'tags' | 'excerpt'>) {
    return apiClient.post('/workspace/discussions', data) as Promise<DiscussionThread>
  },
  update(id: string, data: Partial<Pick<DiscussionThread, 'title' | 'course' | 'tags' | 'excerpt'>>) {
    return apiClient.patch(`/workspace/discussions/${id}`, data) as Promise<DiscussionThread>
  },
  delete(id: string) {
    return apiClient.delete(`/workspace/discussions/${id}`)
  },
  reply(id: string, body: string) {
    return apiClient.post(`/workspace/discussions/${id}/replies`, { body }) as Promise<DiscussionThread>
  },
}

export const settingsAPI = {
  get() {
    return apiClient.get('/workspace/settings') as Promise<UserSettingsResponse>
  },
  update(data: SettingsPayload) {
    return apiClient.patch('/workspace/settings', data) as Promise<UserSettingsResponse>
  },
}

export const taskAPI = {
  getAll() {
    return apiClient.get('/workspace/tasks') as Promise<DashboardTask[]>
  },
  create(data: Omit<DashboardTask, 'id'>) {
    return apiClient.post('/workspace/tasks', data) as Promise<DashboardTask>
  },
  update(id: string, data: Partial<Omit<DashboardTask, 'id'>>) {
    return apiClient.patch(`/workspace/tasks/${id}`, data) as Promise<DashboardTask>
  },
  delete(id: string) {
    return apiClient.delete(`/workspace/tasks/${id}`)
  },
}

export const notificationAPI = {
  getAll() {
    return apiClient.get('/workspace/notifications') as Promise<NotificationItem[]>
  },
  create(data: Omit<NotificationItem, 'id'>) {
    return apiClient.post('/workspace/notifications', data) as Promise<NotificationItem>
  },
  update(id: string, data: Partial<Omit<NotificationItem, 'id'>>) {
    return apiClient.patch(`/workspace/notifications/${id}`, data) as Promise<NotificationItem>
  },
  markAllRead() {
    return apiClient.patch('/workspace/notifications/read-all', {}) as Promise<NotificationItem[]>
  },
  delete(id: string) {
    return apiClient.delete(`/workspace/notifications/${id}`)
  },
}

export const dashboardAPI = {
  getSummary() {
    return apiClient.get('/workspace/dashboard') as Promise<DashboardSummary>
  },
}
