const API_BASE = '/.netlify/functions'

const api = {
  // Auth endpoints
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE}/auth-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    return response.json()
  },

  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/auth-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    return response.json()
  },

  logout: async () => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/auth-logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  // Todo endpoints
  getTodos: async () => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/todos-get`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },

  createTodo: async (text) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/todos-create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    })
    return response.json()
  },

  updateTodo: async (id, updates) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/todos-update`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, ...updates })
    })
    return response.json()
  },

  deleteTodo: async (id) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/todos-delete`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    })
    return response.json()
  }
}

export default api
