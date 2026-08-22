import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

// Seeker pages
import SeekerDashboard from './pages/seeker/Dashboard'
import UploadResume from './pages/seeker/UploadResume'
import JobList from './pages/seeker/JobList'
import JobDetail from './pages/seeker/JobDetail'
import MatchResult from './pages/seeker/MatchResult'

// Employer pages
import EmployerDashboard from './pages/employer/Dashboard'
import PostJob from './pages/employer/PostJob'
import JobApplications from './pages/employer/JobApplications'
import ResumeMatch from './pages/employer/ResumeMatch'

// Components
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const { token, user } = useAuthStore()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={
        token ? <Navigate to={user?.role === 'employer' ? '/employer' : '/seeker'} /> : <Login />
      } />
      <Route path="/register" element={
        token ? <Navigate to={user?.role === 'employer' ? '/employer' : '/seeker'} /> : <Register />
      } />

      {/* Seeker routes */}
      <Route path="/seeker" element={<ProtectedRoute role="seeker" />}>
        <Route index element={<SeekerDashboard />} />
        <Route path="upload" element={<UploadResume />} />
        <Route path="jobs" element={<JobList />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="match/:resumeId/:jobId" element={<MatchResult />} />
      </Route>

      {/* Employer routes */}
      <Route path="/employer" element={<ProtectedRoute role="employer" />}>
        <Route index element={<EmployerDashboard />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="jobs/:jobId/applications" element={<JobApplications />} />
        <Route path="jobs/:jobId/matches" element={<ResumeMatch />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}