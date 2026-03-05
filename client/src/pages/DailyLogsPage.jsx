import { useNavigate } from 'react-router-dom'
import DailyLogsManager from '../components/DailyLogsManager'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../hooks/useAuth'

export default function DailyLogsPage() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      pageTitle="Daily Logs"
      pageSubtitle="Document sessions with date-time, hours, and context"
    >
      <DailyLogsManager token={token} />
    </DashboardLayout>
  )
}
