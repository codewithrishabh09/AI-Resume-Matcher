import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ role }) {
  const { token, user } = useAuthStore()

  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'employer' ? '/employer' : '/seeker'} replace />
  }

  return <Outlet />
}