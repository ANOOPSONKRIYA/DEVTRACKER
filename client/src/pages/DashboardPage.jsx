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
    { title: 'Current Streak', value: '0 days', hint: 'Connects on Day 8' },
    { title: 'Hours This Week', value: '0 h', hint: 'Connects on Day 13' },
    { title: 'DSA Solved', value: '0', hint: 'Connects on Day 10' },
    { title: 'Projects Tracked', value: '0', hint: 'Connects on Day 12' }
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
    <DashboardLayout user={user} onLogout={handleLogout}>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricPlaceholders.map((metric) => (
          <article
            key={metric.title}
            className="rounded-xl border border-[#303030] bg-[#171717]/85 p-4"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-[#9f9f9f]">{metric.title}</p>
            <p className="mt-2 text-2xl font-semibold text-[#f1f1f1]">{metric.value}</p>
            <p className="mt-2 text-xs text-[#72ddc4]">{metric.hint}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[#303030] bg-[#171717]/85 p-4">
          <h2 className="text-sm font-semibold text-[#e1e1e1]">Protected API check</h2>
          <p className="mt-2 text-sm text-[#c4c4c4]">{protectedMessage}</p>
          {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
        </section>

        <section className="rounded-xl border border-dashed border-[#3a3a3a] bg-[#171717]/65 p-4">
          <h2 className="text-sm font-semibold text-[#e1e1e1]">What&apos;s next</h2>
          <p className="mt-2 text-sm text-[#c4c4c4]">
            Daily logs and tracker modules will appear here as you complete upcoming plan days.
          </p>
        </section>
      </div>
    </DashboardLayout>
  )
}
