import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../hooks/useAuth'
import {
  getDSADifficultyDistribution,
  getSummaryMetrics,
  getWeeklyHours
} from '../services/analyticsApi'

function maxHours(trend) {
  const max = Math.max(...trend.map((item) => item.hours), 1)
  return max
}

export default function AnalyticsPage() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const [metrics, setMetrics] = useState({
    totalLogs: 0,
    totalHours: 0,
    totalSolved: 0,
    projectCount: 0
  })
  const [weeklyTrend, setWeeklyTrend] = useState([])
  const [dsaDistribution, setDsaDistribution] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const trendMax = useMemo(() => maxHours(weeklyTrend), [weeklyTrend])

  useEffect(() => {
    let mounted = true

    async function loadAnalytics() {
      setIsLoading(true)

      try {
        const [summaryResponse, weeklyResponse, distributionResponse] = await Promise.all([
          getSummaryMetrics(token),
          getWeeklyHours(token),
          getDSADifficultyDistribution(token)
        ])

        if (!mounted) {
          return
        }

        setMetrics(summaryResponse.metrics)
        setWeeklyTrend(weeklyResponse.trend || [])
        setDsaDistribution(distributionResponse.distribution || [])
        setError('')
      } catch (requestError) {
        if (!mounted) {
          return
        }

        setError(requestError.message)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadAnalytics()

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
      pageTitle="Analytics"
      pageSubtitle="Live insight from logs, DSA progress, and projects"
    >
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-[#303030] bg-[#171717]/85 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[#9f9f9f]">Total Logs</p>
          <p className="mt-2 text-2xl font-semibold text-[#f1f1f1]">{metrics.totalLogs}</p>
        </article>
        <article className="rounded-xl border border-[#303030] bg-[#171717]/85 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[#9f9f9f]">Total Hours</p>
          <p className="mt-2 text-2xl font-semibold text-[#f1f1f1]">{Number(metrics.totalHours).toFixed(1)}</p>
        </article>
        <article className="rounded-xl border border-[#303030] bg-[#171717]/85 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[#9f9f9f]">DSA Solved</p>
          <p className="mt-2 text-2xl font-semibold text-[#f1f1f1]">{metrics.totalSolved}</p>
        </article>
        <article className="rounded-xl border border-[#303030] bg-[#171717]/85 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[#9f9f9f]">Projects</p>
          <p className="mt-2 text-2xl font-semibold text-[#f1f1f1]">{metrics.projectCount}</p>
        </article>
      </section>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-[#303030] bg-[#171717]/85 p-5">
          <h2 className="text-sm font-semibold text-[#e1e1e1]">Weekly Hours Trend</h2>
          <p className="mt-1 text-sm text-[#c4c4c4]">Last 7 days of focused work.</p>

          {isLoading ? <p className="mt-4 text-sm text-[#b8b8b8]">Loading chart...</p> : null}

          {!isLoading ? (
            <div className="mt-4 grid grid-cols-7 gap-2">
              {weeklyTrend.map((item) => (
                <div key={item.date} className="flex flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end rounded-lg border border-[#2f2f2f] bg-[#1c1c1c] p-1.5">
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-[#0f7d63] via-[#169377] to-[#36c4a5]"
                      style={{ height: `${Math.max(8, (item.hours / trendMax) * 100)}%` }}
                      title={`${item.label}: ${item.hours}h`}
                    />
                  </div>
                  <span className="text-xs text-[#9f9f9f]">{item.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-[#303030] bg-[#171717]/85 p-5">
          <h2 className="text-sm font-semibold text-[#e1e1e1]">DSA Difficulty Distribution</h2>
          <p className="mt-1 text-sm text-[#c4c4c4]">Balance between easy, medium, and hard problems.</p>

          {isLoading ? <p className="mt-4 text-sm text-[#b8b8b8]">Loading distribution...</p> : null}

          {!isLoading ? (
            <div className="mt-4 space-y-3">
              {dsaDistribution.map((item) => {
                const maxCount = Math.max(...dsaDistribution.map((row) => row.count), 1)
                const width = Math.max(10, (item.count / maxCount) * 100)

                return (
                  <div key={item.difficulty}>
                    <div className="mb-1 flex items-center justify-between text-xs text-[#bdbdbd]">
                      <span>{item.difficulty}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#242424]">
                      <div
                        className="h-2.5 rounded-full bg-[#2cb395]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </section>
      </div>
    </DashboardLayout>
  )
}
