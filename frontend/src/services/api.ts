export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')

export const resolveApiUrl = (url: string) => {
  if (!url.startsWith('/api/')) return url

  return `${API_BASE_URL.replace(/\/api\/?$/, '')}${url}`
}

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')
    const headers = new Headers(options.headers)
    const isFormData = options.body instanceof FormData

    if (!headers.has('Content-Type') && !isFormData) {
      headers.set('Content-Type', 'application/json')
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API Error')
    }

    return response.json()
  },

  get(endpoint: string) {
    return this.request(endpoint)
  },

  post(endpoint: string, data: unknown) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  patch(endpoint: string, data: unknown) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' })
  },
}

export const assignmentAPI = {
  getAll(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters).toString()
    return apiClient.get(`/assignments${params ? `?${params}` : ''}`)
  },

  getMyAssignments(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters).toString()
    return apiClient.get(`/assignments/me${params ? `?${params}` : ''}`)
  },

  getById(id: string) {
    return apiClient.get(`/assignments/${id}`)
  },

  create(data: unknown) {
    return apiClient.post('/assignments', data)
  },

  update(id: string, data: unknown) {
    return apiClient.patch(`/assignments/${id}`, data)
  },

  delete(id: string) {
    return apiClient.delete(`/assignments/${id}`)
  },

  submit(id: string, submissionFile: string) {
    return apiClient.post(`/assignments/${id}/submit`, { submissionFile })
  },
}

export const courseAPI = {
  getAll(filters?: Record<string, string>) {
    const params = new URLSearchParams(filters).toString()
    return apiClient.get(`/courses${params ? `?${params}` : ''}`)
  },

  getById(id: string) {
    return apiClient.get(`/courses/${id}`)
  },

  getLearningCourse(id: string) {
    return apiClient.get(`/courses/${id}/learn`)
  },

  create(data: unknown) {
    return apiClient.post('/courses', data)
  },

  update(id: string, data: unknown) {
    return apiClient.patch(`/courses/${id}`, data)
  },

  delete(id: string) {
    return apiClient.delete(`/courses/${id}`)
  },

  createSection(courseId: string, title: string) {
    return apiClient.post(`/courses/${courseId}/sections`, { title })
  },

  createLecture(courseId: string, sectionIndex: number, data: unknown) {
    return apiClient.post(`/courses/${courseId}/sections/${sectionIndex}/lectures`, data)
  },

  uploadLessonVideo(courseId: string, sectionIndex: number, lectureIndex: number, file: File) {
    const formData = new FormData()
    formData.append('video', file)

    return apiClient.request(`/courses/${courseId}/sections/${sectionIndex}/lectures/${lectureIndex}/video`, {
      method: 'POST',
      body: formData,
    })
  },
}

export const calendarAPI = {
  getEvents() {
    return apiClient.get('/calendar')
  },

  createEvent(data: unknown) {
    return apiClient.post('/calendar', data)
  },

  deleteEvent(id: string) {
    return apiClient.delete(`/calendar/${id}`)
  },
}
