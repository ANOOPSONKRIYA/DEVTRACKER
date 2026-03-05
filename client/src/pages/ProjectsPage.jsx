import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import ProjectsManager from '../components/ProjectsManager'
import { useAuth } from '../hooks/useAuth'

export default function ProjectsPage() {
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
      pageTitle="Projects"
      pageSubtitle="Manage portfolio projects with tech stack and links"
    >
      <ProjectsManager token={token} />
    </DashboardLayout>
  )
}
