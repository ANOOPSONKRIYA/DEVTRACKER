import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import AnalyticsPage from './pages/AnalyticsPage'
import DailyLogsPage from './pages/DailyLogsPage'
import DSATrackerPage from './pages/DSATrackerPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import ProjectsPage from './pages/ProjectsPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  const { isAuthenticated } = useAuth()
  const appContainerClassName = isAuthenticated ? 'w-full' : 'mx-auto w-full max-w-xl'
  const appMainClassName = isAuthenticated
    ? 'min-h-screen bg-[#212121] text-[#ececec]'
    : 'min-h-screen bg-[#212121] px-4 py-8 text-[#ececec]'

  return (
    <main className={appMainClassName}>
      <div className={appContainerClassName}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-logs"
            element={
              <ProtectedRoute>
                <DailyLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dsa-tracker"
            element={
              <ProtectedRoute>
                <DSATrackerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  )
}
