import { create } from 'zustand'
import api from '../api/axios'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.access_token)

      // Get user info
      const userRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` }
      })
      localStorage.setItem('user', JSON.stringify(userRes.data))

      set({
        token: data.access_token,
        user: userRes.data,
        isLoading: false
      })
      return { success: true, role: userRes.data.role }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed'
      set({ error: msg, isLoading: false })
      return { success: false, error: msg }
    }
  },

  register: async (full_name, email, password, role) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.post('/auth/register', {
        full_name, email, password, role
      })
      localStorage.setItem('token', data.access_token)

      const userRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` }
      })
      localStorage.setItem('user', JSON.stringify(userRes.data))

      set({
        token: data.access_token,
        user: userRes.data,
        isLoading: false
      })
      return { success: true, role: userRes.data.role }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed'
      set({ error: msg, isLoading: false })
      return { success: false, error: msg }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
    window.location.href = '/login'
  },

  clearError: () => set({ error: null })
}))

export default useAuthStore