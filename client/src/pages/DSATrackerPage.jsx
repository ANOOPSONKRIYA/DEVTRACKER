import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import DSATrackerManager from '../components/DSATrackerManager'
import { useAuth } from '../hooks/useAuth'

export default function DSATrackerPage() {
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
      pageTitle="DSA Tracker"
      pageSubtitle="Track coding problem progress across platforms"
    >
      <DSATrackerManager token={token} />
    </DashboardLayout>
  )
}
