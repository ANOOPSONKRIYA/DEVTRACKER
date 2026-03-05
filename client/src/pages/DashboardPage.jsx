import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../hooks/useAuth'
import { getProtectedExample } from '../services/authApi'

const weeklyPerformance = [
  { day: 'Mon', hours: 2.2 },
  { day: 'Tue', hours: 3.4 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 3.6 },
  { day: 'Sat', hours: 2.9 },
  { day: 'Sun', hours: 3.1 }
]

const maxWeeklyHours = Math.max(...weeklyPerformance.map((item) => item.hours))

function buildIntensityPattern(seed) {
  return Array.from({ length: 56 }, (_, index) => {
    const value = (index * (seed + 3) + seed) % 17

    if (value < 5) {
      return 0
    }

    if (value < 9) {
      return 1
    }

    if (value < 13) {
      return 2
    }

    if (value < 15) {
      return 3
    }

    return 4
  })
}

function heatCellClass(level, tone) {
  const palette = {
    emerald: [
      'bg-[#1f2522] border-[#2f3834]',
      'bg-[#1c463a] border-[#246252]',
      'bg-[#1d6a56] border-[#238669]',
      'bg-[#1f8f72] border-[#27aa85]',
      'bg-[#28b28e] border-[#35c8a1]'
    ],
    cyan: [
      'bg-[#202427] border-[#30363a]',
      'bg-[#1f4048] border-[#2a5660]',
      'bg-[#246271] border-[#2d7e8e]',
      'bg-[#2c8498] border-[#36a0b5]',
      'bg-[#38a9bf] border-[#44c2d8]'
    ],
    blue: [
      'bg-[#1f2328] border-[#2d333b]',
      'bg-[#1f3852] border-[#28496a]',
      'bg-[#27506f] border-[#2f6388]',
      'bg-[#2f6a93] border-[#3c7dab]',
      'bg-[#3a84b8] border-[#4999d1]'
    ]
  }

  return palette[tone][level]
}

const streakTracks = [
  {
    title: 'Daily Logs',
    subtitle: 'Write one useful log every day',
    tone: 'emerald',
    checked: true,
    values: buildIntensityPattern(2)
  },
  {
    title: 'DSA Practice',
    subtitle: 'Solve and track coding problems',
    tone: 'cyan',
    checked: true,
    values: buildIntensityPattern(5)
  },
  {
    title: 'Project Progress',
    subtitle: 'Push project improvements frequently',
    tone: 'blue',
    checked: false,
    values: buildIntensityPattern(8)
  }
]

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
          <h2 className="text-sm font-semibold text-[#e1e1e1]">Streak Board</h2>
          <p className="mt-2 text-sm text-[#c4c4c4]">
            A visual consistency board inspired by habit-based streak tracking.
          </p>

          <div className="mt-4 space-y-4">
            {streakTracks.map((track) => (
              <article key={track.title} className="rounded-xl border border-[#2f2f2f] bg-[#1c1c1c] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#e7e7e7]">{track.title}</h3>
                    <p className="text-sm text-[#b8b8b8]">{track.subtitle}</p>
                  </div>

                  <div
                    className={[
                      'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold',
                      track.checked
                        ? 'border-[#2f7d66] bg-[#10a37f]/20 text-[#8ef0d9]'
                        : 'border-[#454545] bg-[#2a2a2a] text-[#9b9b9b]'
                    ].join(' ')}
                  >
                    {track.checked ? '✓' : '•'}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(28,minmax(0,1fr))]">
                  {track.values.map((level, index) => (
                    <span
                      key={`${track.title}-${index}`}
                      className={[
                        'h-3 w-full rounded-[3px] border',
                        heatCellClass(level, track.tone)
                      ].join(' ')}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#303030] bg-[#171717]/85 p-5">
          <h2 className="text-sm font-semibold text-[#e1e1e1]">Performance Graph</h2>
          <p className="mt-2 text-sm text-[#c4c4c4]">Weekly focused-hours trend.</p>

          <div className="mt-4 grid grid-cols-7 gap-2">
            {weeklyPerformance.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-2">
                <div className="flex h-28 w-full items-end rounded-lg border border-[#2f2f2f] bg-[#1c1c1c] p-1.5">
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-[#0f7d63] via-[#169377] to-[#36c4a5]"
                    style={{ height: `${Math.max(12, (item.hours / maxWeeklyHours) * 100)}%` }}
                    title={`${item.day}: ${item.hours} h`}
                  />
                </div>
                <span className="text-[11px] text-[#9f9f9f]">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[#2f2f2f] bg-[#1c1c1c] p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[#979797]">Upcoming Milestones</p>
            <ul className="mt-2 space-y-2">
              {upcomingMilestones.map((milestone) => (
                <li
                  key={milestone}
                  className="rounded-md border border-[#343434] bg-[#1f1f1f] px-2.5 py-1.5 text-sm text-[#c8c8c8]"
                >
                  {milestone}
                </li>
              ))}
            </ul>
          </div>
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
