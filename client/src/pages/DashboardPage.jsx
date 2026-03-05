import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../hooks/useAuth'
import { getProtectedExample } from '../services/authApi'

export default function DashboardPage() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [protectedMessage, setProtectedMessage] = useState('Loading protected data...')
  const [error, setError] = useState('')

  const metricPlaceholders = [
    { title: 'Current Streak', value: '0 days', hint: 'Connects on Day 8', trend: '+0%' },
    { title: 'Hours This Week', value: '0 h', hint: 'Connects on Day 13', trend: '+0%' },
    { title: 'DSA Solved', value: '0', hint: 'Connects on Day 10', trend: '+0%' },
    { title: 'Projects Tracked', value: '0', hint: 'Connects on Day 12', trend: '+0%' }
  ]

  const upcomingMilestones = [
    'Enable Daily Logs CRUD (Day 6)',
    'Integrate DSA workflow (Day 9-10)',
    'Connect Projects module (Day 11-12)'
  ]

  useEffect(() => {
    let mounted = true

    async function loadProtectedContent() {
      try {
        const response = await getProtectedExample(token)

        if (!mounted) {
          return
        }

        setProtectedMessage(response.message)
        setError('')
      } catch (requestError) {
        if (!mounted) {
          return
        }

        setError(requestError.message)
      }
    }

    loadProtectedContent()

    return () => {
      mounted = false
    }
  }, [token])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      pageTitle="Overview"
      pageSubtitle="A clear, reliable view of your engineering progress"
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricPlaceholders.map((metric) => (
          <article
            key={metric.title}
            className="rounded-xl border border-[#303030] bg-[#171717]/85 p-4"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-[#9f9f9f]">{metric.title}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-2xl font-semibold text-[#f1f1f1]">{metric.value}</p>
              <span className="rounded-md border border-[#315f52] bg-[#10a37f]/10 px-2 py-1 text-xs text-[#8cefd8]">
                {metric.trend}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#72ddc4]">{metric.hint}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-xl border border-[#303030] bg-[#171717]/85 p-5">
          <h2 className="text-sm font-semibold text-[#e1e1e1]">Progress Overview</h2>
          <p className="mt-2 text-sm text-[#c4c4c4]">
            This area gives a trusted single-pane view of your daily consistency, coding practice,
            and project output.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#2f2f2f] bg-[#1c1c1c] p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-[#949494]">Daily Discipline</p>
              <p className="mt-2 text-sm text-[#d8d8d8]">Keep one meaningful learning log per day.</p>
            </div>
            <div className="rounded-lg border border-[#2f2f2f] bg-[#1c1c1c] p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-[#949494]">Technical Depth</p>
              <p className="mt-2 text-sm text-[#d8d8d8]">Track solved problems and improve difficulty level weekly.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#303030] bg-[#171717]/85 p-5">
          <h2 className="text-sm font-semibold text-[#e1e1e1]">Upcoming Milestones</h2>
          <ul className="mt-3 space-y-2">
            {upcomingMilestones.map((milestone) => (
              <li
                key={milestone}
                className="rounded-lg border border-[#2f2f2f] bg-[#1c1c1c] px-3 py-2 text-sm text-[#c8c8c8]"
              >
                {milestone}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-[#303030] bg-[#171717]/85 p-5">
        <h2 className="text-sm font-semibold text-[#e1e1e1]">Protected API check</h2>
        <p className="mt-2 text-sm text-[#c4c4c4]">{protectedMessage}</p>
        {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
      </section>
    </DashboardLayout>
  )
}
